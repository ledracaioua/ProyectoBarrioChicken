import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventory';
import { Plus } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import MovementModal from '../components/MovementModal';

const Products = () => {
  const { products } = useInventoryStore();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsProductModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsProductModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsMovementModalOpen(true);
                  }}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Movimiento
                </button>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Categoría:</p>
                <p className="text-sm font-medium">{product.category}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Proveedor:</p>
                <p className="text-sm font-medium">{product.supplier}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Precio:</p>
                <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Stock:</p>
                <p className={`text-sm font-medium ${
                  product.quantity <= product.reorderPoint ? 'text-red-600' : ''
                }`}>
                  {product.quantity} unidades
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Punto de Reorden:</p>
                <p className="text-sm font-medium">{product.reorderPoint} unidades</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Lote:</p>
                <p className="text-sm font-medium">{product.batch}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Caducidad:</p>
                <p className="text-sm font-medium">
                  {new Date(product.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
      />

      {selectedProduct && (
        <MovementModal
          isOpen={isMovementModalOpen}
          onClose={() => setIsMovementModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Products;