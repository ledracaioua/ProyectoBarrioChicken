import React, { useRef } from 'react';
import { Save, UserCircle, Bell, Shield, Database, Upload, Download } from 'lucide-react';
import { useInventoryStore } from '../store/inventory.ts'; // ajuste o path se necessário
import { Product, InventoryMovement } from '../types.ts'; // ajuste o caminho conforme necessário


const Settings = () => {
  const { products, movements, addProduct, recordMovement } = useInventoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exporta productos y movimientos
  const handleExport = () => {
    const dataToExport = {
      productos: products,
      movimientos: movements,
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateTim = new Date().toISOString().replace(/[:.]/g, '-');

    const a = document.createElement('a');
    a.href = url;
    a.download = 'respaldo_inventario'+dateTim+'.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importa productos y movimientos desde un archivo JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);

        if (Array.isArray(importedData.productos)) {
          importedData.productos.forEach((product: Product) => {
            addProduct(product);
          });
        }

        if (Array.isArray(importedData.movimientos)) {
          importedData.movimientos.forEach((movement: InventoryMovement) => {
            recordMovement(movement);
          });
        }

        alert('Datos importados correctamente.');
      } catch (err) {
        alert('Error al leer el archivo.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>

      <div className="bg-white shadow rounded-lg divide-y">

        {/* PERFIL DE USUARIO */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <UserCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-medium text-gray-900">Perfil de Usuario</h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="juan@example.com"
              />
            </div>
          </div>
        </div>

        {/* NOTIFICACIONES */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-medium text-gray-900">Notificaciones</h2>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  defaultChecked
                />
              </div>
              <div className="ml-3">
                <label className="font-medium text-gray-700">Alertas de Stock Bajo</label>
                <p className="text-sm text-gray-500">
                  Recibe notificaciones cuando los productos alcancen su punto de reorden
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  defaultChecked
                />
              </div>
              <div className="ml-3">
                <label className="font-medium text-gray-700">Alertas de Caducidad</label>
                <p className="text-sm text-gray-500">
                  Recibe notificaciones sobre productos próximos a vencer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEGURIDAD */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-medium text-gray-900">Seguridad</h2>
          </div>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Cambiar Contraseña
            </button>
          </div>
        </div>

        {/* RESPALDO DE DATOS */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-medium text-gray-900">Respaldo de Datos</h2>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Datos
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar Datos
            </button>

            <input
              type="file"
              accept="application/json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImport}
            />
          </div>
        </div>
      </div>

      {/* BOTÃO FINAL DE SALVAR */}
      <div className="flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default Settings;
