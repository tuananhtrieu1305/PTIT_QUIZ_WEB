const express = require('express');
const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error) {
    sendError(res, error.message, 400, 'REGISTRATION_FAILED');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    sendSuccess(res, result, 'Login successful', 200);
  } catch (error) {
    sendError(res, error.message, 401, 'LOGIN_FAILED');
  }
});

router.get('/me', async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    sendSuccess(res, user, 'User retrieved successfully');
  } catch (error) {
    sendError(res, error.message, 404, 'USER_NOT_FOUND');
  }
});

module.exports = router;
