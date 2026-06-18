const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Please add a quantity'],
    min: [1, 'Quantity must be at least 1'],
  },
  revenue: {
    type: Number,
    required: [true, 'Please add revenue'],
    min: [0, 'Revenue cannot be negative'],
  },
  saleDate: {
    type: Date,
    required: [true, 'Please add a sale date'],
    default: Date.now,
  },
});

module.exports = mongoose.model('Sale', saleSchema);
