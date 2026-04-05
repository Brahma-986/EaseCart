const mongoose = require('mongoose');

const loginThrottleSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true
    },
    attempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoginThrottle', loginThrottleSchema);
