const Joi = require('joi');
const j2s = require('joi-to-swagger');

const userJoiSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});
const { swagger: userSwaggerSchema } = j2s(userJoiSchema);

const changePasswordJoiSchema = Joi.object({
  oldPassword: Joi.string().min(6).max(128).required(),
  newPassword: Joi.string().min(6).max(128).required(),
});
const { swagger: changePasswordSwaggerSchema } = j2s(changePasswordJoiSchema);

const loginJoiSchema = Joi.object({
  username: Joi.string().min(6).max(128).required(),
  password: Joi.string().min(6).max(128).required(),
});
const { swagger: loginSwaggerSchema } = j2s(loginJoiSchema);

module.exports = {
  user: {
    joiSchema: userJoiSchema,
    swaggerSchema: userSwaggerSchema,
  },
  changePassword: {
    joiSchema: changePasswordJoiSchema,
    swaggerSchema: changePasswordSwaggerSchema
  },
  login: {
    joiSchema: loginJoiSchema,
    swaggerSchema: loginSwaggerSchema
  }
};
