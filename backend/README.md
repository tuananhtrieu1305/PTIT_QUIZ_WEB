# PTIT Quiz Web - Backend Server

A Node.js + Express + MongoDB backend application for an online quiz system with features for students and administrators.

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic (login, register)
│   ├── examController.js    # Student exam operations
│   └── adminController.js   # Admin dashboard and management
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User schema (student/admin)
│   ├── Exam.js              # Exam schema
│   ├── Question.js          # Question schema
│   └── Result.js            # Exam result schema
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   ├── examRoutes.js        # Student exam endpoints
│   └── adminRoutes.js       # Admin endpoints
├── seeds/
│   └── seed.js              # Database seeding with mock data
├── utils/
│   └── response.js          # Response formatting utilities
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── server.js               # Express server setup
├── package.json            # Project dependencies
├── API_DOCUMENTATION.md    # Complete API documentation
├── POSTMAN_COLLECTION.json # Postman API collection
└── README.md              # This file
```

## Features

### For Students
- **Authentication**: Register and login to student accounts
- **View Exams**: Browse available exams with search and filter
- **Take Exams**: Complete timed quizzes with multiple choice and true/false questions
- **View Results**: See exam scores, correct answers, and explanations
- **Result History**: View all past exam attempts

### For Administrators
- **Dashboard**: Views statistics of all exams and student participation
- **Exam Management**: Create, edit, delete exams
- **Question Management**: Add, edit, delete exam questions
- **User Management**: Create, edit, delete student accounts
- **Statistics**: Detailed statistics per exam (pass rates, average scores, etc.)
- **Student Details**: View individual student exam results and performance

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Prerequisites

- Node.js v14+ installed
- MongoDB v4.0+ installed and running
- npm or yarn package manager

## Installation

1. **Clone the repository and navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** (already included with default values):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ptit_quiz
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

4. **Ensure MongoDB is running:**
```bash
# On Windows
mongod

# On macOS (if installed via Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

## Setup & Running

### Option 1: Quick Start with Mock Data

1. **Seed the database** (creates mock data):
```bash
node seeds/seed.js
```

This will create:
- 1 admin user (admin/admin123)
- 5 student users (student1-5/student123)
- 3 sample exams (Practice, Midterm, Final)
- 10 sample questions in practice exam
- Sample exam results

2. **Start the server:**
```bash
npm start
```

Server will be available at: `http://localhost:5000`

### Option 2: Development Mode with Auto-reload

```bash
npm run dev
```

(Requires nodemon - already listed in devDependencies)

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info

### Student Exams
- `GET /api/exams` - Get all available exams
- `GET /api/exams/:id` - Get exam details with questions
- `GET /api/exams/:id/questions` - Get exam questions
- `POST /api/exams/submit` - Submit exam answers
- `GET /api/exams/result/:resultId` - Get result details
- `GET /api/exams/results/my-results` - Get all my results

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/exams/:examId/statistics` - Get exam statistics

### Admin Exam Management
- `GET /api/admin/exams` - Get all exams
- `POST /api/admin/exams` - Create new exam
- `PUT /api/admin/exams/:id` - Update exam
- `DELETE /api/admin/exams/:id` - Delete exam
- `POST /api/admin/exams/:examId/questions` - Add question
- `PUT /api/admin/questions/:questionId` - Update question
- `DELETE /api/admin/questions/:questionId` - Delete question

### Admin User Management
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/users/:studentId/details` - Get student exam details

For complete documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import" button
3. Select `POSTMAN_COLLECTION.json` file from this folder
4. The collection with all endpoints will be imported

### Setup Environment Variables

1. Create variables in Postman:
   - `BASE_URL` = `http://localhost:5000/api`
   - `TOKEN` = (token from student login)
   - `ADMIN_TOKEN` = (token from admin login)

2. Get tokens by running:
   - Login: `POST /api/auth/login` with default credentials
   - Copy token from response to corresponding Postman variable

### Test Flow

1. **Login as Student**: Get `TOKEN` from login response
2. **Login as Admin**: Get `ADMIN_TOKEN` from admin login
3. **Test Student Features**: Use endpoints under "Student - Exams" folder
4. **Test Admin Features**: Use endpoints under "Admin - Dashboard", "Admin - Exam Management", "Admin - User Management" folders

## Default Test Credentials

