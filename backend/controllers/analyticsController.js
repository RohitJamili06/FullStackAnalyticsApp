const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const { isDbConnected } = require('../config/db');
const fallbackDb = require('../utils/dbFallback');

// @desc    Get dashboard KPIs
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const stats = fallbackDb.getDashboardStats();
      return res.json({
        success: true,
        data: stats,
      });
    }

    // Standard MongoDB Pipeline
    const salesStats = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' },
          totalSalesQty: { $sum: '$quantity' },
          salesCount: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = salesStats[0]?.totalRevenue || 0;
    const totalSales = salesStats[0]?.totalSalesQty || 0;
    const salesCount = salesStats[0]?.salesCount || 0;
    const averageOrderValue = salesCount > 0 ? totalRevenue / salesCount : 0;

    const totalCustomers = await Customer.countDocuments({});

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthStats = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: currentMonthStart },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$revenue' },
        },
      },
    ]);

    const lastMonthStats = await Sale.aggregate([
      {
        $match: {
          saleDate: {
            $gte: lastMonthStart,
            $lt: currentMonthStart,
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$revenue' },
        },
      },
    ]);

    const currentMonthRevenue = currentMonthStats[0]?.revenue || 0;
    const lastMonthRevenue = lastMonthStats[0]?.revenue || 0;

    let monthlyGrowth = 0;
    if (lastMonthRevenue > 0) {
      monthlyGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      monthlyGrowth = 100;
    }

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalSales,
        totalCustomers,
        monthlyGrowth,
        averageOrderValue,
      },
    });
  } catch (error) {
    console.error('Dashboard Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get Revenue Trend (grouped by year/month)
// @route   GET /api/analytics/revenue
// @access  Private
const getRevenueAnalytics = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const stats = fallbackDb.getRevenueTrendStats();
      return res.json({
        success: true,
        data: stats,
      });
    }

    // Standard MongoDB Pipeline
    const revenueTrend = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$saleDate' },
            month: { $month: '$saleDate' },
          },
          revenue: { $sum: '$revenue' },
          quantity: { $sum: '$quantity' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: revenueTrend,
    });
  } catch (error) {
    console.error('Revenue Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get Sales Category Performance
// @route   GET /api/analytics/sales
// @access  Private
const getSalesAnalytics = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const stats = fallbackDb.getSalesCategoryStats();
      return res.json({
        success: true,
        data: stats,
      });
    }

    // Standard MongoDB Pipeline
    const categoryStats = await Sale.aggregate([
      {
        $group: {
          _id: '$category',
          totalRevenue: { $sum: '$revenue' },
          totalQuantity: { $sum: '$quantity' },
          salesCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
    ]);

    res.json({
      success: true,
      data: categoryStats,
    });
  } catch (error) {
    console.error('Sales Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get Customer growth trends and geographical splits
// @route   GET /api/analytics/customers
// @access  Private
const getCustomerAnalytics = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const stats = fallbackDb.getCustomerGrowthStats();
      return res.json({
        success: true,
        data: {
          growth: stats.growth,
          cities: stats.cities,
        },
      });
    }

    // Standard MongoDB Pipeline
    const customerGrowth = await Customer.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const cityDistribution = await Customer.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        growth: customerGrowth,
        cities: cityDistribution,
      },
    });
  } catch (error) {
    console.error('Customer Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get Product level statistics (Top Selling Products)
// @route   GET /api/analytics/products
// @access  Private
const getProductAnalytics = async (req, res) => {
  try {
    // FALLBACK Preview Mode
    if (!isDbConnected()) {
      const stats = fallbackDb.getProductLeaderboard();
      return res.json({
        success: true,
        data: stats,
      });
    }

    // Standard MongoDB Pipeline
    const topProducts = await Sale.aggregate([
      {
        $group: {
          _id: '$productName',
          category: { $first: '$category' },
          totalRevenue: { $sum: '$revenue' },
          totalQuantity: { $sum: '$quantity' },
          salesCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error('Product Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getDashboardData,
  getRevenueAnalytics,
  getSalesAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
};
