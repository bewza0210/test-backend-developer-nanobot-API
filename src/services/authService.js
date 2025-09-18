const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

exports.createUser = async ({ name, username, email, password }) => {
  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    throw new ApiError('Username already exists', 400);
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new ApiError('Email already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  return {
    isError: false,
    message: "User created successfully"
  };
};

exports.login = async ( _username, _password ) => {
  const user = await User.findOne({ where: { username: _username } });
  if (!user) {
    throw new ApiError('[0] Invalid username or password', 401);
  }

  const isMatch = await bcrypt.compare(_password, user.password);
  if (!isMatch) {
    throw new ApiError('[1] Invalid username or password' , 401);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken, user };
}

exports.refresh = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return { accessToken: newAccessToken };
  } catch (err) {
    throw new ApiError(401, 'Invalid refresh token');
  }
};

exports.profile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'username', 'email', 'isActive', 'lastLoginAt']
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
}