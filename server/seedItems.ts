// Atualiza SKUs simplificados nos itens
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Item from './models/Item';  // Note que o model aqui é default export e com letra maiúscula

dotenv.config();

function generateSimplifiedSKU(name: string, quantity: string, unit: string): string {
  const nombreSimple = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ' ') // remove símbolos especiais
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w.slice(0, 3))
    .join('');

  const pesoFormatado = quantity.replace(/[,\.]/g, '');
  const unidadeAbrev = unit.toUpperCase().slice(0, 1);

  return `${nombreSimple}${pesoFormatado}${unidadeAbrev}`;
}

async function updateSKUs() {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    const items = await Item.find();

    const updates = items.map(async (item) => {
      const newSKU = generateSimplifiedSKU(item.name, item.quantity.toString(), item.unit??'');
      if (item.sku !== newSKU) {
        return Item.updateOne({ _id: item._id }, { sku: newSKU });
      }
      return Promise.resolve();
    });

    await Promise.all(updates);

    console.log(`SKUs simplificados atualizados para ${items.length} itens.`);
  } catch (error) {
    console.error('Erro ao atualizar SKUs:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateSKUs();
