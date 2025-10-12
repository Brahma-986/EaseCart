const express = require('express');
const { body } = require('express-validator');
const {
  getComplaints,
  getComplaint,
  createComplaint,
  respondToComplaint,
  updateComplaintStatus,
  getComplaintStats
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules
const complaintValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('category')
    .isIn(['product', 'order', 'shipping', 'payment', 'service', 'other'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('order')
    .optional()
    .isMongoId()
    .withMessage('Invalid order ID'),
  body('product')
    .optional()
    .isMongoId()
    .withMessage('Invalid product ID')
];

// Routes
router.get('/stats', protect, authorize('manager', 'admin'), getComplaintStats);
router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaint);
router.post('/', protect, authorize('customer'), complaintValidation, createComplaint);
router.put('/:id/respond', protect, authorize('manager', 'admin'), respondToComplaint);
router.put('/:id/status', protect, authorize('manager', 'admin'), updateComplaintStatus);

module.exports = router;
