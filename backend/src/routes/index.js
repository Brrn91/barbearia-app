const express = require('express');
const router = express.Router();

const agendamentoController = require('../controllers/agendamentoController');
const clienteController = require('../controllers/clienteController');
const barbeiroController = require('../controllers/barbeiroController');

router.get('/health', (request, response) => {
  response.json({
    status: 'ok',
    message: 'API da Barbearia funcionando!',
  });
});

router.post('/clientes', clienteController.criarCliente);
router.get('/clientes', clienteController.listarClientes)

router.post('/barbeiros', barbeiroController.criarBarbeiro);
router.get('/barbeiros', barbeiroController.listarBarbeiros);

router.post('/agendamentos', agendamentoController.criarAgendamento);
router.get('/agendamentos', agendamentoController.listarAgendamentos);
router.patch('/agendamentos/:id/cancelar', agendamentoController.cancelarAgendamentos);

module.exports = router;
