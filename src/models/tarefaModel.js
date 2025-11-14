const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'O título é obrigatório.'],
    trim: true,
  },
  descricao: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['pendente', 'em andamento', 'concluída'],
    default: 'pendente',
  },
  responsavel: {
    type: String,
    trim: true,
    default: '',
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
}, {
  timestamps: true,
});
const Tarefa = mongoose.model('Tarefa', tarefaSchema);
		module.exports = Tarefa;
