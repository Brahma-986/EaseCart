const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules
const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('paymentMethod')
    .isIn(['card', 'paypal', 'bank-transfer'])
    .withMessage('Invalid payment method')
];

// Routes
router.get('/stats', protect, authorize('manager', 'admin'), getOrderStats);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, authorize('customer'), orderValidation, createOrder);
router.put('/:id/status', protect, authorize('manager', 'admin'), updateOrderStatus);

module.exports = router;
