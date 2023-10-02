const { v4: uuidV4 } = require('uuid');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const JWT_SECRET = process.env.JWT_SECRET;
const { check, validationResult } = require('express-validator');
const db = require('../models');
const sequelizeConfig = require('../config/sequelize.config.js');

const Users = db.users;
const Op = db.Sequelize.Op;


exports.getById = async (req, res) => {
	const encryptedUserUuid = req.session.user.uuid;
	const bytes = CryptoJS.AES.decrypt(encryptedUserUuid, JWT_SECRET);
	const originalUserUuid = bytes.toString(CryptoJS.enc.Utf8);

	const condition = {
		uuid: originalUserUuid
	};

	const user = await Users.findAll({ where: condition })
			.then((data) => {
					return data;
			})
			.catch((err) => {
					return err.message || 'Some error occurred while retrieving data.';
			});

	res.send(user);
};


exports.search = async (req, res) => {
	const searchTerm = req.query.q;

	const condition = {
		[Op.or]: [
      { author_pseudonym: { [Op.like]: `%${searchTerm}%` } },
    ],
	};

	const users = await Users.findAll({ 
		where: condition,
		attributes: ['author_pseudonym'],
	})
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err.message || `Not found user with searchTerm: ${searchTerm}.`;
		});

	res.send(users);
};


exports.update = async (req, res) => {
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

	const encryptedUserUuid = req.session.user.uuid;
	const author_pseudonym = req.body.author_pseudonym;

	const bytes = CryptoJS.AES.decrypt(encryptedUserUuid, JWT_SECRET);
	const originalUserUuid = bytes.toString(CryptoJS.enc.Utf8);

	const sequelize = sequelizeConfig.sequelize;
	const transaction = await sequelize.transaction();

	const condition = {
		status: 1,
		uuid: originalUserUuid
	};

	const users = await Users.findAll({ where: condition })
			.then((data) => {
					return data;
			})
			.catch((err) => {
					return err.message || 'Some error occurred while retrieving data.';
			});


	if (users.length > 0) {
		try {
			let userObjects = {
				author_pseudonym: author_pseudonym
			};

			await Promise.all([
				Users.update(userObjects, { where: condition, transaction }),
			]);
			await transaction.commit();

			responseData = {
				title: 'Success Update',
				message: 'User Success Update',
				icon: 'success',
				userObjects: userObjects,
			};

		} catch (e) {
			await transaction.rollback();

			responseData = {
				title: 'Warning',
				message: 'Ask the Administrator',
				icon: 'warning',
			};
		}
	} else {
			responseData = {
					message: 'User details you want to update does not exist.',
			};
	}

	res.send(responseData);
};


