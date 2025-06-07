import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Package,
  BarChart2,
  Settings,
  ClipboardList,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/products', icon: Package, label: 'Productos' },
    { to: '/inventory', icon: ClipboardList, label: 'Gestión de Inventario' },
    { to: '/reports', icon: BarChart2, label: 'Reportes' },
    { to: '/settings', icon: Settings, label: 'Configuración' },
  ];

  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <span className="text-xl font-bold text-gray-800">Bairro Chik'n</span>

          {/* Botón mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Links desktop */}
          <div className="hidden md:flex space-x-8">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-1" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Mobile (Drawer) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fundo escuro */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="relative w-64 bg-white p-4 shadow-lg z-50 animate-slideIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Menú</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'text-blue-600 bg-blue-100'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
