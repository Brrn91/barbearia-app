const dbReal = require('../database/database');
const logger = require('../logger');

function horaParaMinutos(hora) {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

function horariosSobrepostos(inicioA, duracaoA, inicioB, duracaoB) {
  const fimA = inicioA + duracaoA;
  const fimB = inicioB + duracaoB;

  return inicioA < fimB && inicioB < fimA;
}

async function obterClienteId(dados, db) {
  if (dados.usuario?.tipo !== 'cliente') {
    return dados.clienteId;
  }

  const cliente = await db.query(
    `SELECT id FROM clientes WHERE usuario_id = $1`,
    [dados.usuario.id],
  );

  if (cliente.rows.length === 0) {
    throw new Error('Cliente não encontrado para o usuário logado');
  }

  return cliente.rows[0].id;
}

async function criarAgendamento(dados, db = dbReal) {
  const { barbeiroId, data, horario, servicoId } = dados;
  const clienteId = await obterClienteId(dados, db);

  if (!clienteId || !barbeiroId || !data || !horario || !servicoId) {
    logger.warn('Tentativa de agendamento com campos faltando');
    throw new Error('Todos os campos são obrigatórios');
  }

  const servico = await db.query(
    `SELECT id, ativo, duracao_minutos FROM servicos WHERE id = $1`,
    [servicoId]
  );

  if (servico.rows.length === 0 || !servico.rows[0].ativo) {
    throw new Error('Serviço não encontrado ou inativo');
  }

  const agendamentosDoDia = await db.query(
    `SELECT
       agendamentos.horario,
       servicos.duracao_minutos
     FROM agendamentos
     JOIN servicos ON agendamentos.servico_id = servicos.id
     WHERE agendamentos.barbeiro_id = $1
     AND agendamentos.data = $2
     AND agendamentos.status = 'confirmado'`,
    [barbeiroId, data]
  );

  const inicioNovoAgendamento = horaParaMinutos(horario);
  const duracaoNovoAgendamento = servico.rows[0].duracao_minutos;
  const existeConflito = agendamentosDoDia.rows.some((agendamento) =>
    horariosSobrepostos(
      inicioNovoAgendamento,
      duracaoNovoAgendamento,
      horaParaMinutos(agendamento.horario),
      agendamento.duracao_minutos,
    ),
  );

  if (existeConflito) {
    logger.warn(`Tentativa de agendamento duplicado - barbeiro ${barbeiroId} às ${horario} em ${data}`);
    throw new Error('Barbeiro já possui agendamento nesse período');
  }

  const resultado = await db.query(
    `INSERT INTO agendamentos (cliente_id, barbeiro_id, data, horario, status, servico_id)
     VALUES ($1, $2, $3, $4, 'confirmado', $5) RETURNING id`,
    [clienteId, barbeiroId, data, horario, servicoId]
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
      agendamentos.status,
      clientes.nome AS "nomeCliente",
      barbeiros.nome AS "nomeBarbeiro",
      servicos.nome AS "nomeServico",
      servicos.preco AS "precoServico"
    FROM agendamentos
    JOIN clientes ON agendamentos.cliente_id = clientes.id
    JOIN barbeiros ON agendamentos.barbeiro_id = barbeiros.id
    JOIN servicos ON agendamentos.servico_id = servicos.id
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
