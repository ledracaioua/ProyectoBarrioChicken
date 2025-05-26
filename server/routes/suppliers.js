import express from 'express';
import Supplier from '../models/supplier.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const suppliers = await Supplier.find().sort({ createdAt: -1 });
  res.json(suppliers);
});

router.post('/', async (req, res) => {
  const supplier = new Supplier(req.body);
  await supplier.save();
  res.status(201).json(supplier);
});

router.put('/:id', async (req, res) => {
  const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
