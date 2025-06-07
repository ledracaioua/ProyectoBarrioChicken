import React from 'react';
import { Product } from '../types';
import {
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onMove: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onMove,
}) => {
  const isLowStock = product.quantity <= product.reorderPoint;
  const isExpiring =
    new Date(product.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 border ${
        isExpiring ? 'border-yellow-300' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-yellow-100 text-yellow-600 transition"
            title="Editar"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onMove}
            className="p-1 rounded hover:bg-green-100 text-green-600 transition"
            title="Movimentar"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-100 text-red-600 transition"
            title="Excluir"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 text-sm">
        <div>
          <p className="text-gray-500">Categoria:</p>
          <p className="font-medium text-gray-800">{product.category}</p>
        </div>
        <div>
          <p className="text-gray-500">Fornecedor:</p>
          <p className="font-medium text-gray-800">{product.supplier}</p>
        </div>
        <div>
          <p className="text-gray-500">Preço:</p>
          <p className="font-medium text-gray-800">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Estoque:</p>
          <p
            className={`font-medium ${
              isLowStock ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            {product.quantity} {product.unit}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Ponto de Reorden:</p>
          <p className="font-medium text-gray-800">
            {product.reorderPoint} {product.unit}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Lote:</p>
          <p className="font-medium text-gray-800">{product.batch}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500">Validade:</p>
          <p
            className={`font-medium ${
              isExpiring ? 'text-yellow-600' : 'text-gray-800'
            }`}
          >
            {new Date(product.expiryDate).toLocaleDateString()}
            {isExpiring && ' (próximo a vencer!)'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
