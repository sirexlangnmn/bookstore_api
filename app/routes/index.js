module.exports = (app) => {
    const { check, validationResult } = require('express-validator');

    const controllers = require('../controllers');
    const middleware = require('../middleware');

    const verifyToken = middleware.verifyToken;
    const user = middleware.user;

    const registrationValidation = middleware.registrationValidation;
    const registrationController = controllers.registration;

    const loginValidation = middleware.loginValidation;
    const loginController = controllers.login;


    const booksController = controllers.books;
    const usersController = controllers.users;


    // test if protected route
    app.get('/api/v1/resource', verifyToken, user.isActive, (req, res) => {
        res.json({ message: 'This is a protected resource.' });
    });

    // app.post(['/api/v1/registration'], registrationValidation, registrationController.create);
    app.post(['/api/v1/registration'], registrationController.create);

    // app.post(['/api/v1/login'], loginValidation, loginController.login);
    app.post(['/api/v1/login'], loginController.login);

    app.post(['/api/v1/book'], verifyToken, user.isActive, booksController.create);

    app.put(['/api/v1/book'], verifyToken, user.isActive, booksController.update);

    app.put(['/api/v1/book/delete'], verifyToken, user.isActive, booksController.delete);

    app.get(['/api/v1/books'], booksController.getAll);

    app.get(['/api/v1/book/:id'], booksController.getById);

    // /api/v1/books/search?q=search_keyword_title_or_description
    app.get(['/api/v1/books/search'], booksController.search);

    app.get(['/api/v1/user'], verifyToken, user.isActive, usersController.getById);

    // /api/v1/users/search?q=search_keyword_for_author_pseudonym
    app.get(['/api/v1/users/search'], verifyToken, user.isActive, usersController.search);

    app.put(['/api/v1/user'], verifyToken, user.isActive, usersController.update);



};
