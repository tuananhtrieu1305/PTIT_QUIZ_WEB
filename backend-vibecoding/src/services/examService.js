const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');

class ExamService {
  async getAllExams(filters = {}) {
    const query = { isActive: true };
    
    if (filters.search) {
      query.title = { $regex: filters.search, $options: 'i' };
    }

    if (filters.examType) {
      query.examType = filters.examType;
    }

    if (filters.accessType) {
      query.accessType = filters.accessType;
    }

    const exams = await Exam.find(query)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    return exams;
  }

  async getExamById(examId) {
    const exam = await Exam.findById(examId).populate('createdBy', 'fullName email');

    if (!exam || !exam.isActive) {
      throw new Error('Exam not found');
    }

    this.checkExamAccessibility(exam);

    const questions = await Question.find({ exam: examId }).select('-correctAnswer');

    return { exam, questions };
  }

  async submitExam(examId, studentId, answers) {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    this.checkExamAccessibility(exam);

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
  }

  async getStudentResult(resultId, studentId) {
    const result = await Result.findById(resultId)
      .populate('exam')
      .populate('student', 'fullName studentId');

    if (!result) {
      throw new Error('Result not found');
    }

    if (result.student._id.toString() !== studentId) {
      throw new Error('Access denied');
    }

    return result;
  }

  async getStudentResults(studentId) {
    const results = await Result.find({ student: studentId })
      .populate('exam', 'title examType duration')
      .sort({ createdAt: -1 });

    return results;
  }

  checkExamAccessibility(exam) {
    if (exam.accessType === 'scheduled') {
      const now = new Date();
      if (now < exam.startTime || now > exam.endTime) {
        throw new Error('Exam is not available at this time');
      }
    }
  }
}

module.exports = new ExamService();
