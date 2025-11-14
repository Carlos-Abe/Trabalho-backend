const Joi = require('joi');

exports.usuarioSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'O nome é obrigatório.',
    'string.min': 'O nome deve ter no mínimo 3 caracteres.',
    'string.max': 'O nome deve ter no máximo 100 caracteres.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'E-mail inválido.',
    'any.required': 'O e-mail é obrigatório.',
  }),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'A senha deve ter no mínimo 6 caracteres.',
    'any.required': 'A senha é obrigatória.',
  }),
});