### Admin Account
```
Username: admin
Password: admin123
```

### Student Accounts
```
Username: student1, Password: student123
Username: student2, Password: student123
Username: student3, Password: student123
Username: student4, Password: student123
Username: student5, Password: student123
```

## Database Models

### User
- `_id`: MongoDB ObjectId
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password
- `fullName`: User full name
- `role`: 'student' or 'admin'
- `studentId`: Student ID (for students)
- `isActive`: Account status
- `createdAt`, `updatedAt`: Timestamps

### Exam
- `_id`: MongoDB ObjectId
- `title`: Exam title
- `description`: Exam description
- `examType`: 'practice', 'midterm', 'final', 'other'
- `accessType`: 'free', 'scheduled', 'restricted'
- `startTime`, `endTime`: For scheduled exams
- `duration`: Exam duration in minutes
- `totalQuestions`: Number of questions
- `passingScore`: Passing percentage
- `showResults`, `showAnswers`: Display options
- `randomizeQuestions`: Randomize question order
- `createdBy`: Admin who created it
- `isPublished`: Publication status

### Question
- `_id`: MongoDB ObjectId
- `exam`: Reference to Exam
- `questionText`: Question content
- `questionType`: 'multiple-choice', 'true-false', 'short-answer'
- `options`: Array of answer options
- `correctAnswer`: Correct answer
- `explanation`: Answer explanation
- `points`: Points for this question
- `order`: Question ordering

### Result
- `_id`: MongoDB ObjectId
- `exam`: Reference to Exam
- `student`: Reference to User (student)
- `answers`: Array of student answers
- `totalPoints`: Points earned
- `maxPoints`: Maximum possible points
- `scorePercentage`: Percentage score
- `status`: 'started', 'submitted', 'graded'
- `isPass`: Whether student passed
- `startTime`, `submitTime`: Timestamps
- `timeTaken`: Time spent in seconds

## Common Issues & Solutions

### MongoDB Connection Error
- **Issue**: Cannot connect to MongoDB
- **Solution**: Ensure MongoDB is running. Check `MONGODB_URI` in `.env`

### Authentication Failed
- **Issue**: Getting "Token is not valid" error
- **Solution**: Make sure you're including the token in Authorization header as: `Bearer <token>`

### Port Already in Use
- **Issue**: Error "Port 5000 already in use"
- **Solution**: Change PORT in `.env` to another port (e.g., 5001)

### CORS Errors
- **Issue**: Frontend can't connect to backend
- **Solution**: Backend has CORS enabled for all origins. Check if server is actually running.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/ptit_quiz |
| `JWT_SECRET` | Secret key for JWT signing | your_jwt_secret_key_here_change_in_production |
| `NODE_ENV` | Environment (development/production) | development |

## Development Guidelines

### Project Architecture
- **MVC Pattern**: Models for data, Controllers for logic, Routes for endpoints
- **JWT Authentication**: Stateless authentication with 7-day expiration
- **Error Handling**: Centralized error response format
- **Input Validation**: Server-side validation on all inputs

### Code Style
- Use consistent naming (camelCase for variables, PascalCase for classes)
- Add comments for complex logic
- Use async/await for asynchronous operations
- Keep routes clean and delegate logic to controllers

### Adding New Features

1. **Create/Update Model** in `models/` folder
2. **Create Controller** in `controllers/` folder with business logic
3. **Create Routes** in `routes/` folder
4. **Add route to server.js**: `app.use('/api/<path>', routes);`
5. **Update API documentation**

## Deployment

### Prerequisites
- Node.js hosting (Heroku, DigitalOcean, AWS, etc.)
- MongoDB hosting (MongoDB Atlas, etc.)
- Environment variables properly configured

### Steps
1. Update `MONGODB_URI` to production database
2. Change `JWT_SECRET` to a strong random key
3. Set `NODE_ENV=production`
4. Deploy source code to hosting platform
5. Run `npm install` and `npm start`

## Support & Documentation

- Complete API documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Postman collection: [POSTMAN_COLLECTION.json](./POSTMAN_COLLECTION.json)
- Express.js docs: https://expressjs.com
- MongoDB docs: https://docs.mongodb.com
- JWT docs: https://jwt.io

## License

MIT

## Author

Created for PTIT Quiz Web System project

---

**Last Updated**: January 2024
