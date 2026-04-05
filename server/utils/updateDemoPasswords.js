/**
 * Updates known demo accounts to the current strong passwords (hashed via User model).
 * Run from server folder: node utils/updateDemoPasswords.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const LoginThrottle = require('../models/LoginThrottle');

const DEMO_UPDATES = [
  { email: 'admin@easecart.com', password: 'Admin123x' },
  { email: 'manager@easecart.com', password: 'Manager12' },
  { email: 'john@example.com', password: 'Customer1' },
  { email: 'jane@example.com', password: 'Customer2' },
];

async function run() {
  await connectDB();

  for (const { email, password } of DEMO_UPDATES) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.warn(`Skip (not found): ${email}`);
      continue;
    }
    user.password = password;
    await user.save();
    console.log(`Updated password for: ${email}`);
  }

  const emails = DEMO_UPDATES.map((d) => d.email.toLowerCase());
  const del = await LoginThrottle.deleteMany({ email: { $in: emails } });
  console.log(`Cleared login lockouts for demo emails: ${del.deletedCount} document(s)`);

  await mongoose.connection.close();
  console.log('Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
