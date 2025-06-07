import express from 'express';
import Product from '../models/Item.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

export default router;
