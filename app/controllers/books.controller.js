const { v4: uuidV4 } = require('uuid');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const JWT_SECRET = process.env.JWT_SECRET;
const { check, validationResult } = require('express-validator');
const db = require('../models');
const sequelizeConfig = require('../config/sequelize.config.js');

const Books = db.books;
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

	const encryptedUuid = req.session.user.uuid;
	const title = req.body.title;
	const description = req.body.description;
	const cover_image_url = req.body.cover_image_url;
	const price = req.body.price;

	const bytes = CryptoJS.AES.decrypt(encryptedUuid, JWT_SECRET);
	const originalUuid = bytes.toString(CryptoJS.enc.Utf8);

	const sequelize = sequelizeConfig.sequelize;
	const transaction = await sequelize.transaction();

	try {
		let bookObjects = {
			title: title,
			description: description,
			cover_image_url: cover_image_url,
			price: price,
			status: 1, // 1 = published book
			uuid: uuidV4(),
			user_uuid: originalUuid,
		};

		const books = await Books.create(bookObjects, { transaction: transaction });
		await transaction.commit();

		res.status(200);

		responseData = {
			title: 'Success',
			message: 'Book published successfully',
			icon: 'success',
			bookObjects: bookObjects,
		};

	} catch (e) {
		await transaction.rollback();

		responseData = {
			title: 'Warning',
			message: 'Ask the Administrator',
			icon: 'warning',
		};
	}

	res.send(responseData);
};


exports.getAll = async (req, res) => {
	const condition = {
		status: 1,
	};

	const books = await Books.findAll({ where: condition })
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err.message || 'Some error occurred while retrieving books.';
		});

	res.send(books);
};


exports.getById = async (req, res) => {
	const id = req.params.id;

	const condition = {
		id: id,
		status: 1,
	};

	const books = await Books.findAll({ where: condition })
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err.message || `Not found book with id: ${req.params.id}.`;
		});

	res.send(books);
};


exports.search = async (req, res) => {
	const searchTerm = req.query.q;

	const condition = {
		status: 1,
		[Op.or]: [
      { title: { [Op.like]: `%${searchTerm}%` } },
      { description: { [Op.like]: `%${searchTerm}%` } },
    ],
	};

	const books = await Books.findAll({ where: condition })
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err.message || `Not found book with id: ${req.params.id}.`;
		});

	res.send(books);
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
	const title = req.body.title;
	const description = req.body.description;
	const cover_image_url = req.body.cover_image_url;
	const price = req.body.price;
	const uuid = req.body.uuid;

	const bytes = CryptoJS.AES.decrypt(encryptedUserUuid, JWT_SECRET);
	const originalUserUuid = bytes.toString(CryptoJS.enc.Utf8);

	const sequelize = sequelizeConfig.sequelize;
	const transaction = await sequelize.transaction();

	const condition = {
		status: 1,
		uuid: uuid,
		user_uuid: originalUserUuid
	};

	const books = await Books.findAll({ where: condition })
			.then((data) => {
					return data;
			})
			.catch((err) => {
					return err.message || 'Some error occurred while retrieving data.';
			});


	if (books.length > 0) {
		try {
			let bookObjects = {
				title: title,
				description: description,
				cover_image_url: cover_image_url,
				price: price,
				// status: 1, // 1 = published book
			};

			console.log('bookObjects', bookObjects);

			await Promise.all([
				Books.update(bookObjects, { where: condition, transaction }),
			]);
			await transaction.commit();

			responseData = {
				title: 'Success Update',
				message: 'Book published Update',
				icon: 'success',
				bookObjects: bookObjects,
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
					message: 'Book details you want to update does not exist.',
			};
	}

	res.send(responseData);
};


exports.delete = async (req, res) => {
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
	const uuid = req.body.uuid;

	const bytes = CryptoJS.AES.decrypt(encryptedUserUuid, JWT_SECRET);
	const originalUserUuid = bytes.toString(CryptoJS.enc.Utf8);

	const sequelize = sequelizeConfig.sequelize;
	const transaction = await sequelize.transaction();

	const condition = {
		status: 1,
		uuid: uuid,
		user_uuid: originalUserUuid
	};

	const books = await Books.findAll({ where: condition })
			.then((data) => {
					return data;
			})
			.catch((err) => {
					return err.message || 'Some error occurred while retrieving data.';
			});


	if (books.length > 0) {
		try {
			let bookObjects = {
				status: 2, // 2 = unpublished book
			};

			await Promise.all([
				Books.update(bookObjects, { where: condition, transaction }),
			]);
			await transaction.commit();

			responseData = {
				title: 'Success Delete',
				message: 'Book Unpublished Successfully',
				icon: 'success',
				bookObjects: bookObjects,
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
					message: 'Book details you want to update does not exist.',
			};
	}

	res.send(responseData);
};