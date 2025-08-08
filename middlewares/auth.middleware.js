const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    logger.warn("Unauthorized access attempt – no token");
    return res.status(401).json({ message: "No token provided" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    logger.warn("Invalid token attempt: %s", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

const allowRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };

module.exports = { protect, allowRoles };
