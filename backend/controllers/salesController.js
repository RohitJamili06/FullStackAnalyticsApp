const Sale = require('../models/Sale');
const { isDbConnected } = require('../config/db');
const fallbackDb = require('../utils/dbFallback');

// @desc    Get all sales (with searching, filtering, sorting, and pagination)
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const result = fallbackDb.getSalesList(req.query);
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
    const { search, category, startDate, endDate, sortBy, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.productName = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) {
        query.saleDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.saleDate.$lte = end;
      }
    }

    let sortOption = {};
    if (sortBy === 'revenue_desc') {
      sortOption = { revenue: -1 };
    } else if (sortBy === 'date_asc') {
      sortOption = { saleDate: 1 };
    } else {
      sortOption = { saleDate: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Sale.countDocuments(query);
    const sales = await Sale.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: sales.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
      data: sales,
    });
  } catch (error) {
    console.error('Get Sales Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Create a new sale
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
  const { productName, category, quantity, revenue, saleDate } = req.body;

  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const sale = fallbackDb.createSaleItem({ productName, category, quantity, revenue, saleDate });
      return res.status(201).json({
        success: true,
        data: sale,
      });
    }

    // Standard MongoDB Pipeline
    const sale = await Sale.create({
      productName,
      category,
      quantity,
      revenue,
      saleDate: saleDate || new Date(),
    });

    res.status(201).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error('Create Sale Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Update a sale
// @route   PUT /api/sales/:id
// @access  Private
const updateSale = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const sale = fallbackDb.updateSaleItem(req.params.id, req.body);
      if (!sale) {
        return res.status(404).json({ success: false, message: 'Sale record not found' });
      }
      return res.json({
        success: true,
        data: sale,
      });
    }

    // Standard MongoDB Pipeline
    let sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale record not found' });
    }

    sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error('Update Sale Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Delete a sale
// @route   DELETE /api/sales/:id
// @access  Private
const deleteSale = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const success = fallbackDb.deleteSaleItem(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Sale record not found' });
      }
      return res.json({
        success: true,
        message: 'Sale record removed successfully',
      });
    }

    // Standard MongoDB Pipeline
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale record not found' });
    }

    await sale.deleteOne();

    res.json({
      success: true,
      message: 'Sale record removed successfully',
    });
  } catch (error) {
    console.error('Delete Sale Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getSales,
  createSale,
  updateSale,
  deleteSale,
};
