// ===================================
// ERROR HANDLER
// ===================================

const appError = (statusCode, code, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";

  res.status(statusCode).json({
    status: "error",
    code,
    message: err.message,
  });
};

module.exports = { appError, errorHandler };
