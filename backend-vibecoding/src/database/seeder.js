const mongoose = require('mongoose');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Exam.deleteMany({});
    await Question.deleteMany({});
    await Result.deleteMany({});

    console.log('Cleared existing data');

    const admin = new User({
      username: 'admin',
      email: 'admin@ptit-vibecoding.edu.vn',
      password: 'admin123',
      fullName: 'Admin Vibecoding',
      role: 'admin'
    });
    await admin.save();

    const instructor = new User({
      username: 'instructor1',
      email: 'instructor1@ptit.edu.vn',
      password: 'instructor123',
      fullName: 'Instructor One',
      role: 'instructor'
    });
    await instructor.save();

    console.log('Admin & Instructor created');

    const students = [];
    const studentData = [
      { username: 'student1', email: 'student1@ptit.edu.vn', fullName: 'Nguyễn Văn A', studentId: 'B20DCCN001' },
      { username: 'student2', email: 'student2@ptit.edu.vn', fullName: 'Trần Thị B', studentId: 'B20DCCN002' },
      { username: 'student3', email: 'student3@ptit.edu.vn', fullName: 'Lê Văn C', studentId: 'B20DCCN003' },
      { username: 'student4', email: 'student4@ptit.edu.vn', fullName: 'Phạm Thị D', studentId: 'B20DCCN004' },
      { username: 'student5', email: 'student5@ptit.edu.vn', fullName: 'Hoàng Văn E', studentId: 'B20DCCN005' }
    ];

    for (const data of studentData) {
      const student = new User({
        ...data,
        password: 'student123',
        role: 'student'
      });
      const savedStudent = await student.save();
      students.push(savedStudent);
    }

    console.log('Student users created');

    const now = new Date();

    const quickQuizExam = new Exam({
      title: 'Quick Quiz - JavaScript Basics',
      description: 'Test your knowledge on JavaScript fundamentals',
      examType: 'quiz',
      accessType: 'public',
      duration: 30,
      totalQuestions: 5,
      passingScore: 60,
      showResults: true,
      showAnswers: true,
      randomizeQuestions: true,
      createdBy: instructor._id
    });
    await quickQuizExam.save();

    const practiceExam = new Exam({
      title: 'Practice Exam - Web Development',
      description: 'Comprehensive practice test for web development',
      examType: 'practice',
      accessType: 'public',
      duration: 60,
      totalQuestions: 10,
      passingScore: 50,
      showResults: true,
      showAnswers: true,
      randomizeQuestions: false,
      createdBy: instructor._id
    });
    await practiceExam.save();

    const midtermExam = new Exam({
      title: 'Midterm - Full Stack Development',
      description: 'Midterm examination',
      examType: 'midterm',
      accessType: 'scheduled',
      startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      duration: 90,
      totalQuestions: 15,
      passingScore: 60,
      showResults: true,
      showAnswers: false,
      randomizeQuestions: true,
      createdBy: instructor._id
    });
    await midtermExam.save();

    console.log('Exams created');

    const questions = [
      {
        exam: quickQuizExam._id,
        questionText: 'What is JavaScript?',
        questionType: 'multiple-choice',
        options: [
          { id: 'A', text: 'A programming language', isCorrect: true },
          { id: 'B', text: 'A markup language', isCorrect: false },
          { id: 'C', text: 'A styling language', isCorrect: false }
        ],
        correctAnswer: 'A',
        explanation: 'JavaScript is a programming language used for web development',
        points: 1,
        difficulty: 'easy',
        order: 1
      },
      {
        exam: quickQuizExam._id,
        questionText: 'Is JavaScript statically typed?',
        questionType: 'true-false',
        options: [
          { id: 'true', text: 'True', isCorrect: false },
          { id: 'false', text: 'False', isCorrect: true }
        ],
        correctAnswer: 'false',
        explanation: 'JavaScript is dynamically typed',
        points: 1,
        difficulty: 'medium',
        order: 2
      }
    ];

    for (const questionData of questions) {
      const question = new Question(questionData);
      await question.save();
    }

    console.log('Questions created');

    for (let i = 0; i < 3; i++) {
      const result = new Result({
        exam: quickQuizExam._id,
        student: students[i]._id,
        answers: [
          {
            question: questions[0]._id,
            selectedAnswer: 'A',
            isCorrect: true,
            points: 1
          },
          {
            question: questions[1]._id,
            selectedAnswer: 'false',
            isCorrect: true,
            points: 1
          }
        ],
        totalPoints: 2,
        maxPoints: 2,
        scorePercentage: 100,
        isPass: true,
        status: 'submitted',
        submitTime: new Date()
      });
      await result.save();
    }

    console.log('Sample results created');
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
