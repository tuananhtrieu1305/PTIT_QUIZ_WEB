const express = require('express');
const examService = require('../services/examService');
const { sendSuccess, sendError } = require('../utils/response');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const exams = await examService.getAllExams(req.query);
    sendSuccess(res, exams, 'Exams retrieved successfully');
  } catch (error) {
    sendError(res, error.message, 500, 'FETCH_EXAMS_FAILED');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const examData = await examService.getExamById(req.params.id);
    sendSuccess(res, examData, 'Exam retrieved successfully');
  } catch (error) {
    sendError(res, error.message, 404, 'EXAM_NOT_FOUND');
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { examId, answers } = req.body;
    if (!examId || !answers) {
      return sendError(res, 'Exam ID and answers are required', 400, 'INVALID_REQUEST');
    }

    const result = await examService.submitExam(examId, req.user.id, answers);
    sendSuccess(res, result, 'Exam submitted successfully', 201);
  } catch (error) {
    sendError(res, error.message, 400, 'SUBMIT_FAILED');
  }
});

router.get('/result/:resultId', async (req, res) => {
  try {
    const result = await examService.getStudentResult(req.params.resultId, req.user.id);
    sendSuccess(res, result, 'Result retrieved successfully');
  } catch (error) {
    sendError(res, error.message, 404, 'RESULT_NOT_FOUND');
  }
});

router.get('/my/results', async (req, res) => {
  try {
    const results = await examService.getStudentResults(req.user.id);
    sendSuccess(res, results, 'Student results retrieved successfully');
  } catch (error) {
    sendError(res, error.message, 500, 'FETCH_RESULTS_FAILED');
  }
});

module.exports = router;
