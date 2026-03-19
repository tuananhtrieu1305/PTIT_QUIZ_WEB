const express = require('express');
const { 
  getAllExams, 
  getExamById, 
  getExamQuestions, 
  submitExam, 
  getStudentResult,
  getStudentResults 
} = require('../controllers/examController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getAllExams);
router.get('/:id', auth, getExamById);
router.get('/:id/questions', auth, getExamQuestions);
router.post('/submit', auth, submitExam);
router.get('/result/:resultId', auth, getStudentResult);
router.get('/results/my-results', auth, getStudentResults);

module.exports = router;
