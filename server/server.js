// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/items.js';
import movementRoutes from './routes/movements.js';
import supplierRoutes from './routes/suppliers.js';
import categoriesRouter from './routes/categories.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoriesRouter);


// DB Connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});