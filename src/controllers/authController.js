require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel');

async function registrar(req, res) {
  try {
    const { nome, email, senha, perfil } = req.body;

    // Validações básicas
    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({ 
        erro: 'Todos os campos são obrigatórios: nome, email, senha, perfil' 
      });
    }

    // Verifica se já existe um usuário com esse email
    const emailExistente = await Usuario.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Valida se o perfil é válido
    if (!['freelancer', 'empresa'].includes(perfil)) {
      return res.status(400).json({ 
        erro: 'Perfil deve ser "freelancer" ou "empresa"' 
      });
    }

    // Criptografa a senha (o middleware do modelo também fará isso, mas fazemos aqui para segurança)
    const senhaCriptografada = await bcrypt.hash(senha, 12);

    // Cria o usuário
    const novoUsuario = await Usuario.create({ 
      nome, 
      email, 
      senha: senhaCriptografada, 
      perfil 
    });

    // Gera token JWT
    const token = jwt.sign({ 
      id: novoUsuario._id, 
      perfil: novoUsuario.perfil 
    }, process.env.JWT_SECRET, { 
      expiresIn: '1d' 
    });

    // Retorna os dados do usuário (o toJSON() do modelo já remove a senha)
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      usuario: novoUsuario // Já vem sem a senha devido ao toJSON()
    });

  } catch (err) {
    // Captura erros de validação do Mongoose
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        erro: 'Dados inválidos', 
        detalhes: errors 
      });
    }
    
    // Erro de duplicidade de email
    if (err.code === 11000) {
      return res.status(400).json({ 
        erro: 'Email já cadastrado' 
      });
    }

    res.status(500).json({ 
      erro: 'Erro interno ao registrar usuário', 
      detalhes: err.message 
    });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({ 
        erro: 'Email e senha são obrigatórios' 
      });
    }

    // Busca usuário incluindo a senha (já que o toJSON() remove)
    const usuario = await Usuario.findOne({ email }).select('+senha');
    
    if (!usuario) {
      return res.status(404).json({ 
        erro: 'Usuário não encontrado' 
      });
    }

    // Usa o método do modelo para comparar senhas
    const senhaValida = await usuario.compararSenha(senha);
    
    if (!senhaValida) {
      return res.status(401).json({ 
        erro: 'Senha inválida' 
      });
    }

    // Gera token JWT
    const token = jwt.sign({ 
      id: usuario._id, 
      perfil: usuario.perfil 
    }, process.env.JWT_SECRET, { 
      expiresIn: '1d' 
    });

    // Busca o usuário novamente sem a senha para retornar
    const usuarioSemSenha = await Usuario.findById(usuario._id);

    res.json({ 
      message: 'Login realizado com sucesso',
      token,
      usuario: usuarioSemSenha
    });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ 
      erro: 'Erro interno ao fazer login', 
      detalhes: err.message 
    });
  }
}

module.exports = { registrar, login };
