// server/seedItems.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js';

dotenv.config();

// Datos específicos de insumos por proveedor basados en el CSV
const supplierProducts = {
  'MINUTO VERDE': [
    { name: 'Papas Fritas 7MM', category: 'Congelados', unit: 'kg', price: 3500, reorderPoint: 20 },
    { name: 'Empanadas Media Luna', category: 'Congelados', unit: 'unidades', price: 450, reorderPoint: 50 },
    { name: 'Aros de Cebolla', category: 'Congelados', unit: 'kg', price: 4200, reorderPoint: 15 },
    { name: 'Pechuga de Pollo Deshuesada', category: 'Carnes', unit: 'kg', price: 6800, reorderPoint: 25 }
  ],
  'CAMILO FERRON': [
    { name: 'Manteca Semilíquida', category: 'Grasas', unit: 'kg', price: 2800, reorderPoint: 10 }
  ],
  'PF': [
    { name: 'Tocino', category: 'Carnes', unit: 'kg', price: 5200, reorderPoint: 8 }
  ],
  'AGROSUPER': [
    { name: 'Trutro Deshuesado', category: 'Carnes', unit: 'kg', price: 4500, reorderPoint: 20 },
    { name: 'Trutro Ala', category: 'Carnes', unit: 'kg', price: 3800, reorderPoint: 15 },
    { name: 'Filetillo de Pollo', category: 'Carnes', unit: 'kg', price: 7200, reorderPoint: 12 }
  ],
  'GIRASOLES': [
    { name: 'Lechuga Escarola', category: 'Verduras', unit: 'unidades', price: 800, reorderPoint: 30 },
    { name: 'Lechuga Variedad', category: 'Verduras', unit: 'unidades', price: 750, reorderPoint: 25 },
    { name: 'Cebolla Pluma', category: 'Verduras', unit: 'kg', price: 1200, reorderPoint: 20 },
    { name: 'Cebolla Morada', category: 'Verduras', unit: 'kg', price: 1400, reorderPoint: 15 },
    { name: 'Cilantro', category: 'Verduras', unit: 'atados', price: 300, reorderPoint: 40 },
    { name: 'Mix Coleslaw', category: 'Verduras', unit: 'kg', price: 2200, reorderPoint: 10 },
    { name: 'Ají Verde', category: 'Verduras', unit: 'kg', price: 1800, reorderPoint: 8 }
  ],
  'BAGNO': [
    { name: 'Tomate', category: 'Verduras', unit: 'kg', price: 1600, reorderPoint: 25 },
    { name: 'Palta', category: 'Verduras', unit: 'unidades', price: 350, reorderPoint: 50 }
  ],
  'ANDINA': [
    { name: 'BIB Coca Cola', category: 'Bebidas', unit: 'litros', price: 1800, reorderPoint: 5 },
    { name: 'BIB Coca Zero', category: 'Bebidas', unit: 'litros', price: 1800, reorderPoint: 5 },
    { name: 'BIB Fanta', category: 'Bebidas', unit: 'litros', price: 1600, reorderPoint: 5 },
    { name: 'BIB Sprite', category: 'Bebidas', unit: 'litros', price: 1600, reorderPoint: 5 },
    { name: 'Coca Cola 350cc', category: 'Bebidas', unit: 'unidades', price: 800, reorderPoint: 100 },
    { name: 'Coca Zero 350cc', category: 'Bebidas', unit: 'unidades', price: 800, reorderPoint: 80 },
    { name: 'Fanta 350cc', category: 'Bebidas', unit: 'unidades', price: 750, reorderPoint: 60 },
    { name: 'Sprite 350cc', category: 'Bebidas', unit: 'unidades', price: 750, reorderPoint: 60 },
    { name: 'Coca Cola 1.5L', category: 'Bebidas', unit: 'unidades', price: 1200, reorderPoint: 40 },
    { name: 'Coca Zero 1.5L', category: 'Bebidas', unit: 'unidades', price: 1200, reorderPoint: 30 },
    { name: 'Fanta Zero 1.5L', category: 'Bebidas', unit: 'unidades', price: 1100, reorderPoint: 25 },
    { name: 'Sprite 1.5L', category: 'Bebidas', unit: 'unidades', price: 1100, reorderPoint: 25 },
    { name: 'Benedictino S/G', category: 'Bebidas', unit: 'unidades', price: 1800, reorderPoint: 12 },
    { name: 'Benedictino C/G', category: 'Bebidas', unit: 'unidades', price: 1800, reorderPoint: 12 }
  ],
  'IDEAL': [
    { name: 'Pan Brioche', category: 'Panadería', unit: 'unidades', price: 180, reorderPoint: 200 }
  ],
  'ICB': [
    { name: 'Queso Cheddar', category: 'Lácteos', unit: 'kg', price: 8500, reorderPoint: 5 },
    { name: 'Queso Mozzarella', category: 'Lácteos', unit: 'kg', price: 7800, reorderPoint: 8 }
  ],
  'SOPROLE': [
    { name: 'Crema de Leche', category: 'Lácteos', unit: 'litros', price: 2200, reorderPoint: 10 },
    { name: 'Leche Entera', category: 'Lácteos', unit: 'litros', price: 950, reorderPoint: 20 },
    { name: 'Yogurt Natural', category: 'Lácteos', unit: 'kg', price: 1800, reorderPoint: 8 }
  ],
  'AROMO': [
    { name: 'Vino Blanco', category: 'Bebidas Alcohólicas', unit: 'botellas', price: 3500, reorderPoint: 6 }
  ],
  'FOOD EXPERT': [
    { name: 'Pepinillos Dill Laminado', category: 'Conservas', unit: 'kg', price: 4200, reorderPoint: 5 }
  ],
  'HUNGRY BROS': [
    { name: 'Smokey BBQ Sauce', category: 'Salsas', unit: 'litros', price: 3800, reorderPoint: 4 }
  ],
  'GOURMET': [
    { name: 'Humo Líquido', category: 'Condimentos', unit: 'litros', price: 12000, reorderPoint: 2 },
    { name: 'Salsa de Soya', category: 'Salsas', unit: 'litros', price: 2800, reorderPoint: 5 },
    { name: 'Salsa Inglesa', category: 'Salsas', unit: 'litros', price: 3200, reorderPoint: 4 }
  ],
  'HELA': [
    { name: 'Condimento Cajun', category: 'Condimentos', unit: 'kg', price: 8500, reorderPoint: 3 },
    { name: 'Apanado Crocante', category: 'Harinas', unit: 'kg', price: 2200, reorderPoint: 15 },
    { name: 'Harina 25kg', category: 'Harinas', unit: 'bolsas', price: 18000, reorderPoint: 5 },
    { name: 'Empanizador', category: 'Harinas', unit: 'kg', price: 2800, reorderPoint: 10 }
  ],
  'DULCONO ROMA': [
    { name: 'Cono Super', category: 'Postres', unit: 'unidades', price: 45, reorderPoint: 500 },
    { name: 'Cono Artesanal', category: 'Postres', unit: 'unidades', price: 65, reorderPoint: 300 }
  ],
  'HELLMANNS': [
    { name: 'Mayonesa', category: 'Salsas', unit: 'kg', price: 3200, reorderPoint: 8 },
    { name: 'Ketchup', category: 'Salsas', unit: 'kg', price: 2800, reorderPoint: 10 },
    { name: 'Salsa BBQ', category: 'Salsas', unit: 'kg', price: 3500, reorderPoint: 6 }
  ],
  'JB': [
    { name: 'Mostaza', category: 'Salsas', unit: 'kg', price: 2200, reorderPoint: 8 },
    { name: 'Ají', category: 'Salsas', unit: 'kg', price: 2800, reorderPoint: 6 }
  ],
  'TRAVERSO': [
    { name: 'Vinagre de Vino Rosado', category: 'Condimentos', unit: 'litros', price: 1800, reorderPoint: 6 }
  ],
  'PANCHO VILLA': [
    { name: 'Tortillas Mexicanas Gigantes', category: 'Panadería', unit: 'paquetes', price: 2200, reorderPoint: 20 }
  ]
};

