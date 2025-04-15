import React from 'react';
import { Save, UserCircle, Bell, Shield, Database } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Configuración</h1>

      <div className="bg-white shadow rounded-lg divide-y">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <UserCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-medium text-gray-900">Perfil de Usuario</h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="juan@example.com"
              />
            </div>
          </div>
        </div>

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
                <label className="font-medium text-gray-700">
                  Alertas de Stock Bajo
                </label>
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
                <label className="font-medium text-gray-700">
                  Alertas de Caducidad
                </label>
                <p className="text-sm text-gray-500">
                  Recibe notificaciones sobre productos próximos a vencer
                </p>
              </div>
            </div>
          </div>
        </div>

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

        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-medium text-gray-900">Respaldo de Datos</h2>
          </div>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Exportar Datos
            </button>
          </div>
        </div>
      </div>

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