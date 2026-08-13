import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Product, Category, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/mockProducts';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const ORDERS_COLLECTION = 'orders';

// Initial seed orders for demo
const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    customerName: 'Yordanos Bekele',
    customerPhone: '+251911223344',
    customerCity: 'Addis Ababa (Bole)',
    items: [
      {
        productId: 'prod-1',
        productName: 'Black ripped wide-leg baggy jeans with distressing on the knees',
        price: 2600,
        size: 'M',
        color: 'Washed Charcoal Black',
        quantity: 1
      }
    ],
    totalAmount: 2600,
    date: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    status: 'pending',
    channel: 'telegram',
    notes: 'Needs delivery by Saturday morning for a wedding ceremony.'
  },
  {
    id: 'ord-1002',
    customerName: 'Selamawit Tekle',
    customerPhone: '+251922334455',
    customerCity: 'Hawassa',
    items: [
      {
        productId: 'prod-10',
        productName: 'Black chiffon maxi dress with white floral print',
        price: 4200,
        size: 'S',
        color: 'Charcoal & Floral White',
        quantity: 1
      }
    ],
    totalAmount: 4200,
    date: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
    status: 'contacted',
    channel: 'whatsapp',
    notes: 'Inquired about shipping via EMS.'
  }
];

function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) return null as any;
  return JSON.parse(JSON.stringify(data));
}

// --- PRODUCTS ---
export async function getStoredProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (snapshot.empty) {
      return INITIAL_PRODUCTS;
    }
    const products: Product[] = [];
    snapshot.forEach((docSnap) => {
      products.push(docSnap.data() as Product);
    });
    return products;
  } catch (error) {
    console.warn('Error fetching products from Firestore, returning fallback defaults:', error);
    return INITIAL_PRODUCTS;
  }
}

export async function saveStoredProducts(products: Product[]): Promise<void> {
  try {
    for (const p of products) {
      const cleanData = sanitizeForFirestore(p);
      await setDoc(doc(db, PRODUCTS_COLLECTION, cleanData.id), cleanData);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COLLECTION);
  }
}

export async function saveSingleProduct(product: Product): Promise<void> {
  try {
    const cleanData = sanitizeForFirestore(product);
    await setDoc(doc(db, PRODUCTS_COLLECTION, cleanData.id), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${product.id}`);
  }
}

export async function deleteSingleProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${productId}`);
  }
}

// --- CATEGORIES ---
export async function getStoredCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (snapshot.empty) {
      return INITIAL_CATEGORIES;
    }
    const categories: Category[] = [];
    snapshot.forEach((docSnap) => {
      categories.push(docSnap.data() as Category);
    });
    return categories;
  } catch (error) {
    console.warn('Error fetching categories from Firestore, returning fallback defaults:', error);
    return INITIAL_CATEGORIES;
  }
}

export async function saveStoredCategories(categories: Category[]): Promise<void> {
  try {
    for (const c of categories) {
      const cleanData = sanitizeForFirestore(c);
      await setDoc(doc(db, CATEGORIES_COLLECTION, cleanData.id), cleanData);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, CATEGORIES_COLLECTION);
  }
}

export async function saveSingleCategory(category: Category): Promise<void> {
  try {
    const cleanData = sanitizeForFirestore(category);
    await setDoc(doc(db, CATEGORIES_COLLECTION, cleanData.id), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${CATEGORIES_COLLECTION}/${category.id}`);
  }
}

export async function deleteSingleCategory(categoryId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CATEGORIES_COLLECTION}/${categoryId}`);
  }
}

// --- ORDERS ---
export async function getStoredOrders(): Promise<Order[]> {
  try {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    if (snapshot.empty) {
      return SEED_ORDERS;
    }
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as Order);
    });
    // Sort orders by date descending
    orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return orders;
  } catch (error: any) {
    if (error?.code === 'permission-denied' || (typeof error?.message === 'string' && error.message.includes('permissions'))) {
      // Quietly return seed orders if user is unauthenticated or not an admin
      return SEED_ORDERS;
    }
    console.warn('Error fetching orders from Firestore:', error);
    return SEED_ORDERS;
  }
}

export async function saveStoredOrders(orders: Order[]): Promise<void> {
  try {
    for (const o of orders) {
      const cleanData = sanitizeForFirestore(o);
      await setDoc(doc(db, ORDERS_COLLECTION, cleanData.id), cleanData);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, ORDERS_COLLECTION);
  }
}

export async function saveSingleOrder(order: Order): Promise<void> {
  try {
    const cleanData = sanitizeForFirestore(order);
    await setDoc(doc(db, ORDERS_COLLECTION, cleanData.id), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${ORDERS_COLLECTION}/${order.id}`);
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(orderRef, { status }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
  }
}

export async function deleteSingleOrder(orderId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ORDERS_COLLECTION}/${orderId}`);
  }
}

// --- ONE-TIME DATA SEEDING (Admin Triggered) ---
export async function seedFirestoreWithDefaults(overwrite = false): Promise<{
  productsCount: number;
  categoriesCount: number;
  ordersCount: number;
}> {
  try {
    // 1. Seed categories
    const categoriesSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    let seededCategories = 0;
    if (categoriesSnap.empty || overwrite) {
      for (const cat of INITIAL_CATEGORIES) {
        const cleanCat = sanitizeForFirestore(cat);
        await setDoc(doc(db, CATEGORIES_COLLECTION, cleanCat.id), cleanCat);
        seededCategories++;
      }
    }

    // 2. Seed products
    const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    let seededProducts = 0;
    if (productsSnap.empty || overwrite) {
      for (const prod of INITIAL_PRODUCTS) {
        const cleanProd = sanitizeForFirestore(prod);
        await setDoc(doc(db, PRODUCTS_COLLECTION, cleanProd.id), cleanProd);
        seededProducts++;
      }
    }

    // 3. Seed orders
    const ordersSnap = await getDocs(collection(db, ORDERS_COLLECTION));
    let seededOrders = 0;
    if (ordersSnap.empty || overwrite) {
      for (const ord of SEED_ORDERS) {
        const cleanOrd = sanitizeForFirestore(ord);
        await setDoc(doc(db, ORDERS_COLLECTION, cleanOrd.id), cleanOrd);
        seededOrders++;
      }
    }

    return {
      productsCount: seededProducts,
      categoriesCount: seededCategories,
      ordersCount: seededOrders
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed');
    throw error;
  }
}
