const { v4: uuidV4 } = require('uuid');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { check, validationResult } = require('express-validator');
const db = require('../models');
const sequelizeConfig = require('../config/sequelize.config.js');

const Users_accounts = db.users_accounts;
const Users = db.users;

const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    let responseData;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            return res.status(200).send({
                message: errors.array(),
            });
        }
    } catch (error) {
        return res.status(400).json({
            error: {
                message: error,
            },
        });
    }

    const author_pseudonym = req.body.author_pseudonym;
    const username = req.body.username;
    const email_address = req.body.email_address;
    const password = req.body.password;

    let condition = email_address ? { email_address: email_address } : null;

    const existingUser = await Users_accounts.findAll({ where: condition })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return err.message || 'Some error occurred while retrieving tutorials.';
        });

    if (existingUser.length > 0) {
        responseData = {
            message: 'email already in use',
        };
    }

    if (existingUser.length === 0) {
        let session = req.session;
        const uuid = uuidV4();
        const verificationCode = Math.floor(Math.random() * 900000) + 100000;
        const saltRounds = 10;

        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });


        const sequelize = sequelizeConfig.sequelize;
        const transaction = await sequelize.transaction();

        try {
            let usersObjects = {
                author_pseudonym: author_pseudonym,
                status: 1,
                type: 1,
                uuid: uuid,
            };

            let usersAccountsObjects = {
                username: username,
                email_address: email_address,
                password: hashedPassword,
                type: 1, // normal user
                uuid: uuid,
            };

            const user = await Users.create(usersObjects, { transaction: transaction });
            await Users_accounts.create(usersAccountsObjects, { transaction: transaction });
            await transaction.commit();

            session.verification_code = verificationCode;
            session.registration_uuid = uuid;
            session.registration_email_address = email_address;

            const jsontoken = jsonwebtoken.sign({user: username}, JWT_SECRET, { expiresIn: '30m'} );
            res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.

            res.status(201);

            responseData = {
                message: 'User registered successfully',
                verification_code: verificationCode,
                username: username,
                email_address: email_address,
                jsontoken: jsontoken,
            };

        } catch (e) {
            await transaction.rollback();

            responseData = {
                message: 'rollback',
            };
        }

    }

    res.send(responseData);
};
