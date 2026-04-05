require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Announcement = require('../models/Announcement');
const Complaint = require('../models/Complaint');

const connectDB = require('../config/db');
const products = require('./productsDataset');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@easecart.com',
    password: 'Admin123x',
    role: 'admin'
  },
  {
    name: 'Manager User',
    email: 'manager@easecart.com',
    password: 'Manager12',
    role: 'manager'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Customer1',
    role: 'customer',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    phone: '+1-555-0123'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'Customer2',
    role: 'customer',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    phone: '+1-555-0456'
  }
];


const announcements = [
  {
    title: 'Welcome to EaseCart!',
    message: 'We are excited to announce the launch of our new e-commerce platform. Enjoy seamless shopping experience with our wide range of products.',
    targetRole: 'all',
    priority: 'high'
  },
  {
    title: 'New Product Categories Added',
    message: 'We have added new product categories including smart home devices and eco-friendly products. Check them out!',
    targetRole: 'customer',
    priority: 'medium'
  },
  {
    title: 'Inventory Management Update',
    message: 'Please ensure all product stock levels are updated regularly. Use the new inventory tracking features.',
    targetRole: 'manager',
    priority: 'medium'
  },
  {
    title: 'Holiday Sale - 30% Off Electronics',
    message: 'Don\'t miss our biggest sale of the year! Get 30% off on all electronics. Limited time offer!',
    targetRole: 'customer',
    priority: 'urgent',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
];

const complaints = [
  {
    title: 'Product Quality Issue',
    message: 'I received a damaged product. The packaging was torn and the item inside was scratched.',
    category: 'product',
    priority: 'high',
    status: 'open'
  },
  {
    title: 'Late Delivery',
    message: 'My order was supposed to arrive 3 days ago but I still haven\'t received it. Can you please check the status?',
    category: 'shipping',
    priority: 'medium',
    status: 'in-progress'
  },
  {
    title: 'Payment Processing Error',
    message: 'I was charged twice for the same order. Please refund the duplicate charge.',
    category: 'payment',
    priority: 'urgent',
    status: 'resolved',
    response: {
      message: 'We apologize for the inconvenience. The duplicate charge has been refunded to your account.',
      respondedAt: new Date()
    }
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database first
    await connectDB();
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Announcement.deleteMany({});
    await Complaint.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.role})`);
    }

    // Create products
    const createdProducts = [];
    for (const productData of products) {
      const product = new Product({
        ...productData,
        createdBy: createdUsers.find(u => u.role === 'manager')._id
      });
      await product.save();
      createdProducts.push(product);
      console.log(`Created product: ${product.name}`);
    }

    // Create announcements
    for (const announcementData of announcements) {
      const announcement = new Announcement({
        ...announcementData,
        createdBy: createdUsers.find(u => u.role === 'admin')._id
      });
      await announcement.save();
      console.log(`Created announcement: ${announcement.title}`);
    }

    // Create complaints
    for (const complaintData of complaints) {
      const complaint = new Complaint({
        ...complaintData,
        user: createdUsers.find(u => u.role === 'customer')._id,
        response: complaintData.response ? {
          ...complaintData.response,
          respondedBy: createdUsers.find(u => u.role === 'manager')._id
        } : undefined
      });
      await complaint.save();
      console.log(`Created complaint: ${complaint.title}`);
    }

    // Create sample orders
    const customer = createdUsers.find(u => u.role === 'customer');
    const sampleOrder = new Order({
      user: customer._id,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          price: createdProducts[0].price,
          quantity: 1,
          image: createdProducts[0].images[0].url
        },
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          price: createdProducts[1].price,
          quantity: 2,
          image: createdProducts[1].images[0].url
        }
      ],
      shippingAddress: customer.address,
      paymentMethod: 'card',
      taxPrice: 45.0,
      shippingPrice: 10.0,
      totalPrice: 654.97,
      status: 'delivered',
      deliveredAt: new Date()
    });
    await sampleOrder.save();
    console.log('Created sample order');

    // Create more sample orders for better analytics
    const customer2 = createdUsers[3]; // Jane Smith
    const sampleOrder2 = new Order({
      user: customer2._id,
      items: [
        {
          product: createdProducts[2]._id,
          name: createdProducts[2].name,
          price: createdProducts[2].price,
          quantity: 3,
          image: createdProducts[2].images[0].url
        }
      ],
      shippingAddress: customer2.address,
      paymentMethod: 'paypal',
      taxPrice: 9.0,
      shippingPrice: 0.0, // Free shipping over $100
      totalPrice: 98.97,
      status: 'processing'
    });
    await sampleOrder2.save();

    const sampleOrder3 = new Order({
      user: customer._id,
      items: [
        {
          product: createdProducts[4]._id,
          name: createdProducts[4].name,
          price: createdProducts[4].price,
          quantity: 1,
          image: createdProducts[4].images[0].url
        }
      ],
      shippingAddress: customer.address,
      paymentMethod: 'card',
      taxPrice: 15.0,
      shippingPrice: 10.0,
      totalPrice: 174.99,
      status: 'shipped'
    });
    await sampleOrder3.save();

    console.log('Database seeding completed successfully!');
    console.log('\nSample accounts created:');
    console.log('Admin: admin@easecart.com / Admin123x');
    console.log('Manager: manager@easecart.com / Manager12');
    console.log('Customer: john@example.com / Customer1');
    console.log('Customer: jane@example.com / Customer2');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;