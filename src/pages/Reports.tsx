import React from 'react';
import { useInventoryStore } from '../store/inventory';
import { BarChart2, TrendingDown, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const Reports = () => {
  const { products, movements } = useInventoryStore();

  const totalValue = products.reduce((sum, product) => 
    sum + (product.price * product.quantity), 0
  );

  const lowStockProducts = products.filter(p => p.quantity <= p.reorderPoint);
  
  const recentMovements = movements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

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
        <div className="divide-y">
          {recentMovements.map((movement) => {
            const product = products.find(p => p.id === movement.productId);
            return (
              <div key={movement.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {product?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {movement.reason} - {movement.type === 'IN' ? 'Entrada' : 'Salida'}
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;