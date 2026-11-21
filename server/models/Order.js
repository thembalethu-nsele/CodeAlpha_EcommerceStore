const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    priceAtPurchase: Number,
    quantity: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);