import React, { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { Search, Plus, ArrowDown, Trash2, Pencil, Repeat } from 'lucide-react';
import { Product } from '../types';
import { format } from 'date-fns';
import ProductModal from '../components/ProductModal';
import MovementModal from '../components/MovementModal';
import { getItems, addItem, updateItem, deleteItem } from '../api/items';
import { toast } from 'react-hot-toast'; // ✅ toast adicionado

const columnHelper = createColumnHelper<Product>();

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
      toast.success('Produto excluído com sucesso'); // ✅ toast de sucesso
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const columns = [
    columnHelper.accessor('sku', { header: 'SKU', cell: info => info.getValue() }),
    columnHelper.accessor('name', { header: 'Nombre', cell: info => info.getValue() }),
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
    columnHelper.accessor('price', {
      header: 'Precio',
      cell: info => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('category', { header: 'Categoría', cell: info => info.getValue() }),
    columnHelper.accessor('supplier', { header: 'Proveedor', cell: info => info.getValue() }),
    columnHelper.accessor('expiryDate', {
      header: 'Fecha de Caducidad',
      cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy'),
    }),
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
  ];

  const table = useReactTable({
    data: products,
    columns,
    state: { globalFilter },
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
          Nuevo Produto
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
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
      />

      {selectedProduct && (
        <MovementModal
          isOpen={isMovementModalOpen}
          onClose={() => {
            setIsMovementModalOpen(false);
            loadProducts();
            toast.success('Movimentação registrada com sucesso'); // ✅ toast de movimentação
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Inventory;
