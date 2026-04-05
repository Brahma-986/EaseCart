const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const {
  ensureNotLocked,
  recordFailedAttempt,
  clearOnSuccess,
} = require('../utils/loginThrottle');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer' // Default to customer
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  try {
    const lockCheck = await ensureNotLocked(email);
    if (!lockCheck.ok) {
      return res.status(429).json({
        success: false,
        message: `Too many failed login attempts. Please try again after ${lockCheck.lockedUntil.toLocaleString()}.`,
        lockedUntil: lockCheck.lockedUntil,
        code: 'LOGIN_LOCKED',
      });
    }
    const { normalizedEmail } = lockCheck;

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      const r = await recordFailedAttempt(normalizedEmail);
      if (r.locked) {
        return res.status(429).json({
          success: false,
          message: `Too many failed login attempts. Please try again after ${r.lockedUntil.toLocaleString()}.`,
          lockedUntil: r.lockedUntil,
          code: 'LOGIN_LOCKED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        attemptsRemaining: r.attemptsRemaining,
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const r = await recordFailedAttempt(normalizedEmail);
      if (r.locked) {
        return res.status(429).json({
          success: false,
          message: `Too many failed login attempts. Please try again after ${r.lockedUntil.toLocaleString()}.`,
          lockedUntil: r.lockedUntil,
          code: 'LOGIN_LOCKED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        attemptsRemaining: r.attemptsRemaining,
      });
    }

    await clearOnSuccess(normalizedEmail);

    const token = generateToken(user._id);

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, address, phone } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    user.name = name || user.name;
    if (address) user.address = { ...user.address, ...address };
    user.phone = phone || user.phone;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
