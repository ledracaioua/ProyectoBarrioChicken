import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Order, OrderItem } from '../types';
import { format } from 'date-fns';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<Order, '_id'>) => void;
  lastOrderNumber?: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, onSave, lastOrderNumber }) => {
  const generateOrderNumber = () => {
    if (!lastOrderNumber) return 'ORD-001';
    const currentNumber = parseInt(lastOrderNumber.split('-')[1]);
    return `ORD-${String(currentNumber + 1).padStart(3, '0')}`;
  };

  const [formData, setFormData] = useState<Partial<Order>>({
    orderNumber: generateOrderNumber(),
    supplier: '',
    status: 'pending',
    items: [],
    total: 0,
    createdAt: new Date().toISOString(),
    estimatedDelivery: '',
    deliveryAddress: 'Av. Camilo Henríquez 3692',
    paymentMethod: '',
    notes: '',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
      },
    ],
  });

  const [newItem, setNewItem] = useState<Partial<OrderItem>>({
    name: '',
    quantity: 1,
    price: 0,
  });

  const addItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) return;

    const item: OrderItem = {
      productId: Date.now().toString(), // Temporary ID
      name: newItem.name,
      quantity: newItem.quantity,
      price: newItem.price,
      subtotal: newItem.quantity * newItem.price,
    };

    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), item],
      total: (prev.total || 0) + item.subtotal,
    }));

    setNewItem({
      name: '',
      quantity: 1,
      price: 0,
    });
  };

  const removeItem = (index: number) => {
    const items = formData.items || [];
    const removedItem = items[index];
    
    setFormData(prev => ({
      ...prev,
      items: items.filter((_, i) => i !== index),
      total: (prev.total || 0) - removedItem.subtotal,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier || !formData.deliveryAddress || !formData.paymentMethod || !formData.items?.length) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    onSave(formData as Omit<Order, '_id'>);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Nuevo Pedido</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Proveedor</label>
              <input
                type="text"
                required
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Entrega Estimada</label>
              <input
                type="datetime-local"
                required
                value={formData.estimatedDelivery?.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, estimatedDelivery: new Date(e.target.value).toISOString() })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección de Entrega</label>
              <input
                type="text"
                required
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
              <select
                required
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="">Seleccionar método</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          {/* Agregar insumos */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Insumos</h3>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del insumo</label>
                <input
                  type="text"
                  placeholder="Nombre del insumo"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Precio"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lista de insumos */}
            <div className="bg-gray-50 rounded-lg p-4">
              {formData.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${item.price.toLocaleString()} = ${item.subtotal.toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {formData.items?.length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay insumos agregados</p>
              )}
              {formData.items?.length > 0 && (
                <div className="border-t border-gray-200 mt-4 pt-4 text-right">
                  <p className="text-lg font-medium">
                    Total: ${formData.total?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              Crear Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;

/*
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ChevronDown } from 'lucide-react';
import { Order, OrderItem, Supplier, Product } from '../types';
import { format } from 'date-fns';
import { getSuppliers } from '../api/suppliers';
import { getItems } from '../api/items';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<Order, '_id'>) => void;
  lastOrderNumber?: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, onSave, lastOrderNumber }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const generateOrderNumber = () => {
    if (!lastOrderNumber) return 'ORD-001';
    const currentNumber = parseInt(lastOrderNumber.split('-')[1]);
    return `ORD-${String(currentNumber + 1).padStart(3, '0')}`;
  };

  const [formData, setFormData] = useState<Partial<Order>>({
    orderNumber: generateOrderNumber(),
    supplier: '',
    status: 'pending',
    items: [],
    total: 0,
    createdAt: new Date().toISOString(),
    estimatedDelivery: '',
    deliveryAddress: 'Av. Camilo Henríquez 3692',
    paymentMethod: '',
    notes: '',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
      },
    ],
  });

  const [newItem, setNewItem] = useState<Partial<OrderItem>>({
    name: '',
    quantity: 1,
    price: 0,
  });

  // Cargar proveedores y productos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadSuppliers();
      loadProducts();
    }
  }, [isOpen]);

  // Filtrar productos cuando cambie el proveedor seleccionado
  useEffect(() => {
    if (formData.supplier) {
      const supplierProducts = products.filter(product => 
        product.supplier.toLowerCase() === formData.supplier.toLowerCase()
      );
      setFilteredProducts(supplierProducts);
    } else {
      setFilteredProducts([]);
    }
    // Limpiar el producto seleccionado cuando cambie el proveedor
    setNewItem(prev => ({ ...prev, name: '', price: 0 }));
    setProductSearch('');
  }, [formData.supplier, products]);

  const loadSuppliers = async () => {
    try {
      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await getItems();
      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  // Filtrar proveedores basado en la búsqueda
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  // Filtrar productos del proveedor seleccionado basado en la búsqueda
  const searchFilteredProducts = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSupplierSelect = (supplierName: string) => {
    setFormData({ ...formData, supplier: supplierName });
    setSupplierSearch(supplierName);
    setShowSupplierDropdown(false);
  };

  const handleProductSelect = (product: Product) => {
    setNewItem({
      ...newItem,
      name: product.name,
      price: product.price,
    });
    setProductSearch(product.name);
    setShowProductDropdown(false);
  };

  const addItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) return;

    const item: OrderItem = {
      productId: Date.now().toString(), // Temporary ID
      name: newItem.name,
      quantity: newItem.quantity,
      price: newItem.price,
      subtotal: newItem.quantity * newItem.price,
    };

    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), item],
      total: (prev.total || 0) + item.subtotal,
    }));

    setNewItem({
      name: '',
      quantity: 1,
      price: 0,
    });
    setProductSearch('');
  };

  const removeItem = (index: number) => {
    const items = formData.items || [];
    const removedItem = items[index];
    
    setFormData(prev => ({
      ...prev,
      items: items.filter((_, i) => i !== index),
      total: (prev.total || 0) - removedItem.subtotal,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier || !formData.deliveryAddress || !formData.paymentMethod || !formData.items?.length) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    onSave(formData as Omit<Order, '_id'>);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Nuevo Pedido</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {//Información básica }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {// Proveedor con dropdown }
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={supplierSearch}
                  onChange={(e) => {
                    setSupplierSearch(e.target.value);
                    setFormData({ ...formData, supplier: e.target.value });
                    setShowSupplierDropdown(true);
                  }}
                  onFocus={() => setShowSupplierDropdown(true)}
                  placeholder="Buscar proveedor..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {// Dropdown de proveedores }
                {showSupplierDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <button
                          key={supplier._id}
                          type="button"
                          onClick={() => handleSupplierSelect(supplier.name)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{supplier.name}</p>
                            <p className="text-sm text-gray-500 truncate">{supplier.insumo}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No se encontraron proveedores
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega Estimada *</label>
              <input
                type="datetime-local"
                required
                value={formData.estimatedDelivery?.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, estimatedDelivery: new Date(e.target.value).toISOString() })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega *</label>
              <input
                type="text"
                required
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago *</label>
              <select
                required
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="">Seleccionar método</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>


          {// Lista de insumos }
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Insumos</h3>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del insumo</label>
                <input
                  type="text"
                  placeholder="Nombre del insumo"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Precio"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {// Lista de insumos }
            <div className="bg-gray-50 rounded-lg p-4">
              {formData.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${item.price.toLocaleString()} = ${item.subtotal.toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {formData.items?.length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay insumos agregados</p>
              )}
              {formData.items?.length > 0 && (
                <div className="border-t border-gray-200 mt-4 pt-4 text-right">
                  <p className="text-lg font-medium">
                    Total: ${formData.total?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
            

          {// Notas }
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Notas adicionales sobre el pedido..."
            />
          </div>

          {// Botones }
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Crear Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
*/