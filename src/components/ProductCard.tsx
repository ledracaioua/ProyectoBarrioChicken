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
  // Fallbacks para campos possivelmente ausentes
  const quantity = product.quantity ?? 0;
  const reorderPoint = product.reorderPoint ?? 0;

  const isLowStock = quantity <= reorderPoint;

  const expiryDateObj = product.expiryDate ? new Date(product.expiryDate) : null;
  const isExpiring = expiryDateObj
    ? expiryDateObj <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    : false;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 border ${
        isExpiring ? 'border-yellow-300' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {product.name ?? '—'}
          </h3>
          <p className="text-sm text-gray-500">SKU: {product.sku ?? '—'}</p>
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
        <Detail label="Categoria" value={product.category ?? '—'} />
        <Detail label="Fornecedor" value={product.supplier ?? '—'} />
        <Detail
          label="Preço"
          value={
            product.price !== undefined && product.price !== null
              ? `$${product.price.toFixed(2)}`
              : '—'
          }
        />
        <Detail
          label="Estoque"
          value={`${quantity} ${product.unit ?? ''}`}
          highlight={isLowStock}
        />
        <Detail
          label="Ponto de Reorden"
          value={`${reorderPoint} ${product.unit ?? ''}`}
        />
        <Detail label="Lote" value={product.batch ?? '—'} />
        <Detail
          label="Validade"
          value={
            expiryDateObj ? expiryDateObj.toLocaleDateString() : '—'
          }
          full
          warn={isExpiring}
        />
      </div>
    </div>
  );
};

const Detail = ({
  label,
  value,
  highlight = false,
  full = false,
  warn = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  full?: boolean;
  warn?: boolean;
}) => (
  <div className={`${full ? 'col-span-2' : ''}`}>
    <p className="text-gray-500">{label}:</p>
    <p
      className={`font-medium ${
        highlight ? 'text-red-600' : warn ? 'text-yellow-600' : 'text-gray-800'
      }`}
    >
      {value}
      {warn && ' (próximo a vencer!)'}
    </p>
  </div>
);

export default ProductCard;
