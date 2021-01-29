const apiResponse = require('../middlewares/response');
const { NAME, GITHUB, EMAIL, MOBILE, TWITTER } = require('../config/constants');

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
      return apiResponse(res, 500, 'error', 'An Error Occurred', err.message);
    }
  },
};
