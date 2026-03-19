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
      email: 'admin@ptit.edu.vn',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');

    const students = [];
    const studentData = [
      { username: 'student1', email: 'student1@ptit.edu.vn', fullName: 'Nguyễn Văn An', studentId: 'B20DCCN001' },
      { username: 'student2', email: 'student2@ptit.edu.vn', fullName: 'Trần Thị Bình', studentId: 'B20DCCN002' },
      { username: 'student3', email: 'student3@ptit.edu.vn', fullName: 'Lê Minh Chính', studentId: 'B20DCCN003' },
      { username: 'student4', email: 'student4@ptit.edu.vn', fullName: 'Phạm Thị Dung', studentId: 'B20DCCN004' },
      { username: 'student5', email: 'student5@ptit.edu.vn', fullName: 'Hoàng Văn Dũng', studentId: 'B20DCCN005' }
    ];

    for (const data of studentData) {
      const student = new User({
        username: data.username,
        email: data.email,
        password: 'student123',
        fullName: data.fullName,
        studentId: data.studentId,
        role: 'student'
      });
      const savedStudent = await student.save();
      students.push(savedStudent);
    }
    console.log('Student users created');

    const now = new Date();
    const exams = [];

    const practiceExam = new Exam({
      title: 'Bài Tập Luyện Tập - Lập Trình Web',
      description: 'Đây là bài tập luyện tập để giúp bạn nắm vững kiến thức về HTML, CSS, JavaScript',
      examType: 'practice',
      accessType: 'free',
      duration: 60,
      totalQuestions: 10,
      passingScore: 50,
      showResults: true,
      showAnswers: true,
      randomizeQuestions: false,
      createdBy: admin._id
    });
    const savedPracticeExam = await practiceExam.save();
    exams.push(savedPracticeExam);
    console.log('Practice exam created');

    const midtermExam = new Exam({
      title: 'Kiểm Tra Giữa Kỳ - Web Development',
      description: 'Bài kiểm tra giữa kỳ môn Phát Triển Ứng Dụng Web',
      examType: 'midterm',
      accessType: 'scheduled',
      startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: 90,
      totalQuestions: 15,
      passingScore: 60,
      showResults: true,
      showAnswers: false,
      randomizeQuestions: true,
      createdBy: admin._id
    });
    const savedMidtermExam = await midtermExam.save();
    exams.push(savedMidtermExam);
    console.log('Midterm exam created');

    const finalExam = new Exam({
      title: 'Kỳ Thi Cuối Kỳ - Web Development',
      description: 'Bài kiểm tra cuối kỳ môn Phát Triển Ứng Dụng Web',
      examType: 'final',
      accessType: 'scheduled',
      startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      endTime: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      duration: 120,
      totalQuestions: 20,
      passingScore: 70,
      showResults: true,
      showAnswers: false,
      randomizeQuestions: true,
      createdBy: admin._id
    });
    const savedFinalExam = await finalExam.save();
    exams.push(savedFinalExam);
    console.log('Final exam created');

    const practiceQuestions = [
      {
        questionText: 'HTML là viết tắt của?',
        questionType: 'multiple-choice',
        options: [
          { id: 'A', text: 'Hyper Text Markup Language', isCorrect: true },
          { id: 'B', text: 'High Tech Modern Language', isCorrect: false },
          { id: 'C', text: 'Home Tool Markup Language', isCorrect: false },
          { id: 'D', text: 'Hyper Tool Markup Language', isCorrect: false }
        ],
        correctAnswer: 'A',
        explanation: 'HTML là viết tắt của Hyper Text Markup Language - ngôn ngữ đánh dấu siêu văn bản',
        points: 1,
        order: 1
      },
      {
        questionText: 'CSS được sử dụng để làm gì?',
        questionType: 'multiple-choice',
        options: [
          { id: 'A', text: 'Xây dựng logic ứng dụng', isCorrect: false },
          { id: 'B', text: 'Định dạng và trang trí giao diện', isCorrect: true },
          { id: 'C', text: 'Lưu trữ dữ liệu', isCorrect: false },
          { id: 'D', text: 'Tạo cơ sở dữ liệu', isCorrect: false }
        ],
        correctAnswer: 'B',
        explanation: 'CSS (Cascading Style Sheets) được sử dụng để định dạng và trang trí giao diện web',
        points: 1,
        order: 2
      },
      {
        questionText: 'JavaScript là ngôn ngữ lập trình phía client',
        questionType: 'true-false',
        options: [
          { id: 'true', text: 'Đúng', isCorrect: true },
          { id: 'false', text: 'Sai', isCorrect: false }
        ],
        correctAnswer: 'true',
        explanation: 'JavaScript chạy trên trình duyệt của người dùng, nên nó là ngôn ngữ phía client',
        points: 1,
        order: 3
      },
      {
        questionText: 'Thẻ nào được sử dụng để tạo một linked list?',
        questionType: 'multiple-choice',
        options: [
          { id: 'A', text: '<ul> và <li>', isCorrect: true },
          { id: 'B', text: '<ol> và <li>', isCorrect: true },
          { id: 'C', text: '<list> và <element>', isCorrect: false },
          { id: 'D', text: '<table> và <tr>', isCorrect: false }
        ],
        correctAnswer: 'A',
        explanation: 'Thẻ <ul> (unordered list) và <li> (list item) được sử dụng để tạo danh sách không có thứ tự',
        points: 1,
        order: 4
      },
      {
        questionText: 'Lexcope trong JavaScript là gì?',
        questionType: 'multiple-choice',
        options: [
          { id: 'A', text: 'Phạm vi mà các biến có thể được truy cập', isCorrect: true },
          { id: 'B', text: 'Một loại biến đặc biệt', isCorrect: false },
          { id: 'C', text: 'Một hàm đặc biệt', isCorrect: false },
          { id: 'D', text: 'Một kiểu dữ liệu', isCorrect: false }
        ],
        correctAnswer: 'A',
        explanation: 'Lexical scope xác định phạm vi mà các biến có thể được truy cập dựa trên vị trí của chúng trong code',
        points: 1,
        order: 5
      },
      {
        questionText: 'Callback function là gì?',
        questionType: 'multiple-choice',
        options: [
          { id: 'A', text: 'Hàm được truyền vào hàm khác để được gọi sau một sự kiện', isCorrect: true },
          { id: 'B', text: 'Hàm trả về một giá trị', isCorrect: false },
          { id: 'C', text: 'Hàm không có tham số', isCorrect: false },
          { id: 'D', text: 'Hàm được gọi trực tiếp', isCorrect: false }
        ],
        correctAnswer: 'A',
        explanation: 'Callback function là một hàm được truyền vào hàm khác và được gọi bên trong hàm đó',
        points: 1,
        order: 6
      },
      {
        questionText: 'async/await là cách mới để làm việc với Promises',
        questionType: 'true-false',
        options: [
          { id: 'true', text: 'Đúng', isCorrect: true },
          { id: 'false', text: 'Sai', isCorrect: false }
        ],
        correctAnswer: 'true',
        explanation: 'async/await là một cách hiện đại hơn để làm việc với asynchronous code so với Promise.then()',
        points: 1,
        order: 7
      },
      {
        questionText: 'DOM là gì?',
        questionType: 'multiple-choice',
        options: [
          { id: 'A', text: 'Document Object Model - mô hình biểu diễn HTML dưới dạng cây đối tượng', isCorrect: true },
          { id: 'B', text: 'Data Organization Module', isCorrect: false },
          { id: 'C', text: 'Database Object Model', isCorrect: false },
          { id: 'D', text: 'Device Object Manager', isCorrect: false }
        ],
        correctAnswer: 'A',
        explanation: 'DOM (Document Object Model) là giao diện lập trình cho tài liệu HTML',
        points: 1,
        order: 8
      },
      {
        questionText: 'Sự khác biệt giữa let và var trong JavaScript',
        questionType: 'multiple-choice',
        options: [
          { id: 'A', text: 'let có block scope, var có function scope', isCorrect: true },
          { id: 'B', text: 'Không có sự khác biệt', isCorrect: false },
          { id: 'C', text: 'var nhanh hơn let', isCorrect: false },
          { id: 'D', text: 'let chỉ được dùng trong HTML', isCorrect: false }
        ],
        correctAnswer: 'A',
        explanation: 'let có phạm vi block (trong khối {}), còn var có phạm vi function',
        points: 1,
        order: 9
      },
      {
        questionText: 'Flexbox được sử dụng để tạo layout linh hoạt trong CSS',
        questionType: 'true-false',
        options: [
          { id: 'true', text: 'Đúng', isCorrect: true },
          { id: 'false', text: 'Sai', isCorrect: false }
        ],
        correctAnswer: 'true',
        explanation: 'Flexbox là công cụ mạnh mẽ trong CSS để tạo layout linh hoạt và responsive',
        points: 1,
        order: 10
      }
    ];

    for (const questionData of practiceQuestions) {
      const question = new Question({
        exam: savedPracticeExam._id,
        ...questionData
      });
      await question.save();
    }
    console.log('Practice exam questions created');

    const midtermQuestions = [
      {
        questionText: 'RESTful API sử dụng những HTTP methods nào?',
        questionType: 'multiple-choice',
        options: [
          { id: 'A', text: 'GET, POST, PUT, DELETE', isCorrect: true },
          { id: 'B', text: 'GET, POST', isCorrect: false },
          { id: 'C', text: 'GET, DELETE', isCorrect: false },
          { id: 'D', text: 'POST, PUT', isCorrect: false }
        ],
        correctAnswer: 'A',
        explanation: 'RESTful API sử dụng các HTTP methods: GET (lấy), POST (tạo), PUT (cập nhật toàn bộ), DELETE (xóa)',
        points: 1,
        order: 1
      },
      {
        questionText: 'JSON là viết tắt của?',
        questionType: 'multiple-choice',
        options: [
          { id: 'A', text: 'JavaScript Object Notation', isCorrect: true },
          { id: 'B', text: 'Java Syntax Object Notation', isCorrect: false },
          { id: 'C', text: 'JavaScript Online Notation', isCorrect: false },
          { id: 'D', text: 'Java Object Network', isCorrect: false }
        ],
        correctAnswer: 'A',
        explanation: 'JSON (JavaScript Object Notation) là định dạng dữ liệu nhẹ, dễ đọc',
        points: 1,
        order: 2
      }
    ];

    for (const questionData of midtermQuestions) {
      const question = new Question({
        exam: savedMidtermExam._id,
        ...questionData
      });
      await question.save();
    }
    console.log('Midterm exam questions created');

    for (let i = 0; i < 3; i++) {
      const result = new Result({
        exam: savedPracticeExam._id,
        student: students[i]._id,
        answers: [
          {
            question: (await Question.findOne({ exam: savedPracticeExam._id, order: 1 }))._id,
            selectedAnswer: 'A',
            isCorrect: true,
            points: 1
          },
          {
            question: (await Question.findOne({ exam: savedPracticeExam._id, order: 2 }))._id,
            selectedAnswer: 'B',
            isCorrect: true,
            points: 1
          }
        ],
        totalPoints: 2,
        maxPoints: 10,
        scorePercentage: 20,
        isPass: false,
        status: 'submitted',
        startTime: new Date(now.getTime() - 60 * 60 * 1000),
        submitTime: new Date(now.getTime() - 55 * 60 * 1000),
        timeTaken: 300
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
