import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  category: { type: String },
  supplier: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number },
  batch: { type: String },
  entryDate: { type: Date },
  expiryDate: { type: Date },
  reorderPoint: { type: Number },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
