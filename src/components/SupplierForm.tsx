import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';

interface SupplierFormProps {
  supplier?: Supplier;
  onSave: (supplier: Supplier) => void;
  onCancel: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Supplier>({
    name: '',
    rut: '',
    insumo: '',
    email: '',
    additionalInfo: '',
    categories: [],
  });

  const [categoryInput, setCategoryInput] = useState('');

  useEffect(() => {
    if (supplier) {
      setFormData({ ...supplier, categories: supplier.categories || [] });
    }
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCategory = () => {
    const trimmed = categoryInput.trim();
    if (trimmed && !formData.categories?.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        categories: [...(prev.categories || []), trimmed],
      }));
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories?.filter(c => c !== cat),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {supplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* RUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
            <input
              type="text"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Insumo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insumo</label>
            <input
              type="text"
              name="insumo"
              value={formData.insumo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Información adicional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Información Adicional</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo || ''}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Categorías */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
            <div className="flex">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2"
                placeholder="Añadir categoría"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
              >
                Añadir
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.categories?.map((cat, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-2 py-1 rounded-md text-sm flex items-center"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#DB2323] text-white rounded-md hover:bg-red-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;
