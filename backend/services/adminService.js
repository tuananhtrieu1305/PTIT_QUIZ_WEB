const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');
const Result = require('../models/Result');

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createExam = async (payload, userId) => {
  const { title, examType, totalQuestions } = payload;

  if (!title || !examType || !totalQuestions) {
    throw createServiceError('Title, exam type, and total questions are required', 400);
  }

  const exam = new Exam({
    ...payload,
    createdBy: userId
  });

  await exam.save();
  return exam;
};

const updateExam = async (examId, payload, user) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw createServiceError('Exam not found', 404);
  }

  if (exam.createdBy.toString() !== user.id && user.role !== 'admin') {
    throw createServiceError('Access denied', 403);
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      exam[key] = value;
    }
  });

  await exam.save();
  return exam;
};

const deleteExam = async (examId, user) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw createServiceError('Exam not found', 404);
  }

  if (exam.createdBy.toString() !== user.id && user.role !== 'admin') {
    throw createServiceError('Access denied', 403);
  }

  await Question.deleteMany({ exam: examId });
  await Result.deleteMany({ exam: examId });
  await Exam.findByIdAndDelete(examId);
};

const getAllExamsAdmin = async () => {
  return Exam.find().populate('createdBy', 'fullName email');
};

const addQuestion = async (examId, payload) => {
  const { questionText, questionType, options, correctAnswer, explanation, points, order } = payload;

  if (!questionText || !correctAnswer) {
    throw createServiceError('Question text and correct answer are required', 400);
  }

  const exam = await Exam.findById(examId);
  if (!exam) {
    throw createServiceError('Exam not found', 404);
  }

  const question = new Question({
    exam: examId,
    questionText,
    questionType,
    options,
    correctAnswer,
    explanation,
    points: points || 1,
    order: order || 1
  });

  await question.save();
  return question;
};

const updateQuestion = async (questionId, payload) => {
  const question = await Question.findByIdAndUpdate(questionId, payload, { new: true });

  if (!question) {
    throw createServiceError('Question not found', 404);
  }

  return question;
};

const deleteQuestion = async (questionId) => {
  const question = await Question.findByIdAndDelete(questionId);

  if (!question) {
    throw createServiceError('Question not found', 404);
  }
};

const getAllUsers = async (query) => {
  const { role, search } = query;
  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: 'i' } },
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  return User.find(filter).select('-password');
};

const createUser = async (payload) => {
  const { username, email, password, fullName, role, studentId } = payload;

  if (!username || !email || !password || !fullName) {
    throw createServiceError('All fields are required', 400);
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw createServiceError('Username or Email already exists', 400);
  }

  const user = new User({
    username,
    email,
    password,
    fullName,
    role: role || 'student',
    studentId: role === 'student' ? studentId : undefined
  });

  await user.save();
  return user.toJSON();
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw createServiceError('User not found', 404);
  }

  await Result.deleteMany({ student: userId });
};

const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments({ role: 'student' });
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const totalExams = await Exam.countDocuments();
  const totalResults = await Result.countDocuments();

  const resultsByExam = await Result.aggregate([
    {
      $group: {
        _id: '$exam',
        totalSubmissions: { $sum: 1 },
        averageScore: { $avg: '$scorePercentage' },
        passCount: {
          $sum: { $cond: ['$isPass', 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: 'exams',
        localField: '_id',
        foreignField: '_id',
        as: 'examData'
      }
    }
  ]);

  return {
    summary: {
      totalUsers,
      totalAdmins,
      totalExams,
      totalResults
    },
    resultsByExam
  };
};

const getStudentExamDetail = async (studentId) => {
  const student = await User.findById(studentId).select('-password');
  if (!student) {
    throw createServiceError('Student not found', 404);
  }

  const results = await Result.find({ student: studentId })
    .populate('exam', 'title examType duration passingScore')
    .sort({ createdAt: -1 });

  return { student, results };
};

const getExamStatistics = async (examId) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw createServiceError('Exam not found', 404);
  }

  const results = await Result.find({ exam: examId }).populate('student', 'fullName studentId email');

  return {
    exam,
    totalSubmissions: results.length,
    passCount: results.filter(r => r.isPass).length,
    failCount: results.filter(r => !r.isPass).length,
    averageScore: results.length > 0 ? results.reduce((sum, r) => sum + r.scorePercentage, 0) / results.length : 0,
    highestScore: results.length > 0 ? Math.max(...results.map(r => r.scorePercentage)) : 0,
    lowestScore: results.length > 0 ? Math.min(...results.map(r => r.scorePercentage)) : 0,
    passRate: results.length > 0 ? (results.filter(r => r.isPass).length / results.length) * 100 : 0,
    results
  };
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
