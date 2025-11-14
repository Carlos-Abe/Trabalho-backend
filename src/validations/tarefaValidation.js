const Joi = require('joi');

const tarefaSchema = Joi.object({
  titulo: Joi.string().min(3).required().messages({
    'string.min': 'O título deve ter no mínimo 3 caracteres.',
    'any.required': 'O título é obrigatório.',
  }),
  descricao: Joi.string().allow('').max(500).messages({
    'string.max': 'A descrição pode ter no máximo 500 caracteres.',
  }),
  status: Joi.string()
    .valid('pendente', 'em andamento', 'concluída')
    .default('pendente')
    .messages({
      'any.only': 'O status deve ser "pendente", "em andamento" ou "concluída".',
    }),
  responsavel: Joi.string().min(3).allow('').optional().messages({
    'string.min': 'O responsável deve ter no mínimo 3 caracteres.',
  }),
});

module.exports = {  tarefaSchema };
