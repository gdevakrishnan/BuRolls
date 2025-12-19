const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization") || req.header("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, secret);
    // Support tokens signed as either { user: {...} } or flat { id, role, ... }
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
