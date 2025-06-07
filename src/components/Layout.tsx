import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Menu, LayoutDashboard, BookOpen, Package, PackageCheck,
  BarChart3, Settings, Store, ShoppingCart
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/history', icon: BookOpen, label: 'Historia' },
  { to: '/products', icon: Package, label: 'Productos' },
  { to: '/inventory', icon: PackageCheck, label: 'Inventario' },
  { to: '/suppliers', icon: Store, label: 'Proveedores' },
  { to: '/orders', icon: ShoppingCart, label: 'Pedidos' },
  { to: '/reports', icon: BarChart3, label: 'Reportes' },
  { to: '/settings', icon: Settings, label: 'Configuración' },
];

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-[#FFC3C3] transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="p-4 bg-[#DB2323] flex items-center space-x-3 text-white h-16">
          <img
            src="https://tofuu.getjusto.com/orioneat-local/resized2/ywc8HZ2HpJ4gArXHL-1080-x.webp"
            alt="Barrio Chick'en Logo"
            className="h-10 w-10 rounded-full"
          />
          {isSidebarOpen && <h1 className="font-bold text-lg">Barrio Chick'en</h1>}
        </div>

        <nav className="mt-4 px-2 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-white/30 font-semibold text-red-800'
                    : 'hover:bg-white/20 text-red-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {isSidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:bg-gray-100 rounded-md p-2"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;