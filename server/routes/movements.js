import express from 'express';
import Movement from '../models/Movement.js';
import Product from '../models/Item.js'; // Importante

const router = express.Router();

// Criar novo movimento e atualizar estoque
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, type } = req.body;

    // 1. Cria o movimento
    const movement = await Movement.create(req.body);

    // 2. Atualiza a quantidade do produto
    const update = type === 'IN'
      ? { $inc: { quantity: quantity } }
      : { $inc: { quantity: -quantity } };

    const updatedProduct = await Product.findByIdAndUpdate(productId, update, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // 3. Retorna o movimento registrado
    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todos os movimentos
router.get('/', async (req, res) => {
  try {
    const movements = await Movement.find()
      .sort({ date: -1 })
      .populate('productId');
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
