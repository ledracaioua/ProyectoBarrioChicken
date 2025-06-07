export interface Product {
  _id?: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  quantity: number;
  unit: string;
  price: number;
  batch: string;
  entryDate: string;
  expiryDate: string;
  reorderPoint: number;
  description: string;
}

export interface InventoryMovement {
  _id?: string;
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  date: string;
  notes?: string;
}

export type MovementReason = 
  | 'Compra'
  | 'Venta'
  | 'Perdida'
  | 'Robo'
  | 'Vencimiento'
  | 'Dano'
  | 'Devolucion'
  | 'Ajuste';

export interface Supplier {
  _id?: string;
  name: string;
  rut: string;
  insumo: string;
  email?: string;
  additionalInfo?: string;
  categories?: string[];
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  supplier: string;
  status: 'pending' | 'processing' | 'delivered' | 'delayed' | 'cancelled';
  items: OrderItem[];
  total: number;
  createdAt: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  paymentMethod: string;
  notes?: string;
  statusHistory: {
    status: string;
    timestamp: string;
    comment?: string;
  }[];
}