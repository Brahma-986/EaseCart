const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../utils/email');

const createContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const contact = await Contact.create(req.body);
    await sendContactNotification(contact);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
      data: { id: contact._id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit contact form' });
  }
};

const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = status ? { status } : {};
    const contacts = await Contact.find(query).sort('-createdAt').skip(skip).limit(limit);
    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateContactStatus = async (req, res) => {
  const { status } = req.body;
  const valid = ['new', 'read', 'replied', 'closed'];
  if (!valid.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createContact, getContacts, updateContactStatus };
