export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  supplier: string;
  quantity: number;
  price: number;
  batch: string;
  entryDate: string;
  expiryDate: string;
  reorderPoint: number;
  description?: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  date: string;
  notes?: string;
}

export type MovementReason = 
  | 'Purchase'
  | 'Sale'
  | 'Loss'
  | 'Theft'
  | 'Expiry'
  | 'Damage'
  | 'Return'
  | 'Adjustment';