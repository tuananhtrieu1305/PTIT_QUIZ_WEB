const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (payload) => {
  const { username, email, password, confirmPassword, fullName, role = 'student', studentId } = payload;

  if (!username || !email || !password || !confirmPassword || !fullName) {
    throw createServiceError('All fields are required', 400);
  }

  if (password !== confirmPassword) {
    throw createServiceError('Passwords do not match', 400);
  }

  if (password.length < 6) {
    throw createServiceError('Password must be at least 6 characters', 400);
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw createServiceError('Username or Email already exists', 400);
  }

  const newUser = new User({
    username,
    email,
    password,
    fullName,
    role,
    studentId: role === 'student' ? studentId : undefined
  });

  await newUser.save();

  return {
    user: newUser.toJSON(),
    token: generateToken(newUser)
  };
};

const login = async (payload) => {
  const { username, password } = payload;

  if (!username || !password) {
    throw createServiceError('Username and password are required', 400);
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw createServiceError('Invalid username or password', 401);
  }

  if (!user.isActive) {
    throw createServiceError('Account is inactive', 401);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw createServiceError('Invalid username or password', 401);
  }

  return {
    user: user.toJSON(),
    token: generateToken(user)
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createServiceError('User not found', 404);
  }
  return user.toJSON();
};

module.exports = {
  register,
  login,
  getCurrentUser
};
