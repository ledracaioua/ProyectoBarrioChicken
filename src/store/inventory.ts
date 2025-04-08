import { create } from 'zustand';
import { Product, InventoryMovement } from '../types';

interface InventoryState {
  products: Product[];
  movements: InventoryMovement[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  recordMovement: (movement: InventoryMovement) => void;
  getProduct: (id: string) => Product | undefined;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: [],
  movements: [],
  
  addProduct: (product) => 
    set((state) => ({ products: [...state.products, product] })),
  
  updateProduct: (product) => 
    set((state) => ({
      products: state.products.map((p) => 
        p.id === product.id ? product : p
      ),
    })),
  
  recordMovement: (movement) => {
    set((state) => ({ movements: [...state.movements, movement] }));
    const product = get().getProduct(movement.productId);
    if (product) {
      const updatedQuantity = movement.type === 'IN' 
        ? product.quantity + movement.quantity
        : product.quantity - movement.quantity;
      get().updateProduct({ ...product, quantity: updatedQuantity });
    }
  },
  
  getProduct: (id) => get().products.find((p) => p.id === id),
}));