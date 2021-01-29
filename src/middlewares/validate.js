const apiResponse = require('./response');
const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = {};
    errors.array().forEach(err => (error[err.param] = err.msg));
    apiResponse(res, 400, 'error', 'Required fields missing', error);
  }
  next();
};
