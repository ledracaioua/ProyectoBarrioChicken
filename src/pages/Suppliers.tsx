// src/pages/Suppliers.tsx

import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';
import SupplierCard from '../components/SupplierCard.tsx';
import SupplierForm from '../components/SupplierForm.tsx';
import { Plus } from 'lucide-react';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from '../api/suppliers';
import { toast } from 'react-hot-toast';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | undefined>(undefined);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    }
  };

  const handleAddNew = () => {
    setCurrentSupplier(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        await deleteSupplier(id);
        toast.success('Fornecedor excluído com sucesso');
        loadSuppliers();
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
      }
    }
  };

  const handleSave = async (supplier: Supplier) => {
    try {
      if (supplier._id) {
        await updateSupplier(supplier._id, supplier);
      } else {
        await addSupplier(supplier);
      }
      toast.success('Fornecedor salvo com sucesso');
      setIsFormOpen(false);
      loadSuppliers();
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Proveedores</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-[#DB2323] text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-1" />
          Nuevo Proveedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suppliers.map(supplier => (
          <SupplierCard
            key={supplier._id}
            supplier={supplier}
            onEdit={() => handleEdit(supplier)}
            onDelete={() => handleDelete(supplier._id!)}
          />
        ))}
      </div>

      {isFormOpen && (
        <SupplierForm
          supplier={currentSupplier}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Suppliers;
