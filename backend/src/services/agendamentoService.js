require("dotenv").config();

const { Pool } = require("pg");

const {
  criarAgendamento,
  listarAgendamentos,
  cancelarAgendamento,
} = require("../services/agendamentoService");

let pool;
let client;
let clienteId;
let barbeiroId;
let servicoId;

beforeAll(async () => {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });
  client = await pool.connect();
});

afterAll(async () => {
  client.release();
  await pool.end();
});

beforeEach(async () => {
  await client.query("BEGIN");

  const cliente = await client.query(
    `INSERT INTO clientes (nome, telefone) VALUES ($1, $2) RETURNING id`,
    ["Cliente Teste", "47 90000-0000"],
  );
  clienteId = cliente.rows[0].id;

  const barbeiro = await client.query(
    `INSERT INTO barbeiros (nome, especialidade) VALUES ($1, $2) RETURNING id`,
    ["Barbeiro Teste", "Corte e Barba"],
  );
  barbeiroId = barbeiro.rows[0].id;

  const servico = await client.query(
    `INSERT INTO servicos (nome, preco, duracao_minutos) VALUES ($1, $2, $3) RETURNING id`,
    ["Serviço Teste", 30.0, 30],
  );
  servicoId = servico.rows[0].id;
});

afterEach(async () => {
  await client.query("ROLLBACK");
});

describe("criarAgendamento", () => {
  test("deve criar um agendamento com dados válidos", async () => {
    const resultado = await criarAgendamento(
      {
        clienteId,
        barbeiroId,
        data: "2026-06-01",
        horario: "10:00",
        servicoId,
      },
      client,
    );

    expect(resultado.mensagem).toBe("Agendamento criado com sucesso!");
    expect(resultado.id).toBeDefined();
  });

  test("deve lançar erro se campos obrigatórios estiverem faltando", async () => {
    await expect(
      criarAgendamento({ clienteId, barbeiroId, data: "2026-06-01" }, client),
    ).rejects.toThrow("Todos os campos são obrigatórios");
  });

  test("deve lançar erro se o serviço não existir ou estiver inativo", async () => {
    await expect(
      criarAgendamento(
        {
          clienteId,
          barbeiroId,
          data: "2026-06-01",
          horario: "09:00",
          servicoId: 999999,
        },
        client,
      ),
    ).rejects.toThrow("Serviço não encontrado ou inativo");
  });

  test("deve lançar erro se barbeiro já tiver agendamento no horário", async () => {
    await criarAgendamento(
      {
        clienteId,
        barbeiroId,
        data: "2026-06-01",
        horario: "11:00",
        servicoId,
      },
      client,
    );

    await expect(
      criarAgendamento(
        {
          clienteId,
          barbeiroId,
          data: "2026-06-01",
          horario: "11:00",
          servicoId,
        },
        client,
      ),
    ).rejects.toThrow("Barbeiro já possui agendamento nesse horário");
  });
});

describe("listarAgendamentos", () => {
  test("deve retornar uma lista de agendamentos", async () => {
    await criarAgendamento(
      {
        clienteId,
        barbeiroId,
        data: "2026-06-01",
        horario: "12:00",
        servicoId,
      },
      client,
    );

    const agendamentos = await listarAgendamentos(client);
    expect(Array.isArray(agendamentos)).toBe(true);
    expect(agendamentos.length).toBeGreaterThan(0);
  });
});

describe("cancelarAgendamento", () => {
  test("deve cancelar um agendamento existente", async () => {
    const agendamento = await criarAgendamento(
      {
        clienteId,
        barbeiroId,
        data: "2026-06-02",
        horario: "14:00",
        servicoId,
      },
      client,
    );

    const resultado = await cancelarAgendamento(agendamento.id, client);
    expect(resultado.mensagem).toBe("Agendamento cancelado com sucesso!");
  });

  test("deve lançar erro se agendamento não existir", async () => {
    await expect(cancelarAgendamento(9999999, client)).rejects.toThrow(
      "Agendamento não encontrado",
    );
  });

  test("deve lançar erro se agendamento já estiver cancelado", async () => {
    const agendamento = await criarAgendamento(
      {
        clienteId,
        barbeiroId,
        data: "2026-06-03",
        horario: "15:00",
        servicoId,
      },
      client,
    );

    await cancelarAgendamento(agendamento.id, client);

    await expect(cancelarAgendamento(agendamento.id, client)).rejects.toThrow(
      "Agendamento já está cancelado",
    );
  });
});
