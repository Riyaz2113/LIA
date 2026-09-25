/**
 * response.js
 * Standardized API response formatters.
 */

const sendSuccess = (res, data, statusCode = 200, extra = {}) => {
  const payload = {
    success: true,
    data,
    ...extra,
  };
  return res.status(statusCode).json(payload);
};

const sendError = (res, message, statusCode = 400, errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
  sendError,
};
