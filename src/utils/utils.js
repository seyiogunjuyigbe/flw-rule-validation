module.exports = (req, res, next) => {
  // express validator's toJSON method always expects a JSON string for validation
  if (req.body) {
    Object.keys(req.body).forEach(el => {
      if (!Array.isArray(req.body[el]) && typeof req.body[el] === 'object') {
        req.body[el] = JSON.stringify(req.body[el]);
      }
    });
  }
  next();
};
