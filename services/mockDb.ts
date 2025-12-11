import { InventoryItem, MenuItem, Order, OrderStatus, User, UserRole } from '../types';

// Initial Mock Data
const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Rolex Special', category: 'Main', price: 5000, image: 'https://picsum.photos/200/200?random=1', available: true },
  { id: '2', name: 'Chicken Pilau', category: 'Main', price: 15000, image: 'https://picsum.photos/200/200?random=2', available: true },
  { id: '3', name: 'Beef Stew & Rice', category: 'Main', price: 12000, image: 'https://picsum.photos/200/200?random=3', available: true },
  { id: '4', name: 'African Tea', category: 'Beverage', price: 3000, image: 'https://picsum.photos/200/200?random=4', available: true },
  { id: '5', name: 'Passion Juice', category: 'Beverage', price: 4000, image: 'https://picsum.photos/200/200?random=5', available: true },
  { id: '6', name: 'Samosa (Pair)', category: 'Snack', price: 2000, image: 'https://picsum.photos/200/200?random=6', available: true },
  { id: '7', name: 'Chapati', category: 'Snack', price: 1000, image: 'https://picsum.photos/200/200?random=7', available: true },
  { id: '8', name: 'Matooke & G-Nut', category: 'Main', price: 10000, image: 'https://picsum.photos/200/200?random=8', available: true },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Rice', quantity: 50, unit: 'kg', threshold: 10, lastUpdated: '2024-10-25' },
  { id: '2', name: 'Beef', quantity: 15, unit: 'kg', threshold: 5, lastUpdated: '2024-10-26' },
  { id: '3', name: 'Milk', quantity: 20, unit: 'liters', threshold: 8, lastUpdated: '2024-10-26' },
  { id: '4', name: 'Sugar', quantity: 5, unit: 'kg', threshold: 10, lastUpdated: '2024-10-24' },
  { id: '5', name: 'Wheat Flour', quantity: 40, unit: 'kg', threshold: 15, lastUpdated: '2024-10-20' },
  { id: '6', name: 'Cooking Oil', quantity: 8, unit: 'liters', threshold: 10, lastUpdated: '2024-10-26' },
];

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin User', role: UserRole.ADMIN, avatar: 'https://picsum.photos/100/100?random=10' },
  { id: '2', name: 'John Doe', role: UserRole.CASHIER, avatar: 'https://picsum.photos/100/100?random=11' },
  { id: '3', name: 'Chef Mike', role: UserRole.KITCHEN, avatar: 'https://picsum.photos/100/100?random=12' },
];

// Simple state container
class MockDB {
  private menu: MenuItem[] = INITIAL_MENU;
  private inventory: InventoryItem[] = INITIAL_INVENTORY;
  private users: User[] = INITIAL_USERS;
  private orders: Order[] = [];

  constructor() {
    // Seed some past orders for the dashboard
    this.seedOrders();
  }

  private seedOrders() {
    const statuses = [OrderStatus.COMPLETED, OrderStatus.COMPLETED, OrderStatus.COMPLETED, OrderStatus.CANCELLED];
    const today = new Date();
    
    for(let i=0; i<20; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const date = new Date(today);
        date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Last 7 days
        
        this.orders.push({
            id: `ORD-${1000 + i}`,
            customerName: `Customer ${i+1}`,
            tableNumber: `${Math.floor(Math.random() * 10) + 1}`,
            items: [
                { ...this.menu[0], quantity: 1 },
                { ...this.menu[3], quantity: 1 }
            ],
            totalAmount: (this.menu[0].price + this.menu[3].price),
            status: randomStatus,
            timestamp: date,
            staffId: '2'
        });
    }
  }

  getMenu() { return this.menu; }
  getInventory() { return this.inventory; }
  getUsers() { return this.users; }
  getOrders() { return [...this.orders].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()); }
  
  addOrder(order: Order) {
    this.orders.unshift(order);
    // Simulate inventory reduction
    this.reduceInventory();
  }

  updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
    }
  }

  // Simulate reduction for demo purposes
  private reduceInventory() {
     this.inventory = this.inventory.map(item => ({
        ...item,
        quantity: Math.max(0, item.quantity - (Math.random() * 0.5))
     }));
  }
}

export const db = new MockDB();