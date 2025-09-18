const { User } = require('../models');
const bcrypt = require('bcrypt');
const ApiError = require('../utils/ApiError');

exports.getUser = async (id = 0, body = {}) => {
  if (id && id > 0) {
    const user = await User.findByPk(id, {attributes: { exclude: ['password'] }});
    if (!user) {
      throw new ApiError(`User not found`, 404);
    }
    return user;
  } else {
    const whereCondition = {};

    if (body.isActive !== undefined) whereCondition.isActive = body.isActive;
    if (body.username) whereCondition.username = { [Op.like]: `%${body.username}%` };
    if (body.email) whereCondition.email = { [Op.like]: `%${body.email}%` };

    const users = await User.findAll({
      where: whereCondition,
      attributes: { exclude: ['password'] }
    });

    return users;
  }
};

exports.updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  await user.update(data);
  return user;
};

exports.changePassword = async (id, passwordOld, passwordNew) => {
  const user = await User.findByPk(id);
  if (!user) throw new ApiError(`User not found`, 404);

  const isMatch = await bcrypt.compare(passwordOld, user.password);
  if (!isMatch) throw new ApiError('Old password is incorrect', 400);

  const hashedPassword = await bcrypt.hash(passwordNew, 10);

  user.password = hashedPassword;
  await user.save();

  const { password, ...userData } = user.toJSON();
  return userData;
};

exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new ApiError(`User not found`, 404);
  await user.destroy({force: true});
  return true;
};
