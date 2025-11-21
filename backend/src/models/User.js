const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required if not using Google OAuth
    }
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    maxlength: 100,
    default: ''
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  currentNetwork: {
    subnet: String,
    ssid: String,
    ipAddress: String,
    lastConnected: Date
  },
  deviceInfo: {
    type: {
      type: String,
      enum: ['laptop', 'phone', 'tablet', 'desktop'],
      default: 'laptop'
    },
    userAgent: String
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  networkHistory: [{
    subnet: String,
    ssid: String,
    connectedAt: Date,
    disconnectedAt: Date
  }],
  privacySettings: {
    showOnlineStatus: {
      type: Boolean,
      default: true
    },
    allowFriendRequests: {
      type: Boolean,
      default: true
    },
    visibleOnNetwork: {
      type: Boolean,
      default: true
    }
  },
  notificationSettings: {
    popup: {
      type: Boolean,
      default: true
    },
    sound: {
      type: Boolean,
      default: true
    },
    silent: {
      type: Boolean,
      default: false
    }
  },
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.googleId;
  return user;
};

module.exports = mongoose.model('User', userSchema);
