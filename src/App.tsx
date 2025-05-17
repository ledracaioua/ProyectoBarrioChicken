import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  Menu, Home as HomeIcon, Package, BoxIcon, BarChart3,
  Settings as SettingsIcon, BookOpen
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import History from './pages/History';

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const navItems = [
    { to: "/", icon: <HomeIcon className="h-5 w-5" />, label: "Inicio" },
    { to: "/history", icon: <BookOpen className="h-5 w-5" />, label: "Historia" },
    { to: "/products", icon: <Package className="h-5 w-5" />, label: "Productos" },
    { to: "/inventory", icon: <BoxIcon className="h-5 w-5" />, label: "Inventario" },
    { to: "/reports", icon: <BarChart3 className="h-5 w-5" />, label: "Reportes" },
    { to: "/settings", icon: <SettingsIcon className="h-5 w-5" />, label: "Configuración" },
  ];

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen flex flex-col">
        <header className="bg-red-600 text-white p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </button>
            <img
              src="https://tofuu.getjusto.com/orioneat-local/resized2/ywc8HZ2HpJ4gArXHL-1080-x.webp"
              alt="Barrio Chick'en Logo"
              className="h-12 w-12"
            />
            <h1 className="text-xl font-bold">Barrio Chick'en</h1>
          </div>
        </header>

        <div className="flex flex-1">
          <aside className={`transition-all duration-300 ${sidebarExpanded ? 'w-64' : 'w-20'} bg-red-300 text-red-900 p-4 hidden md:block`}>
            <nav className="space-y-2">
              {navItems.map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center space-x-2 hover:bg-red-700 hover:text-white p-2 rounded transition-colors"
                >
                  {icon}
                  {sidebarExpanded && <span>{label}</span>}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 p-6 bg-gradient-to-br from-white to-red-50">
            <div className="h-full rounded-lg shadow-xl p-8 bg-white">
              <div className="bg-white p-6 rounded-lg">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
