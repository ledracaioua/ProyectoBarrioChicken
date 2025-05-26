import React, { useEffect, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Box, AlertTriangle } from 'lucide-react';
import { getItems } from '../api/items';
import { getMovements } from '../api/movements';
import { Product, InventoryMovement } from '../types';

const Reports = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [filter, setFilter] = useState<'todos' | 'entrada' | 'salida'>('todos');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

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
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const filteredMovements = movements
    .filter((m) =>
      filter === 'todos' ? true : m.type === (filter === 'entrada' ? 'IN' : 'OUT')
    )
    .filter((m) => {
      const date = new Date(m.date);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;
      if (start && end) return date >= start && date <= end;
      if (start) return date >= start;
      if (end) return date <= end;
      return true;
    });

  // Métricas
  const totalValue = products.reduce((sum, product) =>
    sum + (product.price * product.quantity), 0
  );
  
  const lowStockCount = products.filter((p) => p.quantity <= (p.reorderPoint || 0)).length;
  const totalProducts = products.length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Valor Total del Inventario</p>
            <p className="text-xl font-semibold">${totalValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full mr-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Productos con Stock Bajo</p>
            <p className="text-xl font-semibold">{lowStockCount}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Productos</p>
            <p className="text-xl font-semibold">{totalProducts}</p>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimiento</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="todos">Todos</option>
              <option value="entrada">Entradas</option>
              <option value="salida">Salidas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* TABLA DE MOVIMIENTOS */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Razón
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMovements.map((movement) => {
              const productId =
                typeof movement.productId === 'string'
                  ? movement.productId
                  : movement.productId?._id;

              const product = products.find((p) => p._id === productId);

              return (
                <tr key={movement._id}>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {new Date(movement.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {product?.name || 'Producto eliminado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {movement.type === 'IN' ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <span
                        className={`text-sm ${
                          movement.type === 'IN'
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}
                      >
                        {movement.type === 'IN' ? 'Entrada' : 'Salida'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movement.reason && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          movement.reason === 'uso'
                            ? 'bg-blue-100 text-blue-800'
                            : movement.reason === 'vencimiento'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {movement.reason === 'uso'
                          ? 'Uso Regular'
                          : movement.reason === 'vencimiento'
                          ? 'Vencimiento'
                          : 'Robo'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movement.quantity} unidades
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movement.notes || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
