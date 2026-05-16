const dbReal = require('../database/database');
const logger = require('../logger');

function criarAgendamento(dados, db = dbReal) {
  const { clienteId, barbeiroId, data, horario, servico } = dados;

  if (!clienteId || !barbeiroId || !data || !horario || !servico) {
    logger.warn('Tentativa de agendamento com campos faltando');
    throw new Error('Todos os campos são obrigatórios');
  }

  const agendamentoExistente = db.prepare(`
    SELECT id FROM agendamentos
    WHERE barbeiro_id = ? AND data = ? AND horario = ?
  `).get(barbeiroId, data, horario);

  if (agendamentoExistente) {
    logger.warn(`Tentativa de agendamento duplicado - barbeiro ${barbeiroId} às ${horario} em ${data}`);
    throw new Error('Barbeiro já possui agendamento nesse horário');
  }

  const resultado = db.prepare(`
    INSERT INTO agendamentos (cliente_id, barbeiro_id, data, horario, servico, status)
    VALUES (?, ?, ?, ?, ?, 'confirmado')
  `).run(clienteId, barbeiroId, data, horario, servico);

  logger.info(`Agendamento criado - id: ${resultado.lastInsertRowid}, barbeiro: ${barbeiroId}, data: ${data} às ${horario}`);

  return { id: resultado.lastInsertRowid, mensagem: 'Agendamento criado com sucesso!' };
}

function listarAgendamentos(db = dbReal) {
  const agendamentos = db.prepare(`
    SELECT
      agendamentos.id,
      agendamentos.data,
      agendamentos.horario,
      agendamentos.servico,
      agendamentos.status,
      clientes.nome AS nomeCliente,
      barbeiros.nome AS nomeBarbeiro
    FROM agendamentos
    JOIN clientes ON agendamentos.cliente_id = clientes.id
    JOIN barbeiros ON agendamentos.barbeiro_id = barbeiros.id
  `).all();

  logger.info(`Listagem de agendamentos - ${agendamentos.length} registro(s) retornado(s)`);

  return agendamentos;
}

function cancelarAgendamento(id, db = dbReal) {
  const agendamento = db.prepare(`
    SELECT id, status FROM agendamentos WHERE id = ?
  `).get(id);

  if (!agendamento) {
    logger.warn(`Tentativa de cancelar agendamento inexistente - id: ${id}`);
    throw new Error('Agendamento não encontrado');
  }

  if (agendamento.status === 'cancelado') {
    logger.warn(`Tentativa de cancelar agendamento já cancelado - id: ${id}`);
    throw new Error('Agendamento já está cancelado');
  }

  db.prepare(`
    UPDATE agendamentos SET status = 'cancelado' WHERE id = ?
  `).run(id);

  logger.info(`Agendamento cancelado - id: ${id}`);

  return { mensagem: 'Agendamento cancelado com sucesso!' };
}

module.exports = { criarAgendamento, listarAgendamentos, cancelarAgendamento };
