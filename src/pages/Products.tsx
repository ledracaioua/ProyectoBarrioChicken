import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { getItems, addItem, updateItem, deleteItem } from '../api/items';
import ProductModal from '../components/ProductModal';
import MovementModal from '../components/MovementModal';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-hot-toast';


const availableUnits = ['kg', 'unidades', 'bolsas', 'caixas', 'litros'];

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
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsProductModalOpen(true);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={() => {
              setSelectedProduct(product);
              setIsProductModalOpen(true);
            }}
            onDelete={() => handleDelete(product)}
            onMove={() => handleOpenMovement(product)}
          />
        ))}
      </div>

      <ProductModal
              isOpen={isProductModalOpen}
              onClose={() => {
                setIsProductModalOpen(false);
                toast.success('Producto registrado com sucesso');
              }}
              product={selectedProduct || undefined}
              onSave={handleSaveProduct}
              availableUnits={availableUnits}
            />

      {selectedProduct && (
        <MovementModal
          isOpen={isMovementModalOpen}
          onClose={() => {
            setIsMovementModalOpen(false);
            toast.success('Movimentación registrada com sucesso');
          }}
          product={selectedProduct}
        />    
      )}
    </div>
  );
};

export default Products;