// errorHandler.js
class ErrorHandler extends Error {
  constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
  }
}

const handleError = (err, req, res, next) => {
  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
      success: false,
      statusCode: statusCode || 500,
      message: message || 'Internal Server Error',
      // You can also include stack trace for debugging in development mode
      // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = {
  ErrorHandler,
  handleError
};
