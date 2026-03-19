const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  async register(userData) {
    const { username, email, password, confirmPassword, fullName, role = 'student', studentId } = userData;

    if (!username || !email || !password || !confirmPassword || !fullName) {
      throw new Error('All fields are required');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new Error('Username or Email already exists');
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

    const token = this.generateToken(newUser);

    return {
      user: newUser.toJSON(),
      token
    };
  }

  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const user = await User.findOne({ username });

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    user.lastLogin = new Date();
    await user.save();

    const token = this.generateToken(user);

    return {
      user: user.toJSON(),
      token
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}

module.exports = new AuthService();
