const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController');

// Rotas CRUD
router.post('/', projetoController.criarProjeto);
router.get('/', projetoController.listarProjetos);
router.get('/:id', projetoController.obterProjeto);
router.put('/:id', projetoController.atualizarProjeto);
router.delete('/:id', projetoController.deletarProjeto);

module.exports = router;
