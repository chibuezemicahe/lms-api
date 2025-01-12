const express = require('express');
const { login, signup } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

// Login route (publicly assessible)
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
  ],
  login
);


// Signup route (publicly assessible)
router.post(
  '/signup',
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    check('role_id').isInt().withMessage('Role ID must be an integer'),
  ],
  signup
);

module.exports = router;

