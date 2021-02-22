const sendResponse = (res, statusCode, msg) => res.status(statusCode).json({ msg });

module.exports = {
  sendResponse,
};
