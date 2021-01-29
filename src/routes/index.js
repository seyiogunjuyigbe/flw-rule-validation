const express = require('express');
const { check } = require('express-validator');

const Controller = require('../controllers/controller');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', Controller.getData);
router.post(
  '/validate-rule',
  [
    check('rule')
      .isJSON({ allow_primitives: true })
      .withMessage('must be a valid JSON object'),
    check('data')
      .isJSON({ allow_primitives: true })
      .withMessage('must be a valid JSON object'),
  ],
  validate
);
module.exports = router;
