const express = require('express');
const { check } = require('express-validator');
const {
  getSales,
  createSale,
  updateSale,
  deleteSale,
} = require('../controllers/salesController');
const { protect } = require('../middleware/authMiddleware');
const { validateFields } = require('../middleware/validateMiddleware');

const router = express.Router();

// Apply protect middleware to all sales routes
router.use(protect);

router
  .route('/')
  .get(getSales)
  .post(
    [
      check('productName', 'Product name is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('quantity', 'Quantity must be a number greater than 0').isNumeric({ min: 1 }),
      check('revenue', 'Revenue must be a number greater than or equal to 0').isFloat({ min: 0 }),
      validateFields,
    ],
    createSale
  );

router
  .route('/:id')
  .put(
    [
      check('productName', 'Product name is required').optional().not().isEmpty(),
      check('category', 'Category is required').optional().not().isEmpty(),
      check('quantity', 'Quantity must be a number greater than 0').optional().isNumeric({ min: 1 }),
      check('revenue', 'Revenue must be a number greater than or equal to 0').optional().isFloat({ min: 0 }),
      validateFields,
    ],
    updateSale
  )
  .delete(deleteSale);

module.exports = router;
