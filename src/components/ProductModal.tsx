import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product } from '../types';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSave: (product: Omit<Product, '_id'> | Product) => void;
  availableUnits: string[]; // ['Kg', 'bolsas', ...]
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSave, availableUnits }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: '',
    supplier: '',
    quantity: 0,
    unit: '',
    price: 0,
    batch: '',
    entryDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    reorderPoint: 0,
    description: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        entryDate: product.entryDate?.slice(0, 10) || '',
        expiryDate: product.expiryDate?.slice(0, 10) || '',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        supplier: '',
        quantity: 0,
        unit: '',
        price: 0,
        batch: '',
        entryDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        reorderPoint: 0,
        description: '',
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.unit) return;

    if (product?._id) {
      onSave({ ...formData, _id: product._id } as Product);
    } else {
      const { _id, ...newProduct } = formData;
      onSave(newProduct as Omit<Product, '_id'>);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Nombre" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <InputField label="SKU" type="text" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
            <InputField label="Categoría" type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <InputField label="Proveedor" type="text" required value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} />
            <InputField label="Cantidad" type="number" required min="0" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} />
            <InputField label="Precio" type="number" required min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
            <InputField label="Lote" type="text" required value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} />
            <InputField label="Punto de Reorden" type="number" required min="0" value={formData.reorderPoint} onChange={(e) => setFormData({ ...formData, reorderPoint: Number(e.target.value) })} />
            <InputField label="Fecha de Ingreso" type="date" required value={formData.entryDate} onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })} />
            <InputField label="Fecha de Caducidad" type="date" required value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Cantidad</label>
            <Autocomplete
              freeSolo
              options={availableUnits}
              value={formData.unit || ''}
              onInputChange={(_, newValue) => setFormData({ ...formData, unit: newValue })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Ej: Kg, bolsas, caixas..."
                  className="mt-1"
                  required
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              rows={3}
            />
          </div>

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
              {product ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
    />
  </div>
);

export default ProductModal;
