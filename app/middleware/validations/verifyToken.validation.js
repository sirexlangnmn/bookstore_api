const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
function verifyToken(req, res, next) {

  const token = req.cookies.token;
  console.log(token);

  if (token === undefined) {
    return res.json({
      message: "Access Denied! Unauthorized User"
    });
  } else {

    jsonwebtoken.verify(token, JWT_SECRET, (err, authData) => {
      if (err) {
        console.log("Invalid Token...");
        res.json({
          message: "Invalid Token..."
        });

      } else {
        console.log("Valid Token...");
        next();

      }
    })
  }
}

module.exports = verifyToken;