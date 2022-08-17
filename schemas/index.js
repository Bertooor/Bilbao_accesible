'use strict';

const Joi = require('joi');

const registrationSchema = Joi.object().keys({
  name: Joi.string().max(100),
  email: Joi.string().required().email().max(100),
  avatar: Joi.string().max(50),
  password: Joi.string()
    .required()
    .min(6)
    .max(20)
    .error(new Error(`La contraseña debe tener entre 6 y 20 caracteres`)),
});

module.exports = registrationSchema;
