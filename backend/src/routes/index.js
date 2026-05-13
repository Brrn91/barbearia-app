const express = require('express');
const router = express.Router();

const agendamentoController = require('../controllers/agendamentoController');

router.get('/health', (request, response) => {
  response.json({
    status: 'ok',
    message: 'API da Barbearia funcionando!',
  });
});

router.post('/agendamentos', agendamentoController.criarAgendamento);
router.get('/agendamentos', agendamentoController.listarAgendamentos);
router.patch('/agendamentos/:id/cancelar', agendamentoController.cancelarAgendamentos);

module.exports = router;
