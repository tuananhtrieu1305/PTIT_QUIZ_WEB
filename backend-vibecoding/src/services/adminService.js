const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');

class AdminService {
  async createExam(examData, creatorId) {
    const { title, description, examType, accessType, startTime, endTime, duration, totalQuestions, passingScore } = examData;

    if (!title || !examType || !totalQuestions) {
      throw new Error('Title, exam type, and total questions are required');
    }

    const exam = new Exam({
      ...examData,
      createdBy: creatorId
    });

    await exam.save();
    return exam;
  }

  async updateExam(examId, examData, userId) {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    if (exam.createdBy.toString() !== userId && exam.createdBy.role !== 'admin') {
      throw new Error('Access denied');
    }

    Object.assign(exam, examData);
    await exam.save();
    return exam;
  }

  async deleteExam(examId, userId) {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    if (exam.createdBy.toString() !== userId && exam.createdBy.role !== 'admin') {
      throw new Error('Access denied');
    }

    await Question.deleteMany({ exam: examId });
    await Result.deleteMany({ exam: examId });
    await Exam.findByIdAndDelete(examId);
  }

  async addQuestion(examId, questionData) {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    const question = new Question({
      exam: examId,
      ...questionData,
      points: questionData.points || 1,
      order: questionData.order || 1
    });

    await question.save();
    return question;
  }

  async getDashboardStats() {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalExams = await Exam.countDocuments({ isActive: true });
    const totalResults = await Result.countDocuments();

    const resultsByExam = await Result.aggregate([
      {
        $group: {
          _id: '$exam',
          totalSubmissions: { $sum: 1 },
          averageScore: { $avg: '$scorePercentage' },
          passCount: { $sum: { $cond: ['$isPass', 1, 0] } }
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
        totalStudents,
        totalInstructors,
        totalExams,
        totalResults
      },
      resultsByExam
    };
  }

  async getAllUsers(filters = {}) {
    const query = {};

    if (filters.role) {
      query.role = filters.role;
    }

    if (filters.search) {
      query.$or = [
        { username: { $regex: filters.search, $options: 'i' } },
        { fullName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    return users;
  }

  async getExamStatistics(examId) {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    const results = await Result.find({ exam: examId }).populate('student', 'fullName studentId email');

    const stats = {
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

    return stats;
  }
}

module.exports = new AdminService();
