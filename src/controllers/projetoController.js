const Projeto = require('../models/projetoModel');

// Criar novo projeto
async function criarProjeto(req, res) {
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
}

// Listar todos os projetos
async function listarProjetos(req, res) {
  try {
    const projetos = await Projeto.find();
    res.status(200).json(projetos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// Buscar projeto por ID
async function obterProjeto(req, res) {
  try {
    const projeto = await Projeto.findById(req.params.id);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }
    res.status(200).json(projeto);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// Atualizar projeto
async function atualizarProjeto(req, res) {
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
}

// Deletar projeto
async function deletarProjeto(req, res) {
  try {
    const projetoDeletado = await Projeto.findByIdAndDelete(req.params.id);
    if (!projetoDeletado) {
      return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }
    res.status(200).json({ mensagem: 'Projeto removido com sucesso.' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// Exporta todas as funções juntas
module.exports = {
  criarProjeto,
  listarProjetos,
  obterProjeto,
  atualizarProjeto,
  deletarProjeto
};
