import mongoose from 'mongoose';
import Item from './models/Item.js'; // ajuste o caminho se necessário

mongoose.connect('mongodb://localhost:27017/sua_base_de_dados', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const rawProducts = [
  { name: "Coca-Cola 1.5 Lts", quantity: "5", unit: "botellas" },
  { name: "Coca-Cola Zero 1.5 Lts", quantity: "3", unit: "botellas" },
  { name: "Fanta Zero 1.5 Lts", quantity: "3", unit: "botellas" },
  { name: "Sprite Zero 1.5 Lts", quantity: "3", unit: "botellas" },
  { name: "Agua Benedictino S/G", quantity: "9", unit: "botellas" },
  { name: "Agua Benedictino C/G", quantity: "13", unit: "botellas" },
  { name: "Pan brioche 30p", quantity: "6", unit: "bolsas" },
  { name: "Harina", quantity: "50", unit: "Kg" },
  { name: "Hellmanns Mayo Deli", quantity: "1.9", unit: "Kg" },
  { name: "Hellmanns Ketchup", quantity: "1.9", unit: "Kg" },
  { name: "Hellmanns Salsa Barbacoa", quantity: "2", unit: "Kg" },
  { name: "Hellmanns Mostaza", quantity: "6", unit: "Kg" },
  // Adicione todos os outros produtos aqui…
];

const items = rawProducts.map((prod, index) => ({
  name: prod.name,
  sku: `SKU${String(index + 1).padStart(4, '0')}`,
  quantity: parseFloat(prod.quantity.replace(',', '.')),
  unit: prod.unit,
  category: '',
  supplier: '',
  price: 0,
  batch: '',
  entryDate: null,
  expiryDate: null,
  reorderPoint: 0,
  description: '',
}));

async function seedItems() {
  try {
    await Item.insertMany(items);
    console.log('✅ Itens inseridos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inserir itens:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedItems();
