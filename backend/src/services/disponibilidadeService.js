const dbReal = require('../database/database');

const HORARIO_INICIO = '09:00';
const HORARIO_FIM = '18:00';
const INTERVALO_MINUTOS = 30;

function horaParaMinutos(hora) {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

function minutosParaHora(minutos) {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function gerarTodosHorarios() {
  const horarios = [];
  const inicio = horaParaMinutos(HORARIO_INICIO);
  const fim = horaParaMinutos(HORARIO_FIM);

  for (let minutos = inicio; minutos < fim; minutos += INTERVALO_MINUTOS) {
    horarios.push(minutosParaHora(minutos));
  }

  return horarios;
}

async function listarHorariosDisponiveis(barbeiroId, data, db = dbReal) {
  if (!barbeiroId || !data) {
    throw new Error('Barbeiro e data são obrigatórios');
  }

  const resultado = await db.query(`
    SELECT
      agendamentos.horario,
      servicos.duracao_minutos
    FROM agendamentos
    JOIN servicos ON agendamentos.servico_id = servicos.id
    WHERE agendamentos.barbeiro_id = $1
    AND agendamentos.data = $2
    AND agendamentos.status = 'confirmado'
  `, [barbeiroId, data]);

  const horariosOcupados = new Set();

  resultado.rows.forEach(agendamento => {
    const inicioMinutos = horaParaMinutos(agendamento.horario);
    const duracaoMinutos = agendamento.duracao_minutos;

    for (let minutos = inicioMinutos; minutos < inicioMinutos + duracaoMinutos; minutos += INTERVALO_MINUTOS) {
      horariosOcupados.add(minutosParaHora(minutos));
    }
  });

  const todosHorarios = gerarTodosHorarios();

  return todosHorarios.map(horario => ({
    horario,
    disponivel: !horariosOcupados.has(horario)
  }));
}

module.exports = { listarHorariosDisponiveis };
