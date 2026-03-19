const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
      default: 'multiple-choice'
    },
    options: {
      type: [{
        id: String,
        text: String,
        isCorrect: Boolean
      }],
      default: []
    },
    correctAnswer: {
      type: String,
      required: true
    },
    explanation: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: null
    },
    points: {
      type: Number,
      default: 1
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    order: {
      type: Number,
      default: 1
    },
    tags: [String]
  },
  { 
    collection: 'questions',
    timestamps: true
  }
);

module.exports = mongoose.model('Question', questionSchema);
