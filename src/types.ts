export interface Product {
  _id?: string; // <-- Adicionado como opcional
  name: string;
  sku: string;
  category: string;
  supplier: string;
  quantity: number;
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
