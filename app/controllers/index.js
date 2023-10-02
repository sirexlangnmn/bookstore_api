
const controller = {};

controller.registration = require('./registration.controller.js');
controller.login = require('./login.controller.js');
controller.books = require('./books.controller.js');
controller.users = require('./users.controller.js');


module.exports = controller;
