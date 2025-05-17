import mongoose from 'mongoose';

const movementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  type: { type: String, enum: ['IN', 'OUT'], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Movement', movementSchema);
