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
            aria-label='Editar'
            onClick={() => {
              setSelectedProduct(info.row.original);
              setIsProductModalOpen(true);
            }}
            className="bg-transparent text-yellow-500 hover:text-white hover:bg-yellow-500 border border-yellow-500 hover:border-transparent focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
          >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
            </svg>
          </button>
          <button
            aria-label='Movimentar'
            onClick={() => {
              setSelectedProduct(info.row.original);
              setIsMovementModalOpen(true);
            }}
            className="bg-transparent text-green-500 hover:bg-green-500 hover:text-white border border-green-500 hover:border-tranparent focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-green-900"
          >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
</svg>

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
      <h1 className="text-3xl font-bold text-red-600 mb-6">Gestión de Inventario</h1>
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