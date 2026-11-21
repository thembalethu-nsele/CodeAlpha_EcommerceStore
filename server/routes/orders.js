const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders (logged-in customer)
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }
    if (!shippingAddress || !shippingAddress.trim()) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const orderItems = [];
    let total = 0;

    // Check every item first, using the real price and stock from the database
    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      if (!qty || qty < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: 'A product in your cart no longer exists' });
      }
      if (product.stock < qty) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name} (only ${product.stock} left)`,
        });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        priceAtPurchase: product.price,
        quantity: qty,
      });
      total += product.price * qty;
    }

    // Reduce stock, then save the order
    for (const oi of orderItems) {
      await Product.findByIdAndUpdate(oi.product, { $inc: { stock: -oi.quantity } });
    }
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      shippingAddress: shippingAddress.trim(),
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/mine (my order history)
router.get('/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders (admin: all orders)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const allowed = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;