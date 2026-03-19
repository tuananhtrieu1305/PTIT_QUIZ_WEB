const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    sendSuccess(
      res,
      result,
      'User registered successfully',
      201
    );
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    sendSuccess(
      res,
      result,
      'Login successful'
    );
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    sendSuccess(res, user);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
