const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  farmProfile: {
    farmName: String,
    location: String,
    farmSize: String,
    primaryCrops: [String], 
  },
  experience: {
    level:String,
    seasonStart:String, 
  },
  notifications: {
    activityReminders: {
        type: Boolean,
        default: true,
    },
    aiInsights: {
        type: Boolean,
        default: true,
    },
    weatherAlerts: {
        type: Boolean, 
        default: true,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;