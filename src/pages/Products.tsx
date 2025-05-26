import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { getItems, addItem, updateItem, deleteItem } from '../api/items';
import ProductModal from '../components/ProductModal';
import MovementModal from '../components/MovementModal';
import { Menu } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getItems();
      const data = response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProducts([]);
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (productData._id) {
        await updateItem(productData._id, productData);
      } else {
        await addItem(productData);
      }
      await fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(`Deseja excluir "${product.name}"?`);
    if (!confirmed) return;

    try {
      await deleteItem(product._id!);
      await fetchProducts();
      toast.success('Produto excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      toast.error('Erro ao excluir produto.');
    }
  };

  const handleOpenMovement = (product: Product) => {
    setSelectedProduct(product);
    setIsMovementModalOpen(true);
    toast.success('Movimentar produto');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsProductModalOpen(true);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>

              {/* MENU DE AÇÕES */}
              <div className="relative">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="p-1 rounded hover:bg-gray-100">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsProductModalOpen(true);
                            }}
                            className={`${
                              active ? 'bg-yellow-100' : ''
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm text-yellow-700`}
                          >
                            <PencilIcon className="h-5 w-5 mr-2 text-yellow-500" />
                            Editar
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleOpenMovement(product)}
                            className={`${
                              active ? 'bg-green-100' : ''
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm text-green-700`}
                          >
                            <ArrowPathIcon className="h-5 w-5 mr-2 text-green-500" />
                            Movimiento
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleDelete(product)}
                            className={`${
                              active ? 'bg-red-100' : ''
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-700`}
                          >
                            <TrashIcon className="h-5 w-5 mr-2 text-red-500" />
                            Eliminar
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Detail label="Categoría" value={product.category} />
              <Detail label="Proveedor" value={product.supplier} />
              <Detail label="Precio" value={`$${product.price.toFixed(2)}`} />
              <Detail
                label="Stock"
                value={`${product.quantity} unidades`}
                highlight={product.quantity <= product.reorderPoint}
              />
              <Detail label="Punto de Reorden" value={`${product.reorderPoint} unidades`} />
              <Detail label="Lote" value={product.batch} />
              <Detail
                label="Caducidad"
                value={new Date(product.expiryDate).toLocaleDateString()}
              />
            </div>
          </div>
        ))}
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct || undefined}
        onSave={handleSaveProduct}
      />

      {selectedProduct && (
        <MovementModal
          isOpen={isMovementModalOpen}
          onClose={() => setIsMovementModalOpen(false)}
          product={selectedProduct}
          onSaved={fetchProducts}
        />
      )}
    </div>
  );
};

const Detail = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex justify-between">
    <p className="text-sm text-gray-500">{label}:</p>
    <p className={`text-sm font-medium ${highlight ? 'text-red-600' : ''}`}>{value}</p>
  </div>
);

export default Products;
