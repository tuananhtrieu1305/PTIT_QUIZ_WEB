# PTIT Quiz Backend - Vibecoding Version

Alternative implementation of the PTIT Quiz System backend with enhanced architecture using services layer.

## Key Differences

- **Services Layer**: Business logic separated into service classes
- **API Versioning**: API endpoints under `/api/v1/`
- **Port**: Running on port 5001 (instead of 5000)
- **Database**: `ptit_quiz_vibecoding` (separate database)
- **Error Handling**: Structured error responses with error codes
- **User Roles**: Added 'instructor' role
- **Enhanced Features**: 
  - Question difficulty levels
  - Question tags
  - More precise timestamp tracking
  - Better statistics

## Project Structure

```
src/
├── config/          # Database configuration
├── models/          # MongoDB schemas (User, Exam, Question, Result)
├── services/        # Business logic (Auth, Exam, Admin services)
├── routes/          # API route definitions
├── middleware/      # Authentication & authorization middleware
├── utils/           # Response formatters, helpers
├── database/        # Database seeding script
└── index.js         # Application entry point
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend-vibecoding
npm install
```

### 2. Configure Environment
Ensure `.env` file exists with:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ptit_quiz_vibecoding
JWT_SECRET=vibecoding_secret_key_2024_ptit_quiz_system
NODE_ENV=development
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

Or production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user (protected)

### Student Exams
- `GET /api/v1/exams` - List available exams
- `GET /api/v1/exams/:id` - Get exam with questions
- `POST /api/v1/exams/submit` - Submit exam answers
- `GET /api/v1/exams/my/results` - Get student's results
- `GET /api/v1/exams/result/:resultId` - Get result details

### Admin Dashboard
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics (admin only)
- `GET /api/v1/admin/users` - List all users (admin only)
- `GET /api/v1/admin/exams` - List all exams (admin only)
- `POST /api/v1/admin/exams` - Create exam (admin only)
- `PUT /api/v1/admin/exams/:id` - Update exam (admin only)
- `DELETE /api/v1/admin/exams/:id` - Delete exam (admin only)
- `POST /api/v1/admin/exams/:examId/questions` - Add question (admin only)
- `GET /api/v1/admin/exams/:examId/statistics` - Exam statistics (admin only)

## Default Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Instructor:**
- Username: `instructor1`
- Password: `instructor123`

**Students:**
- Username: `student1-5`
- Password: `student123`
- StudentID: `B20DCCN001-005`

## Postman Collection

Import `POSTMAN_COLLECTION.json` into Postman for easy API testing.

## Technology Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for frontend integration

## Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {...},
  "timestamp": "2024-03-20T10:00:00.000Z"
}
```

### Error Response
```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Error description",
  "timestamp": "2024-03-20T10:00:00.000Z"
}
```

## Development

- Run in development with `npm run dev` (uses nodemon)
- Check health status: `GET /api/v1/health`
- Database seeding: `npm run seed`

## License

ISC
