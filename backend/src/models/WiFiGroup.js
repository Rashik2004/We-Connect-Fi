const mongoose = require('mongoose');

const wifiGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subnet: {
    type: String,
    required: true,
    unique: true
  },
  ssid: {
    type: String,
    default: 'Unknown Network'
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  activeMembers: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    location: String,
    building: String,
    floor: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
wifiGroupSchema.index({ subnet: 1 });
wifiGroupSchema.index({ isActive: 1, lastActivity: -1 });

// Update active members count
wifiGroupSchema.methods.updateActiveMemberCount = function() {
  this.activeMembers = this.members.filter(m => m.isActive).length;
  return this.save();
};

module.exports = mongoose.model('WiFiGroup', wifiGroupSchema);
