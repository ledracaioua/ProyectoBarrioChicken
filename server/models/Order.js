import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  name:       String,
  quantity:   Number,
  price:      Number,
  subtotal:   Number,
}, { _id:false });

const orderSchema = new mongoose.Schema({
  orderNumber:       { type: String, required: true, unique: true },
  supplier:          String,
  status:            { type: String, enum: ['pending','processing','on_the_way','delivered','delayed','cancelled'], default:'pending' },
  items:             [orderItemSchema],
  total:             Number,
  createdAt:         { type: Date, default: Date.now },
  estimatedDelivery: Date,
  deliveryAddress:   String,
  paymentMethod:     String,
  notes:             String,
  statusHistory: [{
    status:     String,
    timestamp:  { type: Date, default: Date.now },
    comment:    String,
  }],
});

export default mongoose.model('Order', orderSchema);
