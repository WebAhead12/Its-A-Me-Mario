const jwt = require("jsonwebtoken");
const SECRET = "asdjgasgdhbrkj%&$*t";

function verifyToken(req, res, next) {
  const accountToken = req.cookies.account;
  if (accountToken) {
    const account = jwt.verify(accountToken, SECRET);
    req.account = account;
  }
  next();
}

module.exports = verifyToken;
