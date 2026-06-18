const express = require('express');
const { check } = require('express-validator');
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateFields } = require('../middleware/validateMiddleware');

const router = express.Router();

// Register Route
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    validateFields,
  ],
  registerUser
);

// Login Route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    validateFields,
  ],
  loginUser
);

// Profile Route (Protected)
router.get('/profile', protect, getUserProfile);

module.exports = router;
