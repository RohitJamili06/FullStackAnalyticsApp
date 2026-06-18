const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fullstack_insight', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.warn('================================================================');
    console.warn('DATABASE CONNECTION ERROR DETECTED:');
    console.warn(error.message || error);
    console.warn('----------------------------------------------------------------');
    console.warn('Please check:');
    console.warn('1. Whitelisted IP: Make sure "Allow Access From Anywhere" (0.0.0.0/0) is enabled in Atlas Network Access.');
    console.warn('2. Username/Password: Verify they match your database user settings.');
    console.warn('================================================================');
    isConnected = false;
  }
};

const isDbConnected = () => isConnected;

module.exports = { connectDB, isDbConnected };
