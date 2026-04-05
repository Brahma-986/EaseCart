const express = require('express');
const { body } = require('express-validator');
const { createContact, getContacts, updateContactStatus } = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 })
];

router.post('/', contactValidation, createContact);
router.get('/', protect, authorize('manager', 'admin'), getContacts);
router.put('/:id/status', protect, authorize('manager', 'admin'), updateContactStatus);

module.exports = router;
