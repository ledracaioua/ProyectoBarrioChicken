// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

interface Product {
  _id?: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  quantity: number;
  price: number;
  batch: string;
  entryDate: string;
  expiryDate: string;
  reorderPoint: number;
  description: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('http://localhost:5000/api/items');
        setProducts(response.data);
      } catch (err) {
        setError('Erro ao carregar os produtos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const stats = [
    {
      title: 'Total Produtos',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Stock Bajo',
      value: products.filter(p => p.quantity <= p.reorderPoint).length,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
    {
      title: 'Próximos a Vencer',
      value: products.filter(p => {
        const expiryDate = new Date(p.expiryDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 15);
        return expiryDate <= thirtyDaysFromNow;
      }).length,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Movimientos Hoy',
      value: '0',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
  ];

  if (loading) {
    return <div className="text-center mt-10">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">
        Panel de Control
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-6 flex items-center space-x-4"
          >
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Produtos com Stock Bajo
          </h2>
          <div className="space-y-4">
            {products
              .filter(p => p.quantity <= p.reorderPoint)
              .slice(0, 5)
              .map(product => (
                <div
                  key={product._id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">
                      {product.quantity} unidades
                    </p>
                    <p className="text-sm text-gray-500">
                      Mínimo: {product.reorderPoint}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Próximos a Vencer
          </h2>
          <div className="space-y-4">
            {products
              .filter(p => {
                const expiryDate = new Date(p.expiryDate);
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                return expiryDate <= thirtyDaysFromNow;
              })
              .slice(0, 5)
              .map(product => (
                <div
                  key={product._id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Lote: {product.batch}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-yellow-600">
                      {new Date(product.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.quantity} unidades
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
