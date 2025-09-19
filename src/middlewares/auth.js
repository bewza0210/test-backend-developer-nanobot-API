const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

exports.me = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ isError: true, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ isError: true, message: 'Invalid or expired token' });
  }
};