const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureExamAccessible = (exam) => {
  const now = new Date();
  if (exam.accessType === 'scheduled') {
    if (now < exam.startTime || now > exam.endTime) {
      throw createServiceError('Exam is not available at this time', 403);
    }
  }
};

const getAllExams = async (query) => {
  const { search, status } = query;
  const filter = { isPublished: true };

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  if (status) {
    filter.accessType = status;
  }

  return Exam.find(filter).populate('createdBy', 'fullName');
};

const getExamById = async (examId) => {
  const exam = await Exam.findById(examId).populate('createdBy', 'fullName');

  if (!exam) {
    throw createServiceError('Exam not found', 404);
  }

  ensureExamAccessible(exam);

  const questions = await Question.find({ exam: exam._id }).select('-correctAnswer');

  return { exam, questions };
};

const getExamQuestions = async (examId) => {
  const exam = await Exam.findById(examId);

  if (!exam) {
    throw createServiceError('Exam not found', 404);
  }

  ensureExamAccessible(exam);

  let questions = await Question.find({ exam: exam._id })
    .select('-correctAnswer')
    .sort({ order: 1 });

  if (exam.randomizeQuestions) {
    questions = questions.sort(() => Math.random() - 0.5);
  }

  return { exam, questions };
};

const submitExam = async (payload, studentId) => {
  const { examId, answers } = payload;

  if (!examId || !answers) {
    throw createServiceError('Exam ID and answers are required', 400);
  }

  const exam = await Exam.findById(examId);
  if (!exam) {
    throw createServiceError('Exam not found', 404);
  }

  const questions = await Question.find({ exam: examId });

  let totalPoints = 0;
  let maxPoints = 0;
  const resultAnswers = [];

  for (const question of questions) {
    maxPoints += question.points;
    const studentAnswer = answers.find(a => a.questionId === question._id.toString());

    if (studentAnswer && studentAnswer.selectedAnswer === question.correctAnswer) {
      totalPoints += question.points;
      resultAnswers.push({
        question: question._id,
        selectedAnswer: studentAnswer.selectedAnswer,
        isCorrect: true,
        points: question.points
      });
    } else {
      resultAnswers.push({
        question: question._id,
        selectedAnswer: studentAnswer?.selectedAnswer || null,
        isCorrect: false,
        points: 0
      });
    }
  }

  const scorePercentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
  const isPass = scorePercentage >= exam.passingScore;

  const result = new Result({
    exam: examId,
    student: studentId,
    answers: resultAnswers,
    totalPoints,
    maxPoints,
    scorePercentage,
    isPass,
    status: 'submitted',
    startTime: new Date(),
    submitTime: new Date()
  });

  await result.save();

  return {
    result,
    score: {
      totalPoints,
      maxPoints,
      percentage: Math.round(scorePercentage * 100) / 100,
      passed: isPass
    }
  };
};

const getStudentResult = async (resultId, studentId, userRole) => {
  const result = await Result.findById(resultId)
    .populate('exam')
    .populate({
      path: 'answers.question',
      model: 'Question'
    })
    .populate('student', 'fullName studentId');

  if (!result) {
    throw createServiceError('Result not found', 404);
  }

  if (result.student._id.toString() !== studentId && userRole !== 'admin') {
    throw createServiceError('Access denied', 403);
  }

  if (result.exam.showAnswers || userRole === 'admin') {
    for (let i = 0; i < result.answers.length; i++) {
      const question = await Question.findById(result.answers[i].question._id);
      result.answers[i].correctAnswer = question.correctAnswer;
      result.answers[i].explanation = question.explanation;
    }
  }

  return result;
};

const getStudentResults = async (studentId) => {
  return Result.find({ student: studentId })
    .populate('exam', 'title examType duration')
    .sort({ createdAt: -1 });
};

module.exports = {
  getAllExams,
  getExamById,
  getExamQuestions,
  submitExam,
  getStudentResult,
  getStudentResults
};
