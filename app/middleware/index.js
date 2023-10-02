
const middleware = {};
middleware.registrationValidation = require('./validations/registration.validation.js');
middleware.loginValidation = require('./validations/login.validation.js');
middleware.verifyToken = require('./validations/verifyToken.validation.js');
middleware.user = require('./validations/user.validation.js');


module.exports = middleware;
