var jwt = require("jsonwebtoken");
const validateUser = (req, res, next) => {
  try {
    const token = req.cookies;

    if (token.acces_token) {
      jwt.verify(
        token.acces_token,
        process.env.JWT_KEY,
        function (err, decoded) {
          if (err) {
            req.user = null;
            next();
          }

          if (decoded.data) {
            req.user = decoded.data;
            next();
          }
        }
      );
    } else {
      req.user = null;
      next();
    }
  } catch (error) {
    res.status(500).send("Serverside  error");
  }
};

module.exports = validateUser;
