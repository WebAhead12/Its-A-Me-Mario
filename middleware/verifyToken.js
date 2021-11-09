const jwt = require("jsonwebtoken");
const SECRET = "asdjgasgdhbrkj%&$*t";

function verifyToken(req, res, next) {
  const token = req.cookies.username;
  if (token) {
    const username = jwt.verify(token, SECRET);
    req.username = username;
  }
  next();
}

module.exports = verifyToken;
