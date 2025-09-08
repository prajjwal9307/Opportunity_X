
const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Online', 'Offline'],
    default: 'Online'
  },
  theme: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: [String],
  },
  venue: {
    type: String,
    required: function () { return this.type === 'Offline'; }, // Conditional required
    trim: true
  },
  group_member: {
    min_member: {
      type: Number,
      default: 1
    },
    max_member: {
      type: Number,
      default: 5
    },
  },

  regiterteam: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hackathon', hackathonSchema);