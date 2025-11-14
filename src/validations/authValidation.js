const Joi = require('joi');

exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'E-mail inválido.',
    'any.required': 'O e-mail é obrigatório.',
  }),
  senha: Joi.string().required().messages({
    'any.required': 'A senha é obrigatória.',
  }),
});
