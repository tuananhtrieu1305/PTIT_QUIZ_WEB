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
    isPass: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['started', 'submitted', 'graded'],
      default: 'started'
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    submitTime: {
      type: Date,
      default: null
    },
    timeTaken: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 1
    }
  },
  { 
    collection: 'results',
    timestamps: true
  }
);

module.exports = mongoose.model('Result', resultSchema);
