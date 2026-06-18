const Customer = require('../models/Customer');
const { isDbConnected } = require('../config/db');
const fallbackDb = require('../utils/dbFallback');

// @desc    Get all customers (with searching, filtering, sorting, and pagination)
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const result = fallbackDb.getCustomersList(req.query);
      return res.json({
        success: true,
        count: result.data.length,
        pagination: {
          total: result.total,
          page: parseInt(req.query.page) || 1,
          pages: result.pages,
          limit: parseInt(req.query.limit) || 10,
        },
        data: result.data,
      });
    }

    // Standard MongoDB Pipeline
    const { search, city, sortBy, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.customerName = { $regex: search, $options: 'i' };
    }

    if (city && city !== 'All') {
      query.city = city;
    }

    let sortOption = {};
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: customers.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
      data: customers,
    });
  } catch (error) {
    console.error('Get Customers Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res) => {
  const { customerName, email, city, createdAt } = req.body;

  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const customer = fallbackDb.createCustomerItem({ customerName, email, city, createdAt });
      return res.status(201).json({
        success: true,
        data: customer,
      });
    }

    // Standard MongoDB Pipeline
    const emailExists = await Customer.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Customer with this email already exists' });
    }

    const customer = await Customer.create({
      customerName,
      email,
      city,
      createdAt: createdAt || new Date(),
    });

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Create Customer Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const customer = fallbackDb.updateCustomerItem(req.params.id, req.body);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer record not found' });
      }
      return res.json({
        success: true,
        data: customer,
      });
    }

    // Standard MongoDB Pipeline
    const { customerName, email, city } = req.body;
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer record not found' });
    }

    if (email && email !== customer.email) {
      const emailExists = await Customer.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Customer with this email already exists' });
      }
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Update Customer Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const success = fallbackDb.deleteCustomerItem(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Customer record not found' });
      }
      return res.json({
        success: true,
        message: 'Customer record removed successfully',
      });
    }

    // Standard MongoDB Pipeline
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer record not found' });
    }

    await customer.deleteOne();

    res.json({
      success: true,
      message: 'Customer record removed successfully',
    });
  } catch (error) {
    console.error('Delete Customer Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
