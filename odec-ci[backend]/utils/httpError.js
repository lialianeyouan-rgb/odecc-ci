const createHttpError = (status, message, code = "API_ERROR", details) => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  if (details !== undefined) {
    error.details = details;
  }
  return error;
};


module.exports = { createHttpError };
