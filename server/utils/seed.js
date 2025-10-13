require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Announcement = require('../models/Announcement');
const Complaint = require('../models/Complaint');

const connectDB = require('../config/db');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@easecart.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Manager User',
    email: 'manager@easecart.com',
    password: 'manager123',
    role: 'manager'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'customer123',
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
    password: 'customer123',
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

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    category: 'electronics',
    stock: 50,
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Wireless Headphones' }
    ],
    brand: 'TechSound',
    weight: 0.3,
    dimensions: { length: 20, width: 18, height: 8 },
    tags: ['wireless', 'bluetooth', 'noise-cancellation', 'headphones']
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and water resistance.',
    price: 299.99,
    category: 'electronics',
    stock: 30,
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Smart Watch' }
    ],
    brand: 'FitTech',
    weight: 0.05,
    dimensions: { length: 4, width: 4, height: 1 },
    tags: ['fitness', 'smartwatch', 'gps', 'heart-rate']
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt in various colors.',
    price: 29.99,
    category: 'clothing',
    stock: 100,
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Cotton T-Shirt' }
    ],
    brand: 'EcoWear',
    weight: 0.2,
    dimensions: { length: 30, width: 25, height: 1 },
    tags: ['organic', 'cotton', 'sustainable', 't-shirt']
  },
  {
    name: 'Programming Fundamentals Book',
    description: 'Comprehensive guide to programming fundamentals with practical examples.',
    price: 49.99,
    category: 'books',
    stock: 75,
    images: [
      { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500', alt: 'Programming Book' }
    ],
    brand: 'TechBooks',
    weight: 0.8,
    dimensions: { length: 23, width: 15, height: 3 },
    tags: ['programming', 'education', 'computer-science', 'book']
  },
  {
    name: 'Smart Home Security Camera',
    description: 'HD security camera with night vision, motion detection, and mobile app control.',
    price: 149.99,
    category: 'electronics',
    stock: 25,
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', alt: 'Security Camera' }
    ],
    brand: 'SecureHome',
    weight: 0.4,
    dimensions: { length: 10, width: 10, height: 15 },
    tags: ['security', 'camera', 'smart-home', 'surveillance']
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with extra cushioning for comfort during workouts.',
    price: 39.99,
    category: 'sports',
    stock: 60,
    images: [
      { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', alt: 'Yoga Mat' }
    ],
    brand: 'FlexFit',
    weight: 1.2,
    dimensions: { length: 180, width: 60, height: 1 },
    tags: ['yoga', 'fitness', 'mat', 'exercise']
  },
  {
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with customizable keys and anti-ghosting technology.',
    price: 129.99,
    category: 'electronics',
    stock: 40,
    images: [
      { url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500', alt: 'Gaming Keyboard' }
    ],
    brand: 'GameTech',
    weight: 1.1,
    dimensions: { length: 45, width: 15, height: 3 },
    tags: ['gaming', 'keyboard', 'mechanical', 'rgb']
  },
  {
    name: 'Denim Jacket Classic',
    description: 'Classic denim jacket made from premium cotton denim with vintage wash.',
    price: 79.99,
    category: 'clothing',
    stock: 35,
    images: [
      { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Denim Jacket' }
    ],
    brand: 'DenimCo',
    weight: 0.8,
    dimensions: { length: 35, width: 30, height: 2 },
    tags: ['denim', 'jacket', 'classic', 'vintage']
  },
  {
    name: 'Coffee Maker Deluxe',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe.',
    price: 89.99,
    category: 'home',
    stock: 20,
    images: [
      { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500', alt: 'Coffee Maker' }
    ],
    brand: 'BrewMaster',
    weight: 3.5,
    dimensions: { length: 30, width: 20, height: 35 },
    tags: ['coffee', 'kitchen', 'appliance', 'programmable']
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight running shoes with advanced cushioning and breathable mesh upper.',
    price: 119.99,
    category: 'sports',
    stock: 45,
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', alt: 'Running Shoes' }
    ],
    brand: 'RunFast',
    weight: 0.6,
    dimensions: { length: 32, width: 12, height: 10 },
    tags: ['running', 'shoes', 'athletic', 'lightweight']
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
    console.log('Admin: admin@easecart.com / admin123');
    console.log('Manager: manager@easecart.com / manager123');
    console.log('Customer: john@example.com / customer123');
    console.log('Customer: jane@example.com / customer123');

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