const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question'
        },
        selectedAnswer: String,
        isCorrect: Boolean,
        points: Number
      }
    ],
    totalPoints: {
      type: Number,
      default: 0
    },
    maxPoints: {
      type: Number,
      default: 0
    },
    scorePercentage: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['started', 'submitted', 'graded'],
      default: 'submitted'
    },
    isPass: {
      type: Boolean,
      default: false
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    submitTime: {
      type: Date,
      default: Date.now
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0
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
  { collection: 'results' }
);

module.exports = mongoose.model('Result', resultSchema);
