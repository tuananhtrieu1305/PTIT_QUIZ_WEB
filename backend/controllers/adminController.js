const adminService = require('../services/adminService');
const { sendSuccess, sendError } = require('../utils/response');

const createExam = async (req, res) => {
  try {
    const exam = await adminService.createExam(req.body, req.user.id);
    sendSuccess(res, exam, 'Exam created successfully', 201);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await adminService.updateExam(req.params.id, req.body, req.user);
    sendSuccess(res, exam, 'Exam updated successfully');
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const deleteExam = async (req, res) => {
  try {
    await adminService.deleteExam(req.params.id, req.user);

    sendSuccess(res, null, 'Exam deleted successfully');
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const getAllExamsAdmin = async (req, res) => {
  try {
    const exams = await adminService.getAllExamsAdmin();
    sendSuccess(res, exams);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const addQuestion = async (req, res) => {
  try {
    const question = await adminService.addQuestion(req.params.examId, req.body);
    sendSuccess(res, question, 'Question added successfully', 201);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await adminService.updateQuestion(req.params.questionId, req.body);

    sendSuccess(res, question, 'Question updated successfully');
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const deleteQuestion = async (req, res) => {
  try {
    await adminService.deleteQuestion(req.params.questionId);

    sendSuccess(res, null, 'Question deleted successfully');
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers(req.query);
    sendSuccess(res, users);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await adminService.createUser(req.body);
    sendSuccess(res, user, 'User created successfully', 201);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.userId);

    sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, stats);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const getStudentExamDetail = async (req, res) => {
  try {
    const data = await adminService.getStudentExamDetail(req.params.studentId);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const getExamStatistics = async (req, res) => {
  try {
    const stats = await adminService.getExamStatistics(req.params.examId);
    sendSuccess(res, stats);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

module.exports = {
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
};
