const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const { connectDB, isDbConnected } = require('../config/db');

const seed = async () => {
  try {
    // Clear existing collections
    await User.deleteMany({});
    await Sale.deleteMany({});
    await Customer.deleteMany({});

    console.log('Database cleared of existing data.');

    // 1. Seed Default Admin User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@fullstackinsight.com',
      password: 'AdminPass123!', // Pre-save hook hashes this
      role: 'admin',
    });
    console.log(`Seeded default admin user: ${adminUser.email} / AdminPass123!`);

    // 2. Seed Customer Data
    const mockCustomers = [
      { customerName: 'John Doe', email: 'john@example.com', city: 'New York', createdAt: new Date('2025-07-10') },
      { customerName: 'Jane Smith', email: 'jane@example.com', city: 'San Francisco', createdAt: new Date('2025-08-15') },
      { customerName: 'Robert Johnson', email: 'robert@example.com', city: 'Chicago', createdAt: new Date('2025-08-20') },
      { customerName: 'Emily Davis', email: 'emily@example.com', city: 'Seattle', createdAt: new Date('2025-09-05') },
      { customerName: 'Michael Brown', email: 'michael@example.com', city: 'Boston', createdAt: new Date('2025-09-12') },
      { customerName: 'Sarah Miller', email: 'sarah@example.com', city: 'Los Angeles', createdAt: new Date('2025-10-01') },
      { customerName: 'David Wilson', email: 'david@example.com', city: 'Austin', createdAt: new Date('2025-10-25') },
      { customerName: 'James Taylor', email: 'james@example.com', city: 'Denver', createdAt: new Date('2025-11-04') },
      { customerName: 'Patricia Anderson', email: 'patricia@example.com', city: 'New York', createdAt: new Date('2025-11-19') },
      { customerName: 'Linda Thomas', email: 'linda@example.com', city: 'San Francisco', createdAt: new Date('2025-12-05') },
      { customerName: 'Barbara Jackson', email: 'barbara@example.com', city: 'Chicago', createdAt: new Date('2025-12-18') },
      { customerName: 'Elizabeth White', email: 'elizabeth@example.com', city: 'Seattle', createdAt: new Date('2026-01-08') },
      { customerName: 'Jennifer Harris', email: 'jennifer@example.com', city: 'Boston', createdAt: new Date('2026-01-22') },
      { customerName: 'Maria Martin', email: 'maria@example.com', city: 'Los Angeles', createdAt: new Date('2026-02-14') },
      { customerName: 'Susan Thompson', email: 'susan@example.com', city: 'Austin', createdAt: new Date('2026-03-02') },
      { customerName: 'Margaret Garcia', email: 'margaret@example.com', city: 'Denver', createdAt: new Date('2026-03-29') },
      { customerName: 'Dorothy Martinez', email: 'dorothy@example.com', city: 'New York', createdAt: new Date('2026-04-11') },
      { customerName: 'Lisa Robinson', email: 'lisa@example.com', city: 'San Francisco', createdAt: new Date('2026-05-06') },
      { customerName: 'Nancy Clark', email: 'nancy@example.com', city: 'Chicago', createdAt: new Date('2026-05-23') },
      { customerName: 'Karen Rodriguez', email: 'karen@example.com', city: 'Seattle', createdAt: new Date('2026-06-01') },
      { customerName: 'Betty Lewis', email: 'betty@example.com', city: 'Boston', createdAt: new Date('2026-06-15') },
    ];

    const seededCustomers = await Customer.insertMany(mockCustomers);
    console.log(`Seeded ${seededCustomers.length} customers.`);

    // 3. Seed Sales Data (Spanning the last 12 calendar months to show line trends)
    const mockSales = [
      { productName: 'Wireless Mouse', category: 'Electronics', quantity: 12, revenue: 300, saleDate: new Date('2025-07-05') },
      { productName: 'Mechanical Keyboard', category: 'Electronics', quantity: 5, revenue: 500, saleDate: new Date('2025-08-12') },
      { productName: 'HD Monitor 27"', category: 'Electronics', quantity: 3, revenue: 750, saleDate: new Date('2025-09-15') },
      { productName: 'Bluetooth Headphones', category: 'Electronics', quantity: 8, revenue: 800, saleDate: new Date('2025-10-22') },
      { productName: 'USB-C Hub Multiport', category: 'Electronics', quantity: 15, revenue: 600, saleDate: new Date('2025-11-05') },
      { productName: 'Smart Home Speaker', category: 'Electronics', quantity: 10, revenue: 1000, saleDate: new Date('2025-12-10') },
      { productName: 'Wireless Mouse', category: 'Electronics', quantity: 20, revenue: 500, saleDate: new Date('2026-01-15') },
      { productName: 'Mechanical Keyboard', category: 'Electronics', quantity: 6, revenue: 600, saleDate: new Date('2026-02-20') },
      { productName: 'HD Monitor 27"', category: 'Electronics', quantity: 4, revenue: 1000, saleDate: new Date('2026-03-18') },
      { productName: 'Bluetooth Headphones', category: 'Electronics', quantity: 10, revenue: 1000, saleDate: new Date('2026-04-22') },

      { productName: 'Denim Jacket', category: 'Clothing', quantity: 4, revenue: 320, saleDate: new Date('2025-07-20') },
      { productName: 'Slim Fit Jeans', category: 'Clothing', quantity: 10, revenue: 500, saleDate: new Date('2025-08-25') },
      { productName: 'Leather Boots', category: 'Clothing', quantity: 3, revenue: 450, saleDate: new Date('2025-09-28') },
      { productName: 'Hooded Sweatshirt', category: 'Clothing', quantity: 12, revenue: 600, saleDate: new Date('2025-10-05') },
      { productName: 'Wool Scarf', category: 'Clothing', quantity: 20, revenue: 400, saleDate: new Date('2025-11-20') },
      { productName: 'Winter Parka', category: 'Clothing', quantity: 2, revenue: 400, saleDate: new Date('2025-12-18') },
      { productName: 'Slim Fit Jeans', category: 'Clothing', quantity: 15, revenue: 750, saleDate: new Date('2026-01-25') },
      { productName: 'Hooded Sweatshirt', category: 'Clothing', quantity: 18, revenue: 900, saleDate: new Date('2026-02-28') },
      { productName: 'Denim Jacket', category: 'Clothing', quantity: 8, revenue: 640, saleDate: new Date('2026-03-24') },

      { productName: 'Ergonomic Desk Chair', category: 'Office Supplies', quantity: 2, revenue: 400, saleDate: new Date('2025-08-01') },
      { productName: 'Notebook Set (5-Pack)', category: 'Office Supplies', quantity: 25, revenue: 250, saleDate: new Date('2025-09-08') },
      { productName: 'Desk Organizer', category: 'Office Supplies', quantity: 18, revenue: 360, saleDate: new Date('2025-10-14') },
      { productName: 'Gel Pen Box (50pcs)', category: 'Office Supplies', quantity: 30, revenue: 450, saleDate: new Date('2025-11-12') },
      { productName: 'Ergonomic Desk Chair', category: 'Office Supplies', quantity: 5, revenue: 1000, saleDate: new Date('2026-02-15') },
      { productName: 'Notebook Set (5-Pack)', category: 'Office Supplies', quantity: 40, revenue: 400, saleDate: new Date('2026-04-05') },

      { productName: 'Air Fryer XL', category: 'Home & Kitchen', quantity: 3, revenue: 360, saleDate: new Date('2025-07-28') },
      { productName: 'Coffee Maker (12-Cup)', category: 'Home & Kitchen', quantity: 5, revenue: 250, saleDate: new Date('2025-08-30') },
      { productName: 'Stainless Steel Pan', category: 'Home & Kitchen', quantity: 7, revenue: 560, saleDate: new Date('2025-09-20') },
      { productName: 'Digital Kitchen Scale', category: 'Home & Kitchen', quantity: 15, revenue: 300, saleDate: new Date('2025-10-30') },
      { productName: 'Air Fryer XL', category: 'Home & Kitchen', quantity: 6, revenue: 720, saleDate: new Date('2026-01-05') },
      { productName: 'Coffee Maker (12-Cup)', category: 'Home & Kitchen', quantity: 8, revenue: 400, saleDate: new Date('2026-03-05') },

      { productName: 'Smart Home Speaker', category: 'Electronics', quantity: 8, revenue: 800, saleDate: new Date('2026-05-10') },
      { productName: 'Leather Boots', category: 'Clothing', quantity: 5, revenue: 750, saleDate: new Date('2026-05-15') },
      { productName: 'Stainless Steel Pan', category: 'Home & Kitchen', quantity: 10, revenue: 800, saleDate: new Date('2026-05-22') },
      { productName: 'Desk Organizer', category: 'Office Supplies', quantity: 15, revenue: 300, saleDate: new Date('2026-05-28') },

      { productName: 'HD Monitor 27"', category: 'Electronics', quantity: 6, revenue: 1500, saleDate: new Date('2026-06-02') },
      { productName: 'Bluetooth Headphones', category: 'Electronics', quantity: 12, revenue: 1200, saleDate: new Date('2026-06-08') },
      { productName: 'Slim Fit Jeans', category: 'Clothing', quantity: 20, revenue: 1000, saleDate: new Date('2026-06-12') },
      { productName: 'Air Fryer XL', category: 'Home & Kitchen', quantity: 8, revenue: 960, saleDate: new Date('2026-06-14') },
      { productName: 'Notebook Set (5-Pack)', category: 'Office Supplies', quantity: 50, revenue: 500, saleDate: new Date('2026-06-17') },
    ];

    const seededSales = await Sale.insertMany(mockSales);
    console.log(`Seeded ${seededSales.length} sales entries.`);

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();
  if (!isDbConnected()) {
    console.error('================================================================');
    console.error('SEEDING ABORTED: Failed to connect to MongoDB.');
    console.error('Please resolve the database connection error shown above and try again.');
    console.error('================================================================');
    process.exit(1);
  }
  await seed();
};

runSeeder();
