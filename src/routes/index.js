const express = require('express');
const { check } = require('express-validator');

const Controller = require('../controllers/controller');
const {
  validate,
  parseBody,
  checkDataField,
} = require('../middlewares/validate');

const router = express.Router();

router.get('/', Controller.getData);
router.post(
  '/validate-rule',
  check('rule').notEmpty().withMessage('rule is required.'),
  validate,
  [
    check('rule').isJSON({}).withMessage('rule should be an object.'),
    check('data').notEmpty().withMessage('data is required'),
  ],
  validate,
  parseBody,
  checkDataField,
  Controller.validateRule
);
router.all('*', Controller.handleErrors);
module.exports = router;
