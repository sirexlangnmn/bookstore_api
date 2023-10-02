module.exports = (sequelize, Sequelize) => {
  // comment
  // type
  //    1 = normal user
  //    2 = admin
  // status
  //    1 = email verified
  const Users_accounts = sequelize.define('users_accounts', {
      username: {
          type: Sequelize.STRING,
      },
      email_address: {
          type: Sequelize.STRING,
      },
      password: {
          type: Sequelize.STRING,
      },
      type: {
          type: Sequelize.TINYINT,
      },
      status: {
          type: Sequelize.TINYINT,
      },
      verification_code: {
          type: Sequelize.STRING,
      },
      uuid: {
          type: Sequelize.STRING,
      },
  });

  return Users_accounts;
};
