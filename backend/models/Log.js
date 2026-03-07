const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    index: true,
  },
  activityType: {
    type: String,
    required: true,
    enum: ['planting', 'watering', 'fertilizing', 'weeding', 'spraying', 'harvest'],
  },
  crop: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  cost: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;