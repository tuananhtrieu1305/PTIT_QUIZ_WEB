const examService = require('../services/examService');
const { sendSuccess, sendError } = require('../utils/response');

const getAllExams = async (req, res) => {
  try {
    const exams = await examService.getAllExams(req.query);
    sendSuccess(res, exams);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const getExamById = async (req, res) => {
  try {
    const examData = await examService.getExamById(req.params.id);
    sendSuccess(res, examData);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const getExamQuestions = async (req, res) => {
  try {
    const examData = await examService.getExamQuestions(req.params.id);
    sendSuccess(res, examData);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const submitExam = async (req, res) => {
  try {
    const submitData = await examService.submitExam(req.body, req.user.id);

    sendSuccess(
      res,
      submitData,
      'Exam submitted successfully',
      201
    );
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const getStudentResult = async (req, res) => {
  try {
    const result = await examService.getStudentResult(req.params.resultId, req.user.id, req.user.role);
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const getStudentResults = async (req, res) => {
  try {
    const results = await examService.getStudentResults(req.user.id);

    sendSuccess(res, results);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

module.exports = {
  getAllExams,
  getExamById,
  getExamQuestions,
  submitExam,
  getStudentResult,
  getStudentResults
};
