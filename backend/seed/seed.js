/**
 * Seed script to create initial products, users and orders.
 * Usage: node seed/seed.js
 */
require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_ecommerce';

async function seed() {
  try {
    await connectDB(MONGODB_URI);
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    const products = await Product.insertMany([
      {
        name: 'Summer Breeze T-Shirt',
        description: 'Lightweight cotton T-shirt perfect for summer outings.',
        price: 19.99,
        images: ['/uploads/sample1.jpg'],
        category: 'Apparel',
        tags: ['summer', 'casual', 'cotton'],
        stock: 120,
        seasonalScore: 1.4
      },
      {
        name: 'Diwali Sparkle Lantern',
        description: 'Decorative lantern for festive Diwali ambiance.',
        price: 29.5,
        images: ['/uploads/sample2.jpg'],
        category: 'Home Decor',
        tags: ['diwali', 'festive', 'lights'],
        stock: 50,
        seasonalScore: 2.0
      },
      {
        name: 'Student Backpack - Back to School',
        description: 'Durable backpack with laptop sleeve and ergonomic straps.',
        price: 39.99,
        images: ['/uploads/sample3.jpg'],
        category: 'Accessories',
        tags: ['school', 'student', 'backpack'],
        stock: 200,
        seasonalScore: 1.1
      }
    ]);

    const adminPass = await bcrypt.hash('adminpass', 10);
    await User.create({ name: 'Admin', email: 'admin@demo.com', password: adminPass, isAdmin: true });

    const userPass = await bcrypt.hash('userpass', 10);
    const alice = await User.create({ name: 'Alice', email: 'alice@demo.com', password: userPass });
    const bob = await User.create({ name: 'Bob', email: 'bob@demo.com', password: userPass });

    await Order.create({
      user: alice._id,
      items: [
        { product: products[0]._id, qty: 1, price: products[0].price },
        { product: products[1]._id, qty: 1, price: products[1].price }
      ],
      total: products[0].price + products[1].price
    });

    await Order.create({
      user: bob._id,
      items: [
        { product: products[0]._id, qty: 1, price: products[0].price },
        { product: products[2]._id, qty: 1, price: products[2].price }
      ],
      total: products[0].price + products[2].price
    });

    console.log('Seeding completed');
    process.exit();
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

seed();
