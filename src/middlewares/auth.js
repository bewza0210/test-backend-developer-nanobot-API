const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

exports.me = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next(new ApiError(401, 'No token provided'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};