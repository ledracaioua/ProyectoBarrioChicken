import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

router.get('/', async (_, res) => {
  const list = await Order.find().sort({ createdAt: -1 });
  res.json(list);
});

router.post('/', async (req, res) => {
  const doc = new Order(req.body);
  await doc.save();
  res.status(201).json(doc);
});

router.put('/:id', async (req, res) => {
  const upd = await Order.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(upd);
});

router.delete('/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
