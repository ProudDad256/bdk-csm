export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  KITCHEN = 'KITCHEN',
  WAITER = 'WAITER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  lastUpdated: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  timestamp: Date;
  staffId: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export type ViewState = 'DASHBOARD' | 'POS' | 'KITCHEN' | 'INVENTORY' | 'MENU' | 'STAFF' | 'REPORTS';
