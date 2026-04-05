const crypto = require('crypto');
const { validationResult } = require('express-validator');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/User');
const { buildOrderItemsFromCart } = require('../utils/orderHelpers');
const { sendOrderConfirmation } = require('../utils/email');

function getUsdToInr() {
  const n = Number(process.env.RAZORPAY_USD_TO_INR);
  return Number.isFinite(n) && n > 0 ? n : 83;
}

function getRazorpayOrThrow() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    const err = new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
    err.status = 503;
    throw err;
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function totalToPaise(totalUsd) {
  const inr = totalUsd * getUsdToInr();
  return Math.max(100, Math.round(inr * 100));
}

/**
 * POST /api/payments/razorpay/create-order
 * Validates cart server-side and creates a Razorpay order (no DB order yet, no stock deduction).
 */
const createRazorpayOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length < 1) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    const { orderItems, taxPrice, shippingPrice, totalPrice } = await buildOrderItemsFromCart(items, {
      deductStock: false
    });

    const amount = totalToPaise(totalPrice);
    const razorpay = getRazorpayOrThrow();

    const receipt = `rcpt_${Date.now().toString(36)}_${req.user._id.toString().slice(-6)}`;
    const rpOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt,
      notes: {
        userId: req.user._id.toString(),
        itemCount: String(orderItems.length)
      }
    });

    return res.status(201).json({
      success: true,
      data: {
        razorpayOrderId: rpOrder.id,
        amount,
        currency: rpOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        orderPreview: {
          items: orderItems,
          taxPrice,
          shippingPrice,
          totalPrice
        }
      }
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || 'Failed to create payment order';
    return res.status(status).json({ success: false, message });
  }
};

/**
 * POST /api/payments/razorpay/verify
 * Verifies signature + payment, then creates the order and deducts stock.
 */
const verifyRazorpayPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
    items,
    shippingAddress,
    paymentMethod
  } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ success: false, message: 'Missing Razorpay payment fields' });
  }

  if (paymentMethod !== 'razorpay') {
    return res.status(400).json({ success: false, message: 'Invalid payment method' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(503).json({ success: false, message: 'Razorpay is not configured' });
  }

  try {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto.createHmac('sha256', keySecret).update(body).digest('hex');
    if (expected !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const razorpay = getRazorpayOrThrow();
    const rpOrder = await razorpay.orders.fetch(razorpayOrderId);

    const preview = await buildOrderItemsFromCart(items, { deductStock: false });

    const expectedAmount = totalToPaise(preview.totalPrice);
    if (Number(rpOrder.amount) !== expectedAmount) {
      return res.status(400).json({
        success: false,
        message: 'Order amount mismatch. Please start checkout again.'
      });
    }

    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return res.status(400).json({
        success: false,
        message: `Payment not successful (status: ${payment.status})`
      });
    }

    const { orderItems, taxPrice, shippingPrice, totalPrice } = await buildOrderItemsFromCart(items, {
      deductStock: true
    });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'razorpay',
      paymentResult: {
        id: razorpayPaymentId,
        status: payment.status,
        update_time: payment.created_at ? String(payment.created_at) : undefined,
        email_address: req.user.email,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId
      },
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'processing'
    });

    await order.populate('items.product');

    const io = req.app.get('io');
    io.to(req.user._id.toString()).emit('orderCreated', {
      orderId: order._id,
      total: order.totalPrice,
      status: order.status
    });

    const userDoc = await User.findById(req.user._id).select('email name');
    if (userDoc?.email) {
      sendOrderConfirmation(order, userDoc.email, userDoc.name).catch(() => {});
    }

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || 'Payment verification failed';
    return res.status(status).json({ success: false, message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment
};
