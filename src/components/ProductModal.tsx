  import React, { useState, useEffect } from 'react';
  import { X } from 'lucide-react';
  import { Product, Supplier } from '../types';
  import { Autocomplete, TextField } from '@mui/material';
  import { getSuppliers } from '../api/suppliers';
  import { getCategories } from '../api/categories';

  interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
    onSave: (product: Omit<Product, '_id'> | Product) => void;
    availableUnits: string[];
  }

  const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    product,
    onSave,
    availableUnits,
  }) => {
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

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
      getSuppliers().then((res) => setSuppliers(res.data));
      getCategories().then((res) => setCategories(res.data));
    }, []);

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
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-4 overflow-visible">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {product ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Nombre" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <InputField label="SKU" type="text" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />

              <AutocompleteField
                label="Categoría"
                options={categories}
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                placeholder="Ej: Carnes, Verduras..."
              />

              <AutocompleteField
                label="Proveedor"
                options={suppliers.map((s) => s.name)}
                value={formData.supplier}
                onChange={(value) => setFormData({ ...formData, supplier: value })}
                placeholder="Seleccione proveedor"
              />

              {/* Quantidade e Unidade juntos */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <InputField
                    label="Cantidad"
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                  <Autocomplete
                    freeSolo
                    options={availableUnits}
                    inputValue={formData.unit || ''}
                    onInputChange={(_, newInputValue) =>
                      setFormData({ ...formData, unit: newInputValue })
                    }
                    renderInput={(params) => (
                      <TextField {...params} required fullWidth />
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <InputField
                    label="Precio Unitario"
                    type="text"
                    required
                    value={new Intl.NumberFormat('es-CL', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(formData.price || 0)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\./g, '').replace(',', '.');
                      const parsed = parseFloat(raw);
                      if (!isNaN(parsed)) {
                        setFormData({ ...formData, price: parsed });
                      } else {
                        setFormData({ ...formData, price: 0 });
                      }
                    }}
                  />

                </div>
                <div className="flex-1">
                  <InputField
                    label="Valor Total"
                    type="text"
                    value={
                      new Intl.NumberFormat('es-CL', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(formData.quantity??0 * (formData.price??0))
                    }
                    readOnly
                    className="bg-gray-100 text-gray-500"
                  />
                </div>
              </div>

              <InputField
                label="Lote"
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              />

              <InputField
                label="Punto de Reorden"
                type="number"
                min="0"
                required
                value={formData.reorderPoint}
                onChange={(e) =>
                  setFormData({ ...formData, reorderPoint: Number(e.target.value) })
                }
              />

              <InputField
                label="Fecha de Ingreso"
                type="date"
                required
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
              />

              <InputField
                label="Fecha de Caducidad"
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-2"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
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
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-2"
      />
    </div>
  );

  interface AutocompleteFieldProps {
    label: string;
    value: string | undefined;
    options: string[];
    onChange: (value: string) => void;
    placeholder?: string;
  }

  const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
    label,
    value,
    options,
    onChange,
    placeholder,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Autocomplete
        freeSolo
        options={options}
        inputValue={value || ''}
        onInputChange={(_, newInputValue) => onChange(newInputValue)}
        renderInput={(params) => (
          <TextField {...params} placeholder={placeholder} required fullWidth />
        )}
      />
    </div>
  );

  export default ProductModal;