function generateSKU(name, supplier) {
  const nameCode = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w.slice(0, 3))
    .join('');

  const supplierCode = supplier
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .slice(0, 1)
    .map(w => w.slice(0, 3))
    .join('');

  return `${nameCode}-${supplierCode}`;
}

async function seedItems() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bairro-chicken-inventory');
    console.log('Conectado a MongoDB');

    // Limpiar colección existente
    await Item.deleteMany({});
    console.log('Colección de items limpiada');

    const items = [];

    // Generar items para cada proveedor
    Object.entries(supplierProducts).forEach(([supplier, products]) => {
      products.forEach(product => {
        const today = new Date();
        const entryDate = new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Últimos 30 días
        const expiryDate = new Date(today.getTime() + (Math.random() * 90 + 30) * 24 * 60 * 60 * 1000); // 30-120 días

        items.push({
          name: product.name,
          sku: generateSKU(product.name, supplier),
          category: product.category,
          supplier: supplier,
          quantity: Math.floor(Math.random() * 50) + 10, // 10-60 unidades
          unit: product.unit,
          price: product.price,
          batch: `LOTE-${Math.floor(Math.random() * 1000) + 1}`,
          entryDate: entryDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          reorderPoint: product.reorderPoint,
          description: `${product.name} suministrado por ${supplier}`
        });
      });
    });

    await Item.insertMany(items);
    console.log(`✅ ${items.length} insumos creados exitosamente`);
    console.log(`📊 Distribución por proveedor:`);
    
    Object.entries(supplierProducts).forEach(([supplier, products]) => {
      console.log(`   ${supplier}: ${products.length} insumos`);
    });

  } catch (error) {
    console.error('❌ Error al crear insumos:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedItems();