const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

// Criar novo usuário
exports.criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, email, senha e perfil.' });
    }

    // Verifica se o e-mail já está cadastrado
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaCriptografada,
      perfil,
    });

    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário criado com sucesso!', usuario: novoUsuario });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar usuário: ' + erro.message });
  }
};

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha'); // Oculta o campo senha
    res.status(200).json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar usuários: ' + erro.message });
  }
};

// Obter usuário por ID
exports.obterUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id).select('-senha');
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    res.status(200).json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao obter usuário: ' + erro.message });
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, perfil } = req.body;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (perfil) usuario.perfil = perfil;
    if (senha) usuario.senha = await bcrypt.hash(senha, 10);

    await usuario.save();
    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso!', usuario });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário: ' + erro.message });
  }
};

// Excluir usuário
exports.excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Usuário excluído com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao excluir usuário: ' + erro.message });
  }
};
