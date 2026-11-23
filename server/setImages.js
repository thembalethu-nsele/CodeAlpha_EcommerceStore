require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const folder = path.join(__dirname, '../client/images');
const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

// "Power Bank", "power-bank" and "POWER_BANK" all become "powerbank"
const key = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

// Placeholder colours per category (used only when no photo is found)
const colors = {
  Electronics: '2563eb',
  Fashion: '9333ea',
  Home: '059669',
  Stationery: 'd97706',
};

const placeholder = (p) => {
  const color = colors[p.category] || '475569';
  const text = encodeURIComponent(p.name).replace(/%20/g, '+');
  return `https://placehold.co/400x300/${color}/ffffff?text=${text}`;
};

// Only replace images this script (or the seed) created.
// A custom URL you typed in the Admin page is left alone.
const isReplaceable = (url) =>
  !url ||
  url.startsWith('/images/') ||
  url.includes('picsum.photos') ||
  url.includes('placehold.co');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Build a lookup of every image file in the folder
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    const files = fs.readdirSync(folder).filter((f) =>
      extensions.includes(path.extname(f).toLowerCase())
    );
    const lookup = {};
    files.forEach((f) => {
      lookup[key(path.basename(f, path.extname(f)))] = f;
    });

    const products = await Product.find();
    let withPhoto = 0;
    let withPlaceholder = 0;
    let skipped = 0;
    const placeholderList = [];

    for (const p of products) {
      if (!isReplaceable(p.imageUrl)) {
        skipped++;
        continue;
      }
      const file = lookup[key(p.name)];
      if (file) {
        p.imageUrl = '/images/' + encodeURIComponent(file);
        withPhoto++;
      } else {
        p.imageUrl = placeholder(p);
        withPlaceholder++;
        placeholderList.push(p.name);
      }
      await p.save();
    }

    console.log(`Total products: ${products.length}`);
    console.log(`Using your photo: ${withPhoto}`);
    console.log(`Using placeholder: ${withPlaceholder}`);
    if (skipped) console.log(`Skipped (custom image URL): ${skipped}`);

    if (placeholderList.length) {
      console.log('\nNo photo found for these products (save a file named after the product in client/images):');
      placeholderList.forEach((n) => console.log(' - ' + n));
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
  }
})();