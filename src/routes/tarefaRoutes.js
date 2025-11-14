const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');
const autenticar = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validateRequest');
const { tarefaSchema } = require('../validations/tarefaValidation');

// Aplica autenticação em todas as rotas
router.use(autenticar);

// Rotas de Tarefas com validação Joi
router.post('/', validar(tarefaSchema), tarefaController.criarTarefa);
router.put('/:id', validar(tarefaSchema), tarefaController.atualizarTarefa);

router.get('/', tarefaController.listarTarefas);
router.get('/:id', tarefaController.buscarTarefa);
router.delete('/:id', tarefaController.deletarTarefa);

module.exports = router;

