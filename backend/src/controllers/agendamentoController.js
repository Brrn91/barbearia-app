const agendamentoService = require("../services/agendamentoService");

async function criarAgendamento(request, response) {
  try {
    const resultado = await agendamentoService.criarAgendamento(request.body);
    response.status(201).json(resultado);
  } catch (erro) {
    response.status(400).json({ mensagem: erro.message });
  }
}

async function listarAgendamentos(request, response) {
  try {
    const agendamentos = await agendamentoService.listarAgendamentos();
    response.status(200).json(agendamentos);
  } catch (erro) {
    response.status(500).json({ mensagem: erro.message });
  }
}

async function cancelarAgendamento(request, response) {
  try {
    const { id } = request.params;
    const resultado = await agendamentoService.cancelarAgendamento(id);
    response.status(200).json(resultado);
  } catch (erro) {
    response.status(400).json({ mensagem: erro.message });
  }
}

module.exports = { criarAgendamento, listarAgendamentos, cancelarAgendamento };
