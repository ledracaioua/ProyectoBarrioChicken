import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Package, 
  BarChart2, 
  Settings,
  ClipboardList
} from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/products', icon: Package, label: 'Productos' },
    { to: '/inventory', icon: ClipboardList, label: 'Gestión de Inventario' },
    { to: '/reports', icon: BarChart2, label: 'Reportes' },
    { to: '/settings', icon: Settings, label: 'Configuración' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">GBS Chik'n</span>
          </div>
          <div className="flex space-x-8">
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
    </nav>
  );
};

export default Navbar;