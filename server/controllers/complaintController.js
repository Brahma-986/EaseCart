const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');

// @desc    Get complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    let query = {};

    // Customers can only see their own complaints
    if (req.user.role === 'customer') {
      query.user = req.user._id;
    }
    // Managers and admins can see all complaints

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
      .populate('response.respondedBy', 'name role')
      .populate('order', 'orderNumber totalPrice')
      .populate('product', 'name price')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      count: complaints.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email')
      .populate('response.respondedBy', 'name role')
      .populate('order', 'orderNumber totalPrice status')
      .populate('product', 'name price images');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user owns the complaint or is admin/manager
    if (complaint.user._id.toString() !== req.user._id.toString() &&
        !['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private (Customer)
const createComplaint = async (req, res) => {
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
    const complaintData = {
      ...req.body,
      user: req.user._id
    };

    const complaint = await Complaint.create(complaintData);

    // Emit socket event to managers/admins
    const io = req.app.get('io');
    io.emit('newComplaint', {
      complaintId: complaint._id,
      user: req.user.name,
      category: complaint.category,
      priority: complaint.priority
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Respond to complaint
// @route   PUT /api/complaints/:id/respond
// @access  Private (Manager/Admin)
const respondToComplaint = async (req, res) => {
  const { response } = req.body;

  if (!response) {
    return res.status(400).json({
      success: false,
      message: 'Response message is required'
    });
  }

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    await complaint.respond(response, req.user._id);

    // Emit socket event to customer
    const io = req.app.get('io');
    io.to(complaint.user.toString()).emit('complaintResponded', {
      complaintId: complaint._id,
      status: complaint.status,
      response: complaint.response
    });

    res.json({
      success: true,
      message: 'Response sent successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Manager/Admin)
const updateComplaintStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.status = status;
    if (status === 'resolved' || status === 'closed') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get complaint statistics
// @route   GET /api/complaints/stats
// @access  Private (Manager/Admin)
const getComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalComplaints = await Complaint.countDocuments();
    const resolvedCount = await Complaint.countDocuments({ status: 'resolved' });
    const avgResolutionTime = await Complaint.aggregate([
      { $match: { resolvedAt: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgDays: { $avg: '$daysOpen' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalComplaints,
        resolvedCount,
        resolutionRate: totalComplaints > 0 ? (resolvedCount / totalComplaints) * 100 : 0,
        averageResolutionDays: avgResolutionTime[0]?.avgDays || 0,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getComplaints,
  getComplaint,
  createComplaint,
  respondToComplaint,
  updateComplaintStatus,
  getComplaintStats
};
