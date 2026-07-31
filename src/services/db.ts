import { Product, Category, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/mockProducts';

const PRODUCTS_KEY = 'ethioshein_products_v3';
const CATEGORIES_KEY = 'ethioshein_categories_v3';
const ORDERS_KEY = 'ethioshein_orders_v2';

export function getStoredProducts(): Product[] {
  const data = localStorage.getItem(PRODUCTS_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing stored products', e);
    return INITIAL_PRODUCTS;
  }
}

export function saveStoredProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getStoredCategories(): Category[] {
  const data = localStorage.getItem(CATEGORIES_KEY);
  if (!data) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing stored categories', e);
    return INITIAL_CATEGORIES;
  }
}

export function saveStoredCategories(categories: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function getStoredOrders(): Order[] {
  const data = localStorage.getItem(ORDERS_KEY);
  if (!data) {
    // Return some seed inquiries for demo purposes
    const seedOrders: Order[] = [
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
    localStorage.setItem(ORDERS_KEY, JSON.stringify(seedOrders));
    return seedOrders;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing stored orders', e);
    return [];
  }
}

export function saveStoredOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
