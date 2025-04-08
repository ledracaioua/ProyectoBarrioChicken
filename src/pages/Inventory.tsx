import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { Search, Plus, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import { useInventoryStore } from '../store/inventory';
import { Product } from '../types';
import { format } from 'date-fns';
import ProductModal from '../components/ProductModal';
import MovementModal from '../components/MovementModal';

const columnHelper = createColumnHelper<Product>();

const Inventory = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products } = useInventoryStore();

  const columns = [
    columnHelper.accessor('sku', {
      header: 'SKU',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Nombre',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('quantity', {
      header: 'Cantidad',
      cell: (info) => {
        const quantity = info.getValue();
        const reorderPoint = info.row.original.reorderPoint;
        return (
          <div className="flex items-center">
            <span className={quantity <= reorderPoint ? 'text-red-600 font-medium' : ''}>
              {quantity}
            </span>
            {quantity <= reorderPoint && (
              <ArrowDown className="w-4 h-4 ml-1 text-red-600" />
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('price', {
      header: 'Precio',
      cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('category', {
      header: 'Categoría',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('supplier', {
      header: 'Proveedor',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('expiryDate', {
      header: 'Fecha de Caducidad',
      cell: (info) => format(new Date(info.getValue()), 'dd/MM/yyyy'),
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedProduct(info.row.original);
              setIsProductModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Editar
          </button>
          <button
            onClick={() => {
              setSelectedProduct(info.row.original);
              setIsMovementModalOpen(true);
            }}
            className="text-green-600 hover:text-green-800"
          >
            Movimiento
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: products,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar productos..."
          className="pl-10 pr-4 py-2 w-full border rounded-lg"
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
        <span className="text-sm text-gray-700">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
        </span>
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct || undefined}
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

export default Inventory;