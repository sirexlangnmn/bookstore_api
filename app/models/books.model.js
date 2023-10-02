module.exports = (sequelize, Sequelize) => {
  // comment
  // user_uuid = author/user
  // uuid = book uuid
  //
  // status
  //    1 = published book
  //    2 = unpublish by owner (DELETE)
  const Books = sequelize.define('books', {
      title : {
          type: Sequelize.STRING,
      },
      description : {
          type: Sequelize.STRING,
      },
      cover_image_url : {
          type: Sequelize.STRING,
      },
      price : {
          type: Sequelize.STRING,
      },
      uuid: {
          type: Sequelize.STRING,
      },
      user_uuid: {
          type: Sequelize.STRING,
      },
      status: {
          type: Sequelize.TINYINT,
      },
  });

  return Books;
};
