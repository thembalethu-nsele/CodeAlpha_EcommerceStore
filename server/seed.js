require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const img = (seed) => `https://picsum.photos/seed/${seed}/400/300`;

const products = [
  // Electronics
  { name: 'Wireless Headphones', description: 'Over-ear Bluetooth headphones with 30 hours of battery.', price: 899, stock: 15, category: 'Electronics', imageUrl: img('headphones') },
  { name: 'Smart Watch', description: 'Tracks steps, sleep and heart rate.', price: 1299, stock: 10, category: 'Electronics', imageUrl: img('smartwatch') },
  { name: 'Bluetooth Speaker', description: 'Portable speaker with rich stereo sound.', price: 599, stock: 22, category: 'Electronics', imageUrl: img('speaker') },
  { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with adjustable DPI.', price: 199, stock: 30, category: 'Electronics', imageUrl: img('mouse') },
  { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard for gaming and work.', price: 799, stock: 12, category: 'Electronics', imageUrl: img('keyboard') },
  { name: 'USB Flash Drive', description: '64GB USB 3.0 flash drive for file storage.', price: 149, stock: 45, category: 'Electronics', imageUrl: img('usbdrive') },
  { name: 'Power Bank', description: '20000mAh portable fast-charging power bank.', price: 449, stock: 18, category: 'Electronics', imageUrl: img('powerbank') },

  // Fashion
  { name: 'Running Shoes', description: 'Lightweight shoes for daily runs.', price: 749, stock: 20, category: 'Fashion', imageUrl: img('shoes') },
  { name: 'Backpack', description: 'Water-resistant backpack with laptop pocket.', price: 499, stock: 25, category: 'Fashion', imageUrl: img('backpack') },
  { name: 'Casual T-Shirt', description: 'Comfortable cotton T-shirt for everyday wear.', price: 179, stock: 35, category: 'Fashion', imageUrl: img('tshirt') },
  { name: 'Denim Jeans', description: 'Classic slim-fit denim jeans.', price: 399, stock: 20, category: 'Fashion', imageUrl: img('jeans') },
  { name: 'Leather Wallet', description: 'Compact wallet with multiple card slots.', price: 229, stock: 28, category: 'Fashion', imageUrl: img('wallet') },
  { name: 'Baseball Cap', description: 'Adjustable casual cap with curved brim.', price: 129, stock: 40, category: 'Fashion', imageUrl: img('cap') },

  // Home
  { name: 'Coffee Mug', description: 'Ceramic mug, 350 ml.', price: 89, stock: 50, category: 'Home', imageUrl: img('mug') },
  { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness.', price: 259, stock: 18, category: 'Home', imageUrl: img('lamp') },
  { name: 'Water Bottle', description: 'Reusable stainless steel 750ml water bottle.', price: 189, stock: 32, category: 'Home', imageUrl: img('bottle') },
  { name: 'Wall Clock', description: 'Modern minimalist wall clock for home decor.', price: 299, stock: 14, category: 'Home', imageUrl: img('clock') },
  { name: 'Cushion Set', description: 'Set of two soft decorative cushions.', price: 249, stock: 16, category: 'Home', imageUrl: img('cushions') },
  { name: 'Storage Basket', description: 'Woven basket for organizing household items.', price: 159, stock: 24, category: 'Home', imageUrl: img('basket') },

  // Stationery
  { name: 'Notebook Set', description: 'Pack of 3 A5 notebooks.', price: 120, stock: 40, category: 'Stationery', imageUrl: img('notebook') },
  { name: 'Gel Pens (10 pack)', description: 'Smooth writing gel pens in assorted colours.', price: 65, stock: 60, category: 'Stationery', imageUrl: img('pens') },
  { name: 'Pencil Set', description: 'Pack of 12 HB graphite pencils.', price: 45, stock: 55, category: 'Stationery', imageUrl: img('pencils') },
  { name: 'Office Stapler', description: 'Compact desktop stapler with staple remover.', price: 99, stock: 20, category: 'Stationery', imageUrl: img('stapler') },
  { name: 'Sticky Notes Pack', description: 'Colourful sticky notes for reminders and planning.', price: 39, stock: 70, category: 'Stationery', imageUrl: img('stickynotes') },
];


(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    if (!(await User.findOne({ email: 'admin@store.com' }))) {
      await User.create({
        name: 'Store Admin',
        email: 'admin@store.com',
        password: await bcrypt.hash('Admin123', 10),
        role: 'admin',
      });
      console.log('Admin created: admin@store.com / Admin123');
    }

    if ((await Product.countDocuments()) === 0) {
      await Product.insertMany(products);
      console.log('Sample products added');
    } else {
      console.log('Products already exist, skipped');
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
  }
})();