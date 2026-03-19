const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res, message = 'Error', statusCode = 400, code = 'ERROR') => {
  res.status(statusCode).json({
    status: 'error',
    code,
    message,
    timestamp: new Date().toISOString()
  });
};

module.exports = { sendSuccess, sendError };
