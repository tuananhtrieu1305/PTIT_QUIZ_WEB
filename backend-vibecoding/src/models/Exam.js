const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    examType: {
      type: String,
      enum: ['practice', 'midterm', 'final', 'quiz'],
      default: 'practice'
    },
    accessType: {
      type: String,
      enum: ['public', 'scheduled', 'enrolled'],
      default: 'public'
    },
    startTime: {
      type: Date,
      required: function() {
        return this.accessType === 'scheduled';
      }
    },
    endTime: {
      type: Date,
      required: function() {
        return this.accessType === 'scheduled';
      }
    },
    duration: {
      type: Number,
      required: true,
      default: 60
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    passingScore: {
      type: Number,
      required: true,
      default: 50
    },
    questionsPerPage: {
      type: Number,
      default: 1
    },
    showResults: {
      type: Boolean,
      default: true
    },
    showAnswers: {
      type: Boolean,
      default: false
    },
    allowReview: {
      type: Boolean,
      default: true
    },
    randomizeQuestions: {
      type: Boolean,
      default: false
    },
    randomizeOptions: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  { 
    collection: 'exams',
    timestamps: true
  }
);

module.exports = mongoose.model('Exam', examSchema);
