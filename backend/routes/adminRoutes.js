const express = require('express');
const {
  createExam,
  updateExam,
  deleteExam,
  getAllExamsAdmin,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getAllUsers,
  createUser,
  deleteUser,
  getDashboardStats,
  getStudentExamDetail,
  getExamStatistics
} = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.use(auth, adminAuth);

router.get('/dashboard/stats', getDashboardStats);

router.get('/exams', getAllExamsAdmin);
router.post('/exams', createExam);
router.put('/exams/:id', updateExam);
router.delete('/exams/:id', deleteExam);
router.get('/exams/:examId/statistics', getExamStatistics);

router.post('/exams/:examId/questions', addQuestion);
router.put('/questions/:questionId', updateQuestion);
router.delete('/questions/:questionId', deleteQuestion);

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.delete('/users/:userId', deleteUser);
router.get('/users/:studentId/details', getStudentExamDetail);

module.exports = router;
