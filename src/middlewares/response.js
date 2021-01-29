module.exports = (res, code, status, message, data) => {
  res.status(code).json({
    message,
    status,
    data,
  });
};
