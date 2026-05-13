const agendamentoService = require("../services/agendamentoService");

function criarAgendamento(request, response) {
  try {
    const resultado = agendamentoService.criarAgendamento(request.body);
    response.status(201).json(resultado);
  } catch (erro) {
    response.status(400).json({ mensagem: erro.message });
  };
};

function listarAgendamentos(request, response) {
  try {
    const agendamentos = agendamentoService.listarAgendamentos();
    response.status(200).json(agendamentos);
  } catch (erro) {
    response.status(500).json({ mensagem: erro.message});
  };
};

function cancelarAgendamentos(request, response) {
  try {
    const { id } = request.params;
    const resultado = agendamentoService.cancelarAgendamentos(id);
    response.status(200).json(resultado);
  } catch (erro) {
    response.status(400).json({ mensagem: erro.message});
  };
};

module.exports = { criarAgendamento, listarAgendamentos, cancelarAgendamentos };
