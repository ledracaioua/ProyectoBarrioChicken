// server/controllers/itemController.js
import Item from '../models/Item.js';

export const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addItem = async (req, res) => {
  try {
    console.log("📦 Dados recebidos no POST /api/items:", req.body);

    const newItem = new Item(req.body);
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (err) {
    console.error("❌ Erro ao salvar item:", err.message);
    res.status(400).json({ error: err.message });
  }
};


export const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: 'Bad Request' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Bad Request' });
  }
};
