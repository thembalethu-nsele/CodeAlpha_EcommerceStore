require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const colors = {
  Electronics: '2563eb',
  Fashion: '9333ea',
  Home: '059669',
  Stationery: 'd97706',
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find();
    for (const p of products) {
      const color = colors[p.category] || '475569';
      const text = encodeURIComponent(p.name).replace(/%20/g, '+');
      p.imageUrl = `https://placehold.co/400x300/${color}/ffffff?text=${text}`;
      await p.save();
    }
    console.log('Updated images for ' + products.length + ' products');
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
  }
})();