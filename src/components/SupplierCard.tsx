import React from 'react';
import { Supplier } from '../types';

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-medium text-gray-800">{supplier.name}</h3>
          <p className="text-sm text-gray-500">RUT: {supplier.rut}</p>
          <p className="text-sm text-gray-500">Insumo: {supplier.insumo}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(supplier._id!)}
            className="px-3 py-1 text-sm text-[#DB2323] hover:bg-red-50 rounded-md transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(supplier._id!)}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

      {supplier.email && (
        <p className="text-sm text-gray-600">Email: {supplier.email}</p>
      )}
      {supplier.additionalInfo && (
        <p className="text-sm text-gray-600 mt-2">{supplier.additionalInfo}</p>
      )}

      {supplier.categories && supplier.categories.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Categorías:</p>
          <div className="flex flex-wrap gap-2">
            {supplier.categories.map((cat, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierCard;
