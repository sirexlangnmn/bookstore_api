const CryptoJS = require('crypto-js');
const JWT_SECRET = process.env.JWT_SECRET;
const db = require('../../models');

const Users = db.users;
const Op = db.Sequelize.Op;

const decryptSessionUuid = (encryptedSessionUuid) => {
  const bytes = CryptoJS.AES.decrypt(encryptedSessionUuid, JWT_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const getUserByUuid = async (uuid) => {
  try {
    const user = await Users.findAll({ where: { uuid } });
    return user;
  } catch (err) {
    throw err.message || 'Some error occurred while retrieving user.';
  }
};



exports.isActive = async (req, res, next) => {
  const { session } = req;

  if (!session || !session.user) {
    return res.status(401).json({ message: 'No valid session data available' });
  }

  const encryptedSessionUuid = req.session.user.uuid;
  const originalSessionUuid = decryptSessionUuid(encryptedSessionUuid);

  if (!originalSessionUuid) {
    return res.status(401).json({ message: 'Invalid session data' });
  }

  try {
    const user = await getUserByUuid(originalSessionUuid);
    if (user[0].status === 1) {
      next();
    } else {
      // throw new Error("Access Denied! Not Active User. Unauthorized To Publish Book");
      res.status(500).json({ message: 'Access Denied! Not Active User. Unauthorized To Publish Book' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
