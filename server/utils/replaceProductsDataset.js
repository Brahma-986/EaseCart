require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');
const products = require('./productsDataset');

async function run() {
  await connectDB();
  const manager = await User.findOne({ role: 'manager' }).select('_id');
  const admin = await User.findOne({ role: 'admin' }).select('_id');
  const createdBy = manager?._id || admin?._id;

  if (!createdBy) {
    throw new Error('No manager/admin user found. Create one before replacing products.');
  }

  await Product.deleteMany({});
  const toInsert = products.map((p) => ({ ...p, createdBy }));
  await Product.insertMany(toInsert);
  console.log(`Inserted ${toInsert.length} products.`);

  await mongoose.connection.close();
}

run()
  .then(() => {
    console.log('Products dataset replaced successfully.');
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    try {
      await mongoose.connection.close();
    } catch {}
    process.exit(1);
  });
