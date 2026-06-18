const express = require('express');
const {
  getDashboardData,
  getRevenueAnalytics,
  getSalesAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect middleware to all analytics routes
router.use(protect);

router.get('/dashboard', getDashboardData);
router.get('/revenue', getRevenueAnalytics);
router.get('/sales', getSalesAnalytics);
router.get('/customers', getCustomerAnalytics);
router.get('/products', getProductAnalytics);

module.exports = router;
