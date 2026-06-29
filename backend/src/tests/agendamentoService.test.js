require("dotenv").config();

jest.mock("../logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const { Pool } = require("pg");

let db;

beforeAll(async () => {
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  await db.query(`
    CREATE TABLE IF NOT EXISTS clientes_test (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS barbeiros_test (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      especialidade TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS servicos_test (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      preco DECIMAL(10,2) NOT NULL,
      duracao_minutos INTEGER NOT NULL,
      ativo BOOLEAN NOT NULL DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS agendamentos_test (
      id SERIAL PRIMARY KEY,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmado',
      cliente_id INTEGER NOT NULL REFERENCES clientes_test(id),
      barbeiro_id INTEGER NOT NULL REFERENCES barbeiros_test(id),
      servico_id INTEGER NOT NULL REFERENCES servicos_test(id)
    );
  `);

  await db.query(`INSERT INTO clientes_test (nome, telefone) VALUES ($1, $2)`, [
    "Lucas",
    "47 99999-0000",
  ]);
  await db.query(
    `INSERT INTO barbeiros_test (nome, especialidade) VALUES ($1, $2)`,
    ["João", "Corte e Barba"],
  );
  await db.query(
    `INSERT INTO servicos_test (nome, preco, duracao_minutos) VALUES ($1, $2, $3)`,
    ["Corte", 35.0, 30],
  );
});

afterAll(async () => {
  await db.query(`
    DROP TABLE IF EXISTS agendamentos_test;
    DROP TABLE IF EXISTS servicos_test;
    DROP TABLE IF EXISTS barbeiros_test;
    DROP TABLE IF EXISTS clientes_test;
  `);
  await db.end();
});

async function criarAgendamentoTest(dados) {
  const { clienteId, barbeiroId, data, horario, servicoId } = dados;

  if (!clienteId || !barbeiroId || !data || !horario || !servicoId) {
    throw new Error("Todos os campos são obrigatórios");
  }

  const servico = await db.query(
    `SELECT id, ativo FROM servicos_test WHERE id = $1`,
    [servicoId],
  );

  if (servico.rows.length === 0 || !servico.rows[0].ativo) {
    throw new Error("Serviço não encontrado ou inativo");
  }

  const existente = await db.query(
    `SELECT id FROM agendamentos_test WHERE barbeiro_id = $1 AND data = $2 AND horario = $3`,
    [barbeiroId, data, horario],
  );

  if (existente.rows.length > 0) {
    throw new Error("Barbeiro já possui agendamento nesse horário");
  }

  const resultado = await db.query(
    `INSERT INTO agendamentos_test (cliente_id, barbeiro_id, data, horario, status, servico_id)
     VALUES ($1, $2, $3, $4, 'confirmado', $5) RETURNING id`,
    [clienteId, barbeiroId, data, horario, servicoId],
  );

  return {
    id: resultado.rows[0].id,
    mensagem: "Agendamento criado com sucesso!",
  };
}

async function listarAgendamentosTest() {
  const resultado = await db.query(`
    SELECT
      a.id, a.data, a.horario, a.status,
      c.nome AS "nomeCliente",
      b.nome AS "nomeBarbeiro",
      s.nome AS "nomeServico"
    FROM agendamentos_test a
    JOIN clientes_test c ON a.cliente_id = c.id
    JOIN barbeiros_test b ON a.barbeiro_id = b.id
    JOIN servicos_test s ON a.servico_id = s.id
  `);
  return resultado.rows;
}

async function cancelarAgendamentoTest(id) {
  const agendamento = await db.query(
    `SELECT id, status FROM agendamentos_test WHERE id = $1`,
    [id],
  );

  if (agendamento.rows.length === 0) {
    throw new Error("Agendamento não encontrado");
  }

  if (agendamento.rows[0].status === "cancelado") {
    throw new Error("Agendamento já está cancelado");
  }

  await db.query(
    `UPDATE agendamentos_test SET status = 'cancelado' WHERE id = $1`,
    [id],
  );

  return { mensagem: "Agendamento cancelado com sucesso!" };
}

describe("criarAgendamento", () => {
  test("deve criar um agendamento com dados válidos", async () => {
    const resultado = await criarAgendamentoTest({
      clienteId: 1,
      barbeiroId: 1,
      data: "2026-06-01",
      horario: "10:00",
      servicoId: 1,
    });

    expect(resultado.mensagem).toBe("Agendamento criado com sucesso!");
    expect(resultado.id).toBeDefined();
  });

  test("deve lançar erro se campos obrigatórios estiverem faltando", async () => {
    await expect(
      criarAgendamentoTest({
        clienteId: 1,
        barbeiroId: 1,
        data: "2026-06-01",
      }),
    ).rejects.toThrow("Todos os campos são obrigatórios");
  });

  test("deve lançar erro se barbeiro já tiver agendamento no horário", async () => {
    await criarAgendamentoTest({
      clienteId: 1,
      barbeiroId: 1,
      data: "2026-06-01",
      horario: "11:00",
      servicoId: 1,
    });

    await expect(
      criarAgendamentoTest({
        clienteId: 1,
        barbeiroId: 1,
        data: "2026-06-01",
        horario: "11:00",
        servicoId: 1,
      }),
    ).rejects.toThrow("Barbeiro já possui agendamento nesse horário");
  });
});

describe("listarAgendamentos", () => {
  test("deve retornar uma lista de agendamentos", async () => {
    const agendamentos = await listarAgendamentosTest();
    expect(Array.isArray(agendamentos)).toBe(true);
    expect(agendamentos.length).toBeGreaterThan(0);
  });
});

describe("cancelarAgendamento", () => {
  test("deve cancelar um agendamento existente", async () => {
    const agendamento = await criarAgendamentoTest({
      clienteId: 1,
      barbeiroId: 1,
      data: "2026-06-02",
      horario: "14:00",
      servicoId: 1,
    });

    const resultado = await cancelarAgendamentoTest(agendamento.id);
    expect(resultado.mensagem).toBe("Agendamento cancelado com sucesso!");
  });

  test("deve lançar erro se agendamento não existir", async () => {
    await expect(cancelarAgendamentoTest(9999)).rejects.toThrow(
      "Agendamento não encontrado",
    );
  });

  test("deve lançar erro se agendamento já estiver cancelado", async () => {
    const agendamento = await criarAgendamentoTest({
      clienteId: 1,
      barbeiroId: 1,
      data: "2026-06-03",
      horario: "15:00",
      servicoId: 1,
    });

    await cancelarAgendamentoTest(agendamento.id);

    await expect(cancelarAgendamentoTest(agendamento.id)).rejects.toThrow(
      "Agendamento já está cancelado",
    );
  });
});
