const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../frontend/public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Add product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) return res.status(400).json({ message: 'All fields required' });
    let image = '';
    if (req.file) {
      image = '/uploads/' + req.file.filename;
    }
    const product = new Product({ name, description, price, category, image, client: payload.id });
    await product.save();
    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products for the logged-in client
router.get('/my', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const products = await Product.find({ client: payload.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product price and description by ID (only for the owner)
router.put('/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { price, description } = req.body;
    const product = await Product.findOne({ _id: req.params.id, client: payload.id });
    if (!product) return res.status(404).json({ message: 'Product not found or not yours' });
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product by ID (only for the owner)
router.delete('/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const product = await Product.findOneAndDelete({ _id: req.params.id, client: payload.id });
    if (!product) return res.status(404).json({ message: 'Product not found or not yours' });
    
    // Clean up cart items for this product
    await Cart.deleteMany({ product: req.params.id });
    
    // Clean up wishlist items for this product
    await User.updateMany(
      { wishlist: req.params.id },
      { $pull: { wishlist: req.params.id } }
    );
    
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public endpoint to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('client', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 