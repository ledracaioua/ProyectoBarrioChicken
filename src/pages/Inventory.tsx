// Inventory.tsx

import React, { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Search, Plus, ArrowDown, Trash2, Pencil, Repeat, Settings } from 'lucide-react';
import { Product } from '../types';
import { format } from 'date-fns';
import ProductModal from '../components/ProductModal';
import MovementModal from '../components/MovementModal';
import { getItems, addItem, updateItem, deleteItem } from '../api/items';
import { toast } from 'react-hot-toast';

const columnHelper = createColumnHelper<Product>();

const availableUnits = ['Kg', 'unidades', 'bolsas', 'caixas', 'litros'];

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    sku: true,
    name: true,
    quantity: true,
    reorderPoint: true,
    price: true,
    category: true,
    supplier: true,
    expiryDate: true,
    status: true,
    actions: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getItems();
      setProducts(res.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleSaveProduct = async (product: Product | Omit<Product, '_id'>) => {
    try {
      if ('_id' in product && product._id) {
        await updateItem(product._id, product);
      } else {
        await addItem(product);
      }
      setIsProductModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await deleteItem(productId);
      loadProducts();
      toast.success('Produto excluído com sucesso');
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const allColumns: ColumnDef<Product, any>[] = [
    visibleColumns.sku &&
      columnHelper.accessor('sku', { header: 'SKU', cell: info => info.getValue() }),
    visibleColumns.name &&
      columnHelper.accessor('name', { header: 'Nombre', cell: info => info.getValue() }),
    visibleColumns.quantity &&
      columnHelper.accessor('quantity', {
        header: 'Cantidad',
        cell: info => {
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
    visibleColumns.reorderPoint &&
      columnHelper.accessor('reorderPoint', {
        header: 'Punto de Reorden',
        cell: info => `${info.getValue()} unidades`,
      }),
    visibleColumns.status &&
      columnHelper.display({
        id: 'status',
        header: 'Estado',
        cell: (info) => {
          const product = info.row.original;
          const status =
            product.quantity < product.reorderPoint
              ? 'Bajo stock'
              : product.quantity === product.reorderPoint
              ? 'Reordenar'
              : 'En stock';

          const color =
            status === 'Bajo stock'
              ? 'bg-red-100 text-red-800'
              : status === 'Reordenar'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800';

          return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
              {status}
            </span>
          );
        },
      }),
    visibleColumns.price &&
      columnHelper.accessor('price', {
        header: 'Precio',
        cell: info => `$${info.getValue().toFixed(2)}`,
      }),
    visibleColumns.category &&
      columnHelper.accessor('category', { header: 'Categoría', cell: info => info.getValue() }),
    visibleColumns.supplier &&
      columnHelper.accessor('supplier', { header: 'Proveedor', cell: info => info.getValue() }),
    visibleColumns.expiryDate &&
      columnHelper.accessor('expiryDate', {
        header: 'Fecha de Caducidad',
        cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy'),
      }),
    visibleColumns.actions &&
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: (info) => (
          <div className="flex overflow-hidden rounded-full shadow-sm border border-gray-200 divide-x divide-gray-300">
            <button
              onClick={() => {
                setSelectedProduct(info.row.original);
                setIsProductModalOpen(true);
              }}
              title="Editar"
              className="p-2 text-yellow-500 hover:bg-yellow-100 rounded-l-full"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedProduct(info.row.original);
                setIsMovementModalOpen(true);
              }}
              title="Movimentar"
              className="p-2 text-green-500 hover:bg-green-100"
            >
              <Repeat className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteProduct(info.row.original._id!)}
              title="Excluir"
              className="p-2 text-red-600 hover:bg-red-100 rounded-r-full"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      }),
  ].filter(Boolean) as ColumnDef<Product, any>[];

  const table = useReactTable({
    data: products,
    columns: allColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventario</h1>
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

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar productos..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="flex items-center gap-2 border px-3 py-2 rounded-lg shadow-sm text-sm text-gray-700 hover:bg-gray-50"
          >
            <Settings className="w-4 h-4" />
            Columnas
          </button>

          {showColumnSelector && (
            <div className="absolute z-10 mt-2 right-0 bg-white border rounded-lg shadow-lg p-4 space-y-2 w-48">
              {Object.keys(visibleColumns).map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={visibleColumns[key]}
                    onChange={() =>
                      setVisibleColumns((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                  />
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 border-b border-gray-200 text-left font-semibold"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 border-b border-gray-100 text-gray-800">
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
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          loadProducts();
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
            loadProducts();
            toast.success('Movimentación registrada com sucesso');
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Inventory;
