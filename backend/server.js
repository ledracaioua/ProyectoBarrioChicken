const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 📦 Conexión MongoDB
mongoose.connect('mongodb+srv://caioledra:wH12@cluster0.thxlr.mongodb.net/bolt?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('🟢 Conectado a MongoDB'))
  .catch(err => console.error('🔴 Error conectando a MongoDB:', err));

// 📄 Esquema de ejemplo (por ejemplo: productos)
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
});

const Product = mongoose.model('Product', ProductSchema);

// 📥 POST: agregar producto
app.post('/api/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
});

// 📤 GET: obtener productos
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

// 🚀 Lanzar servidor
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
