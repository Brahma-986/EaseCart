const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'other'])
    .withMessage('Invalid category'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

// Routes
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('manager', 'admin'), productValidation, createProduct);
router.put('/:id', protect, authorize('manager', 'admin'), productValidation, updateProduct);
router.delete('/:id', protect, authorize('manager', 'admin'), deleteProduct);

module.exports = router;
