const express = require('express');
const adminService = require('../services/adminService');
const { sendSuccess, sendError } = require('../utils/response');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole('admin', 'instructor'));

router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, stats, 'Dashboard statistics retrieved');
  } catch (error) {
    sendError(res, error.message, 500, 'STATS_FETCH_FAILED');
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await adminService.getAllUsers(req.query);
    sendSuccess(res, users, 'Users retrieved successfully');
  } catch (error) {
    sendError(res, error.message, 500, 'FETCH_USERS_FAILED');
  }
});

router.get('/exams', async (req, res) => {
  try {
    const exams = await Exam.find().populate('createdBy', 'fullName email');
    sendSuccess(res, exams, 'Exams retrieved successfully');
  } catch (error) {
    sendError(res, error.message, 500, 'FETCH_EXAMS_FAILED');
  }
});

router.post('/exams', async (req, res) => {
  try {
    const exam = await adminService.createExam(req.body, req.user.id);
    sendSuccess(res, exam, 'Exam created successfully', 201);
  } catch (error) {
    sendError(res, error.message, 400, 'CREATE_EXAM_FAILED');
  }
});

router.put('/exams/:id', async (req, res) => {
  try {
    const exam = await adminService.updateExam(req.params.id, req.body, req.user.id);
    sendSuccess(res, exam, 'Exam updated successfully');
  } catch (error) {
    sendError(res, error.message, 400, 'UPDATE_EXAM_FAILED');
  }
});

router.delete('/exams/:id', async (req, res) => {
  try {
    await adminService.deleteExam(req.params.id, req.user.id);
    sendSuccess(res, null, 'Exam deleted successfully');
  } catch (error) {
    sendError(res, error.message, 400, 'DELETE_EXAM_FAILED');
  }
});

router.post('/exams/:examId/questions', async (req, res) => {
  try {
    const question = await adminService.addQuestion(req.params.examId, req.body);
    sendSuccess(res, question, 'Question added successfully', 201);
  } catch (error) {
    sendError(res, error.message, 400, 'ADD_QUESTION_FAILED');
  }
});

router.get('/exams/:examId/statistics', async (req, res) => {
  try {
    const stats = await adminService.getExamStatistics(req.params.examId);
    sendSuccess(res, stats, 'Exam statistics retrieved');
  } catch (error) {
    sendError(res, error.message, 404, 'STATS_NOT_FOUND');
  }
});

module.exports = router;
