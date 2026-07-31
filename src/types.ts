export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in ETB
  originalPrice?: number; // for discount display
  categoryId: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inventory: number;
  featured: boolean;
  brand: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
  }[];
  totalAmount: number;
  date: string;
  status: 'pending' | 'contacted' | 'completed' | 'canceled';
  channel: 'telegram' | 'whatsapp' | 'phone';
  notes?: string;
}

export type Language = 'en' | 'am';

export interface AdminUser {
  email: string;
  name: string;
  picture?: string;
}

