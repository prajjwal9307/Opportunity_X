const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for individual rounds
const roundSchema = new Schema({
  roundType: {
    type: String,
    enum: ['Online Assessment', 'Technical', 'HR','Coding Test', 'System Design'],
    required: true
  },
  duration: {
    type: String  // e.g., "45 minutes"
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    }
  }],
  experience: {
    type: String,
    optional: true
  }
});

// Main Interview Experience schema
const interviewExperienceSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Internship', 'Contract', 'Part-time'],
    required: true
  },
  interviewDate: {
    type: Date
  },
  
  rounds: [roundSchema],
  overallAdvice: {
    type: String,
    optional: true
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


// Update the updatedAt field on save
interviewExperienceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});



const InterviewExperience = mongoose.model('InterviewExperience', interviewExperienceSchema);

module.exports = InterviewExperience;