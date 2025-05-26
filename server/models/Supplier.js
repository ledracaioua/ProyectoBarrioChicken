import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rut: { type: String },
  email: { type: String },
  insumo: {type: String },
  additionalInfo: { type: String },
  categories: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Supplier', supplierSchema);