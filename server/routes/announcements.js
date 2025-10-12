const express = require('express');
const { body } = require('express-validator');
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAsRead
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules
const announcementValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('targetRole')
    .optional()
    .isIn(['all', 'customer', 'manager', 'admin'])
    .withMessage('Invalid target role'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Invalid expiration date')
];

// Routes
router.get('/', protect, getAnnouncements);
router.get('/:id', protect, getAnnouncement);
router.post('/', protect, authorize('manager', 'admin'), announcementValidation, createAnnouncement);
router.put('/:id', protect, authorize('manager', 'admin'), announcementValidation, updateAnnouncement);
router.delete('/:id', protect, authorize('manager', 'admin'), deleteAnnouncement);
router.post('/:id/read', protect, markAsRead);

module.exports = router;
