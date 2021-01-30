const apiResponse = require('./response');
const { validationResult } = require('express-validator');
module.exports = {
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = ``;
      errors.array().forEach(err => (error += err.msg));
      return apiResponse(res, 400, 'error', error, null);
    }
    next();
  },
  stringifyBody: (req, res, next) => {
    // express validator's toJSON method always expects a JSON string for validation
    if (req.body) {
      Object.keys(req.body).forEach(el => {
        if (!Array.isArray(req.body[el]) && typeof req.body[el] === 'object') {
          req.body[el] = JSON.stringify(req.body[el]);
        }
      });
    }
    next();
  },
  parseBody: (req, res, next) => {
    if (req.body) {
      Object.keys(req.body).forEach(el => {
        req.body[el] = JSON.parse(req.body[el]);
      });
    }
    next();
  },
  checkObjectFields: async (obj, fields = []) => {
    let error = ``;
    try {
      for (field of fields) {
        if (!obj[field]) {
          error += `field ${field} is missing from rule.`
          break;
        }
      }
      if (error) {
        return { err: error, success: false }
      }
      return { err: null, success: true }

    } catch (err) {
      return { err: err.message, success: false }
    }
  },
  checkDataField: (req, res, next) => {
    let { data } = req.body
    if (data && (Array.isArray(data) || typeof (data) === "string" || typeof (data) === "object")) {
      next()
    } else {
      return apiResponse(res, 400, "error", "data should be a valid array, json object or string.", null)
    }
  }
};
