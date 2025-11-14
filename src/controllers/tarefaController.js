const Tarefa = require('../models/tarefaModel');
const mongoose = require('mongoose');

// Criar nova tarefa
async function criarTarefa(req, res) {
  try {
    console.log('Usuário autenticado:', req.usuario);
    const { titulo, descricao, status } = req.body;
    
    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    const tarefa = new Tarefa({
      titulo: titulo.trim(),
      descricao: descricao || '',
      status: status || 'pendente',
      usuario: req.usuario.id
    });

    await tarefa.save();
    res.status(201).json(tarefa);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Listar todas as tarefas do usuário
async function listarTarefas(req, res) {
  try {
    console.log('Usuário autenticado:', req.usuario);
    const tarefas = await Tarefa.find({ usuario: req.usuario.id });
    res.status(200).json(tarefas);
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Buscar tarefa por ID
async function buscarTarefa(req, res) {
  try {
    console.log('Usuário autenticado:', req.usuario);
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const tarefa = await Tarefa.findOne({ _id: id, usuario: req.usuario.id });

    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.status(200).json(tarefa);
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Atualizar tarefa
async function atualizarTarefa(req, res) {
  try {
    console.log('Usuário autenticado:', req.usuario);
    const { id } = req.params;
    const { titulo, descricao, status } = req.body;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const tarefa = await Tarefa.findOne({ _id: id, usuario: req.usuario.id });

    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    if (titulo) tarefa.titulo = titulo;
    if (descricao) tarefa.descricao = descricao;
    if (status) tarefa.status = status;

    await tarefa.save();
    res.status(200).json(tarefa);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

 // Deletar tarefa 
async function deletarTarefa(req, res) {
  try {
    console.log('Usuário autenticado:', req.usuario);
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const tarefa = await Tarefa.findOneAndDelete({
      _id: id,
      usuario: req.usuario.id
    });

    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { criarTarefa,  listarTarefas,  buscarTarefa,  atualizarTarefa,  deletarTarefa };


