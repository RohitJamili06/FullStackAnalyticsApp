const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Enable CORS for all routes (supports flexible hosting environments)
app.use(cors());

// Body Parser Middleware
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const salesRoutes = require('./routes/salesRoutes');
const customersRoutes = require('./routes/customersRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'FullStack Insight API is running',
    timestamp: new Date(),
  });
});

// Serve frontend built assets statically
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Fallback all other GET requests to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error occurred',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
