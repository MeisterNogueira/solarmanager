module.exports = function error(statusCode, message) {
  return {
    statusCode: statusCode,
    errorMessage: message
  }
}