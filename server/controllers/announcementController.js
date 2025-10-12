const { validationResult } = require('express-validator');
const Announcement = require('../models/Announcement');

// @desc    Get announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.getActiveForUser(req.user.role)
      .populate('createdBy', 'name role')
      .sort('-createdAt');

    res.json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name role');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user can view this announcement
    if (announcement.targetRole !== 'all' &&
        announcement.targetRole !== req.user.role &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this announcement'
      });
    }

    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Manager/Admin)
const createAnnouncement = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const announcementData = {
      ...req.body,
      createdBy: req.user._id
    };

    const announcement = await Announcement.create(announcementData);

    // Emit socket event to all connected users
    const io = req.app.get('io');
    io.emit('newAnnouncement', {
      announcement: announcement,
      targetRole: announcement.targetRole
    });

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Manager/Admin)
const updateAnnouncement = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      announcement[key] = req.body[key];
    });

    await announcement.save();

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Manager/Admin)
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    announcement.isActive = false;
    await announcement.save();

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Mark announcement as read
// @route   POST /api/announcements/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    await announcement.markAsRead(req.user._id);

    res.json({
      success: true,
      message: 'Announcement marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAsRead
};
