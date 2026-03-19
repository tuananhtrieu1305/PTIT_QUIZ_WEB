const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    examType: {
      type: String,
      enum: ['practice', 'midterm', 'final', 'other'],
      default: 'practice'
    },
    accessType: {
      type: String,
      enum: ['free', 'scheduled', 'restricted'],
      default: 'free'
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
      default: 60 // duration in minutes
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    passingScore: {
      type: Number,
      required: true,
      default: 50 // percentage
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
      default: true
    },
    randomizeQuestions: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'exams' }
);

module.exports = mongoose.model('Exam', examSchema);
