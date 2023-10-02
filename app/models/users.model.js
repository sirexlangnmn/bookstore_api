module.exports = (sequelize, Sequelize) => {
	// comment
	// status
	//    1 = able to publish
	//    2 = unable to publish
	const Users = sequelize.define('users', {
		author_pseudonym: {
			type: Sequelize.STRING,
		},
		status: {
			type: Sequelize.TINYINT,
		},
		uuid: {
			type: Sequelize.STRING,
		},
	});

	return Users;
};
