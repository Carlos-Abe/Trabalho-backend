const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
        nome: 'FreeTech API',
        versão: '1.0.0',
        mensagem: 'Bem-vindo à API FreeTech'
    });
});

module.exports = router;
