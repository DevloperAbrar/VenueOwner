const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { User } = require("../database/models");
const { AppError } = require("./error.middleware");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No authentication token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwt.secret);

    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      throw new AppError("User not found or inactive", 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new AppError("Invalid or expired token", 401));
    }
    next(error);
  }
}

module.exports = { authenticate };