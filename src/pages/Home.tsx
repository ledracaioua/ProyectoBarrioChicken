import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, Package, TrendingUp, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

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
  const [loading, setLoading] = useState(true);
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

  const today = new Date();
  const in30Days = new Date();
  in30Days.setDate(today.getDate() + 30);

  const lowStock = products.filter(p => p.quantity <= p.reorderPoint);
  const expiringSoon = products.filter(p => {
    const expiry = new Date(p.expiryDate);
    return expiry <= in30Days && expiry >= today;
  });

  const chartData = products.map(p => ({
    name: p.name,
    stock: p.quantity,
    reorderPoint: p.reorderPoint,
  }));

  if (loading) return <div className="text-center mt-10">Carregando produtos...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Produtos', value: products.length, icon: Package, color: 'bg-blue-500' },
          { title: 'Stock Bajo', value: lowStock.length, icon: AlertTriangle, color: 'bg-red-500' },
          { title: 'Próximos a Vencer', value: expiringSoon.length, icon: Clock, color: 'bg-yellow-500' },
          { title: 'Movimentos Hoje', value: 0, icon: TrendingUp, color: 'bg-green-500' },
        ].map(stat => (
          <div key={stat.title} className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
            <div className={`${stat.color} p-4 rounded-full`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lowStock.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center text-red-700 font-semibold text-lg">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Stock Bajo
              </h2>
              <button
                className="text-sm text-red-700 hover:underline font-medium"
                onClick={() => alert('Abrir lista completa de produtos com stock baixo')}
              >
                Ver todos
              </button>
            </div>
            <div className="space-y-3">
              {lowStock.slice(0, 5).map(product => (
                <div key={product._id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                  <div>
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-medium">{product.quantity} unidades</p>
                    <p className="text-sm text-gray-500">Mínimo: {product.reorderPoint}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {expiringSoon.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center text-yellow-700 font-semibold text-lg">
                <Clock className="w-5 h-5 mr-2" />
                Produtos por Vencer
              </h2>
              <button
                className="text-sm text-yellow-700 hover:underline font-medium"
                onClick={() => alert('Abrir lista completa de produtos por vencer')}
              >
                Ver todos
              </button>
            </div>
            <div className="space-y-3">
              {expiringSoon.slice(0, 5).map(product => (
                <div key={product._id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                  <div>
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">Lote: {product.batch}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-600 font-medium">
                      {new Date(product.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{product.quantity} unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Níveis de Estoque</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#DB2323" name="Estoque Atual" />
              <Bar dataKey="reorderPoint" fill="#FFC3C3" name="Ponto de Reorden" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;
