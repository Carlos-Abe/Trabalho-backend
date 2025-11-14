const mongoose = require('mongoose');

const projetoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do projeto é obrigatório'],
    trim: true
  },
  cliente: {
    type: String,
    required: [true, 'O nome do cliente é obrigatório'],
    trim: true
  },
  prazo: {
    type: Date,
    required: [true, 'O prazo do projeto é obrigatório']
  },
  status: {
    type: String,
    enum: ['pendente', 'em andamento', 'concluído'],
    default: 'pendente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Projeto', projetoSchema);


const Projeto = require('../models/projetoModel');

// Criar novo projeto
exports.criarProjeto = async (req, res) => {
  try {
    const { nome, cliente, prazo, status } = req.body;

    if (!nome || !cliente || !prazo) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, cliente e prazo.' });
    }

    const novoProjeto = new Projeto({ nome, cliente, prazo, status });
    const projetoSalvo = await novoProjeto.save();
    res.status(201).json(projetoSalvo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// Listar todos os projetos
exports.listarProjetos = async (req, res) => {
  try {
    const projetos = await Projeto.find();
    res.status(200).json(projetos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// Buscar projeto por ID
exports.obterProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findById(req.params.id);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }
    res.status(200).json(projeto);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// Atualizar projeto
exports.atualizarProjeto = async (req, res) => {
  try {
    const { nome, cliente, prazo, status } = req.body;
    const projetoAtualizado = await Projeto.findByIdAndUpdate(
      req.params.id,
      { nome, cliente, prazo, status },
      { new: true, runValidators: true }
    );

    if (!projetoAtualizado) {
      return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }

    res.status(200).json(projetoAtualizado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// Deletar projeto
exports.deletarProjeto = async (req, res) => {
  try {
    const projetoDeletado = await Projeto.findByIdAndDelete(req.params.id);
    if (!projetoDeletado) {
      return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }
    res.status(200).json({ mensagem: 'Projeto removido com sucesso.' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
