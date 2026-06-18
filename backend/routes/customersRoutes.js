const express = require('express');
const { check } = require('express-validator');
const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customersController');
const { protect } = require('../middleware/authMiddleware');
const { validateFields } = require('../middleware/validateMiddleware');

const router = express.Router();

// Apply protect middleware to all customer routes
router.use(protect);

router
  .route('/')
  .get(getCustomers)
  .post(
    [
      check('customerName', 'Customer name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('city', 'City is required').not().isEmpty(),
      validateFields,
    ],
    createCustomer
  );

router
  .route('/:id')
  .put(
    [
      check('customerName', 'Customer name is required').optional().not().isEmpty(),
      check('email', 'Please include a valid email').optional().isEmail(),
      check('city', 'City is required').optional().not().isEmpty(),
      validateFields,
    ],
    updateCustomer
  )
  .delete(deleteCustomer);

module.exports = router;
