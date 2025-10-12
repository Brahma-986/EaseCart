const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { items, shippingAddress, paymentMethod } = req.body;

  try {
    // Validate items and check stock
    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found or inactive`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url
      });

      totalPrice += product.price * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate tax and shipping (simplified)
    const taxPrice = totalPrice * 0.1; // 10% tax
    const shippingPrice = totalPrice > 100 ? 0 : 10; // Free shipping over $100
    const finalTotal = totalPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice: finalTotal
    });

    // Populate product details
    await order.populate('items.product');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(req.user._id.toString()).emit('orderCreated', {
      orderId: order._id,
      total: order.totalPrice,
      status: order.status
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    let query = {};

    // Customers can only see their own orders
    if (req.user.role === 'customer') {
      query.user = req.user._id;
    }
    // Managers and admins can see all orders

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email address')
      .populate('items.product', 'name images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin/manager
    if (order.user._id.toString() !== req.user._id.toString() &&
        !['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Manager/Admin)
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(order.user.toString()).emit('orderStatusUpdated', {
      orderId: order._id,
      status: order.status,
      deliveredAt: order.deliveredAt
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private (Manager/Admin)
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
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
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
};
