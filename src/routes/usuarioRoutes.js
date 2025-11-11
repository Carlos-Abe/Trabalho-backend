const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarioModel');

// Rota para criar novo usuário
router.post('/', async (req, res) => {
    try {

        const { nome, email, senha, perfil } = req.body;

        // Validação dos campos obrigatórios
        if (!nome || !email || !senha || !perfil) {
        return res.status(400).json({ 
            erro: 'Todos os campos são obrigatórios: nome, email, senha, perfil' 
        });
        };

        const novoUsuario = new Usuario({ 
            nome,
            email,
            senha, // Será criptografada automaticamente
            perfil
        });        

        const usuarioSalvo = await novoUsuario.save();
        res.status(201).json({ 
            mensagem: 'Usuário criado com sucesso',
            usuario: usuarioSalvo
        });

    } catch (err) {
       if (err.code === 11000)  {
            return res.status(400).json({ erro: 'E-mail já cadastrado' })
       }

       if (err.name === 'ValidationError') {
            const erros = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({ erro: erros });
        }

        res.status(500).json({ 
            erro: 'Erro interno do servidor',
            detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
         })
    };
});

module.exports = router;
