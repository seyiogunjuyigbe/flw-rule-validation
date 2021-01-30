const apiResponse = require('../middlewares/response');
const { NAME, GITHUB, EMAIL, MOBILE, TWITTER } = require('../config/constants');
const { checkObjectFields } = require('../middlewares/validate');

module.exports = {
  getData: async (req, res) => {
    try {
      let myData = {
        name: NAME,
        github: GITHUB,
        email: EMAIL,
        mobile: MOBILE,
        twitter: TWITTER,
      };
      return apiResponse(
        res,
        200,
        'success',
        'My Rule - Validation API',
        myData
      );
    } catch (err) {
      return apiResponse(res, 500, 'error', 'An Error Occurred', {
        error: err.message,
      });
    }
  },
  validateRule: async (req, res) => {
    let d;
    try {
      const { rule, data } = req.body;
      // check if "rule" field has the required object fields
      let check = await checkObjectFields(rule, [
        'field',
        'condition',
        'condition_value',
      ]);
      if (!check.success) {
        return apiResponse(res, 400, 'error', check.err, null);
      }
      // check if "field" in "rule" has nested objects
      let splittedField = rule.field.split('.');
      if (splittedField.length) {
        if (splittedField.length > 2) {
          return apiResponse(
            res,
            400,
            'error',
            'nested field object levels are more than twos.',
            null
          );
        }
        // check if each level of nested object exists in data
        switch (splittedField.length) {
          case 1:
            if (!data[splittedField[0]]) {
              return apiResponse(
                res,
                400,
                'error',
                `field ${splittedField[0]} is missing from data.`,
                null
              );
            }
            break;
          case 2:
            if (!data[splittedField[0]]) {
              return apiResponse(
                res,
                400,
                'error',
                `field ${splittedField[0]} is missing from data.`,
                null
              );
            }
            if (!data[splittedField[0]][splittedField[1]]) {
              return apiResponse(
                res,
                400,
                'error',
                `field ${splittedField[1]} of ${splittedField[0]} is missing from data.`,
                null
              );
            }
            break;
          default:
            break;
        }
      }
      // check validation
      if (!['eq', 'neq', 'gt', 'gte', 'contains'].includes(rule.condition)) {
        return apiResponse(res, 400, 'error', 'invalid rule condition.', null);
      }
      switch (rule.condition) {
        case 'eq':
          d = data[splittedField[0]][splittedField[1]]
            ? data[splittedField[0]][splittedField[1]]
            : data[splittedField[0]];
          if (!(d === rule.condition_value)) {
            return apiResponse(
              res,
              400,
              'error',
              `field ${rule.field} failed validation.`,
              {
                validation: {
                  error: true,
                  field: rule.field,
                  field_value: data[rule.field],
                  condition: rule.condition,
                  condition_value: rule.condition_value,
                },
              }
            );
          }
          break;
        case 'neq':
          d = data[splittedField[0]][splittedField[1]]
            ? data[splittedField[0]][splittedField[1]]
            : data[splittedField[0]];
          if (!(d !== rule.condition_value)) {
            return apiResponse(
              res,
              400,
              'error',
              `field ${rule.field} failed validation`,
              {
                validation: {
                  error: true,
                  field: rule.field,
                  field_value: data[rule.field],
                  condition: rule.condition,
                  condition_value: rule.condition_value,
                },
              }
            );
          }
          break;
        case 'gt':
          d = data[splittedField[0]][splittedField[1]]
            ? data[splittedField[0]][splittedField[1]]
            : data[splittedField[0]];
          if (!(d > rule.condition_value)) {
            return apiResponse(
              res,
              400,
              'error',
              `field ${rule.field} failed validation`,
              {
                validation: {
                  error: true,
                  field: rule.field,
                  field_value: data[rule.field],
                  condition: rule.condition,
                  condition_value: rule.condition_value,
                },
              }
            );
          }
          break;
        case 'gte':
          d = data[splittedField[0]][splittedField[1]]
            ? data[splittedField[0]][splittedField[1]]
            : data[splittedField[0]];
          if (!(d >= rule.condition_value)) {
            return apiResponse(
              res,
              400,
              'error',
              `field ${rule.field} failed validation`,
              {
                validation: {
                  error: true,
                  field: rule.field,
                  field_value: data[rule.field],
                  condition: rule.condition,
                  condition_value: rule.condition_value,
                },
              }
            );
          }
          break;
        case 'contains':
          d = data[splittedField[0]][splittedField[1]]
            ? data[splittedField[0]][splittedField[1]]
            : data[splittedField[0]];
          if (!d.includes(rule.condition_value)) {
            return apiResponse(
              res,
              400,
              'error',
              `field ${rule.field} failed validation`,
              {
                validation: {
                  error: true,
                  field: rule.field,
                  field_value: data[rule.field],
                  condition: rule.condition,
                  condition_value: rule.condition_value,
                },
              }
            );
          }
          break;
        default:
          break;
      }
      return apiResponse(
        res,
        200,
        'success',
        `field ${rule.field} successfully validated.`,
        {
          validation: {
            error: false,
            field: rule.field,
            field_value: data[rule.field],
            condition: rule.condition,
            condition_value: rule.condition_value,
          },
        }
      );
    } catch (err) {
      return apiResponse(res, 500, 'error', 'An Error Ocured', {
        error: err.message,
      });
    }
  },
  handleErrors: (req, res) => {
    return apiResponse(res, 404, 'error', 'Invalid Route', {
      error: 'requested route not found',
    });
  },
};
