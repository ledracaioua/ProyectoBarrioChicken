import React, { useEffect, useState } from 'react';
import { BarChart2, TrendingDown, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { getItems } from '../api/items';
import { getMovements } from '../api/movements';
import { Product, InventoryMovement } from '../types';

const Reports = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, movementsRes] = await Promise.all([
          getItems(),
          getMovements(),
        ]);
        setProducts(productsRes.data);
        setMovements(movementsRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  const totalValue = products.reduce((sum, product) =>
    sum + (product.price * product.quantity), 0
  );

  const lowStockProducts = products.filter(p => p.quantity <= p.reorderPoint);

  const recentMovements = [...movements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Valor Total del Inventario</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalValue.toFixed(2)}
              </p>
            </div>
            <BarChart2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Productos con Stock Bajo</p>
              <p className="text-2xl font-bold text-red-600">
                {lowStockProducts.length}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Productos</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Movimientos Recientes
          </h2>
        </div>

        {/* Scroll apenas na lista */}
        <div className="divide-y max-h-[400px] overflow-y-auto">
          {recentMovements.map((movement) => {
            const productId = typeof movement.productId === 'string'
              ? movement.productId
              : movement.productId?._id;

            const product = products.find(p => p._id === productId);

            return (
              <div key={movement._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {product?.name || 'Producto eliminado'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {movement.reason} – {movement.type === 'IN' ? 'Entrada' : 'Salida'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      movement.type === 'IN' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.type === 'IN' ? '+' : '-'}{movement.quantity} unidades
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(movement.date), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                {movement.notes && (
                  <p className="mt-2 text-sm text-gray-700">{movement.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;
