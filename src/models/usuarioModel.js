const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: [true, 'Nome é obrigatório'],
    trim: true,        // remove os espaços em branco do início e do fim de uma string.
    
    minlength: [3, 'Nome deve ter pelo menos 3 caracteres'],
    maxlength: [100, 'Nome não pode exceder 100 caracteres']
},
  email: { 
    type: String, 
    required: [true, 'E-mail é obrigatório'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, informe um e-mail válido']
},
  senha: { 
    type: String, 
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  perfil: { 
    type: String, 
    enum: ['freelancer', 'empresa'], 
    required: [true, 'Perfil é obrigatório'] 
  }
}, {
  timestamps: true // Cria createdAt e updatedAt automaticamente
});

//  MIDDLEWARE: Criptografa senha antes de atualizar (se a senha foi modificada)
usuarioSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  
  if (update.senha) {
    try {
      const saltRounds = 12;
      const salt = await bcrypt.genSalt(saltRounds);
      update.senha = await bcrypt.hash(update.senha, salt);
      this.setUpdate(update);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// MÉTODO: Comparar senhas (para uso no login)
usuarioSchema.methods.compararSenha = async function(senhaDigitada) {
  try {
    return await bcrypt.compare(senhaDigitada, this.senha);
  } catch (error) {
    throw new Error('Erro ao comparar senhas');
  }
};

// Remove a senha do JSON de retorno por segurança
usuarioSchema.methods.toJSON = function() {
  const usuario = this.toObject();
  delete usuario.senha;
  return usuario;
};

// Índices para melhor performance
usuarioSchema.index({ perfil: 1 });

module.exports = mongoose.model('Usuario', usuarioSchema);
