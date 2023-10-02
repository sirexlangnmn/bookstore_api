const { v4: uuidV4 } = require('uuid');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const JWT_SECRET = process.env.JWT_SECRET;
const { check, validationResult } = require('express-validator');
const db = require('../models');
const sequelizeConfig = require('../config/sequelize.config.js');

const Users_accounts = db.users_accounts;
const Users = db.users;

const Op = db.Sequelize.Op;

exports.login = async (req, res) => {
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

    const username = req.body.username;
    const password = req.body.password;

    let condition = username ? { username: username } : null;

    const userAccount = await Users_accounts.findAll({ where: condition })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return err.message || 'Some error occurred while retrieving data.';
        });


    if (userAccount.length > 0) {
        const verified = bcrypt.compareSync(password, userAccount[0].password);

        if (verified) {
            let session = req.session;
            let userAccountUuid = userAccount[0].uuid
            let condition = userAccountUuid ? { uuid: userAccountUuid } : null;
            const users = await Users.findAll({ where: condition })
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    return err.message || 'Some error occurred while retrieving data.';
                });

            const usersAccounts = await Users_accounts.findAll({ where: condition })
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    return err.message || 'Some error occurred while retrieving data.';
                });

                const cipherUuid = CryptoJS.AES.encrypt(users[0].uuid, JWT_SECRET).toString();

                let sessionUser = {
                    full_name: users[0].full_name,
                    uuid: cipherUuid,
                    type: usersAccounts[0].type,
                    originalUuid: users[0].uuid,
                };

                session.user = sessionUser;

                const jsontoken = jsonwebtoken.sign({user: username}, JWT_SECRET, { expiresIn: '30m'} );
                res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.

                res.status(200);

                responseData = {
                    message: 'Login Success',
                    jsontoken: jsontoken,
                    sessionUser: sessionUser,
                };
        } else {
            responseData = {
                message: 'Kindly check email and password (wrong password)',
            };
        }
    } else {
        responseData = {
            message: 'Kindly check email and password (wrong email)',
        };
    }

    res.send(responseData);
};
