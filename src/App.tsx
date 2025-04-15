import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, Home as HomeIcon, Package, BoxIcon, BarChart3, Settings as SettingsIcon, BookOpen } from 'lucide-react';
import Home from './pages/Home';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Barra superior */}
        <header className="bg-red-600 text-white p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6" />
            <img 
              src="https://tofuu.getjusto.com/orioneat-local/resized2/ywc8HZ2HpJ4gArXHL-1080-x.webp" 
              alt="Barrio Chick'en Logo" 
              className="h-12 w-12"
            />
            <h1 className="text-xl font-bold">Barrio Chick'en</h1>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Barra lateral izquierda */}
          <aside className="w-64 bg-red-300 text-red-900 p-6 hidden md:block">
            <nav className="space-y-4">
              <Link to="/" className="flex items-center space-x-2 hover:bg-red-700 hover:text-white p-2 rounded transition-colors">
                <HomeIcon className="h-5 w-5" />
                <span>Inicio</span>
              </Link>
              <Link to="/history" className="flex items-center space-x-2 hover:bg-red-700 hover:text-white p-2 rounded transition-colors">
                <BookOpen className="h-5 w-5" />
                <span>Historia</span>
              </Link>
              <Link to="/products" className="flex items-center space-x-2 hover:bg-red-700 hover:text-white p-2 rounded transition-colors">
                <Package className="h-5 w-5" />
                <span>Productos</span>
              </Link>
              <Link to="/inventory" className="flex items-center space-x-2 hover:bg-red-700 hover:text-white p-2 rounded transition-colors">
                <BoxIcon className="h-5 w-5" />
                <span>Inventario</span>
              </Link>
              <Link to="/reports" className="flex items-center space-x-2 hover:bg-red-700 hover:text-white p-2 rounded transition-colors">
                <BarChart3 className="h-5 w-5" />
                <span>Reportes</span>
              </Link>
              <Link to="/settings" className="flex items-center space-x-2 hover:bg-red-700 hover:text-white p-2 rounded transition-colors">
                <SettingsIcon className="h-5 w-5" />
                <span>Configuración</span>
              </Link>
            </nav>
          </aside>

          {/* Contenido principal con imagen de fondo */}
          <main className="flex-1 p-6 bg-gradient-to-br from-white to-red-50">
            <div 
              className="h-full rounded-lg shadow-xl p-8 bg-white"
            >
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