const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    enum: ['all', 'customer', 'manager', 'admin'],
    default: 'all'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: Date,
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
announcementSchema.index({ targetRole: 1, isActive: 1, createdAt: -1 });
announcementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-expiry

// Virtual for isExpired
announcementSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Method to mark as read by user
announcementSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(read => read.user.toString() === userId.toString());
  if (!existingRead) {
    this.readBy.push({ user: userId });
  }
  return this.save();
};

// Static method to get active announcements for user
announcementSchema.statics.getActiveForUser = function(userRole) {
  const now = new Date();
  const query = {
    isActive: true,
    $or: [
      { targetRole: 'all' },
      { targetRole: userRole }
    ]
  };

  if (this.expiresAt) {
    query.$or.push({ expiresAt: { $gt: now } });
  }

  return this.find(query).sort({ priority: -1, createdAt: -1 });
};

// Ensure virtual fields are serialized
announcementSchema.set('toJSON', { virtuals: true });
announcementSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Announcement', announcementSchema);
