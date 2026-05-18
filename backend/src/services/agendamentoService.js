const dbReal = require('../database/database');
const logger = require('../logger');

async function criarAgendamento(dados, db = dbReal) {
  const { clienteId, barbeiroId, data, horario, servico } = dados;

  if (!clienteId || !barbeiroId || !data || !horario || !servico) {
    logger.warn('Tentativa de agendamento com campos faltando');
    throw new Error('Todos os campos são obrigatórios');
  }

  const agendamentoExistente = await db.query(
    `SELECT id FROM agendamentos WHERE barbeiro_id = $1 AND data = $2 AND horario = $3`,
    [barbeiroId, data, horario]
  );

  if (agendamentoExistente.rows.length > 0) {
    logger.warn(`Tentativa de agendamento duplicado - barbeiro ${barbeiroId} às ${horario} em ${data}`);
    throw new Error('Barbeiro já possui agendamento nesse horário');
  }

  const resultado = await db.query(
    `INSERT INTO agendamentos (cliente_id, barbeiro_id, data, horario, servico, status)
     VALUES ($1, $2, $3, $4, $5, 'confirmado') RETURNING id`,
    [clienteId, barbeiroId, data, horario, servico]
  );

  const id = resultado.rows[0].id;
  logger.info(`Agendamento criado - id: ${id}, barbeiro: ${barbeiroId}, data: ${data} às ${horario}`);

  return { id, mensagem: 'Agendamento criado com sucesso!' };
}

async function listarAgendamentos(db = dbReal) {
  const resultado = await db.query(`
    SELECT
      agendamentos.id,
      agendamentos.data,
      agendamentos.horario,
      agendamentos.servico,
      agendamentos.status,
      clientes.nome AS "nomeCliente",
      barbeiros.nome AS "nomeBarbeiro"
    FROM agendamentos
    JOIN clientes ON agendamentos.cliente_id = clientes.id
    JOIN barbeiros ON agendamentos.barbeiro_id = barbeiros.id
  `);

  logger.info(`Listagem de agendamentos - ${resultado.rows.length} registro(s) retornado(s)`);

  return resultado.rows;
}

async function cancelarAgendamento(id, db = dbReal) {
  const agendamento = await db.query(
    `SELECT id, status FROM agendamentos WHERE id = $1`,
    [id]
  );

  if (agendamento.rows.length === 0) {
    logger.warn(`Tentativa de cancelar agendamento inexistente - id: ${id}`);
    throw new Error('Agendamento não encontrado');
  }

  if (agendamento.rows[0].status === 'cancelado') {
    logger.warn(`Tentativa de cancelar agendamento já cancelado - id: ${id}`);
    throw new Error('Agendamento já está cancelado');
  }

  await db.query(
    `UPDATE agendamentos SET status = 'cancelado' WHERE id = $1`,
    [id]
  );

  logger.info(`Agendamento cancelado - id: ${id}`);

  return { mensagem: 'Agendamento cancelado com sucesso!' };
}

module.exports = { criarAgendamento, listarAgendamentos, cancelarAgendamento };
