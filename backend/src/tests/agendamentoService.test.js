const Database = require("better-sqlite3");

let db;

beforeAll(() => {
  db = new Database(":memory:");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL
    );

    CREATE TABLE barbeiros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      especialidade TEXT NOT NULL
    );

    CREATE TABLE agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      servico TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmado',
      cliente_id INTEGER NOT NULL,
      barbeiro_id INTEGER NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (barbeiro_id) REFERENCES barbeiros(id)
    );
  `);

  db.prepare(`INSERT INTO clientes (nome, telefone) VALUES (?, ?)`).run(
    "Lucas",
    "47 99999-0000",
  );
  db.prepare(`INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)`).run(
    "João",
    "Corte e Barba",
  );
});

afterAll(() => {
  db.close();
});

const {
  criarAgendamento,
  listarAgendamentos,
  cancelarAgendamento,
} = require("../services/agendamentoService");

describe("criarAgendamento", () => {
  test("deve criar um agendamento com dados válidos", () => {
    const resultado = criarAgendamento(
      {
        clienteId: 1,
        barbeiroId: 1,
        data: "2026-06-01",
        horario: "10:00",
        servico: "Corte",
      },
      db,
    );

    expect(resultado.mensagem).toBe("Agendamento criado com sucesso!");
    expect(resultado.id).toBeDefined();
  });

  test("deve lançar erro se campos obrigatórios estiverem faltando", () => {
    expect(() =>
      criarAgendamento(
        {
          clienteId: 1,
          barbeiroId: 1,
          data: "2026-06-01",
        },
        db,
      ),
    ).toThrow("Todos os campos são obrigatórios");
  });

  test("deve lançar erro se barbeiro já tiver agendamento no horário", () => {
    criarAgendamento(
      {
        clienteId: 1,
        barbeiroId: 1,
        data: "2026-06-01",
        horario: "11:00",
        servico: "Barba",
      },
      db,
    );

    expect(() =>
      criarAgendamento(
        {
          clienteId: 1,
          barbeiroId: 1,
          data: "2026-06-01",
          horario: "11:00",
          servico: "Corte",
        },
        db,
      ),
    ).toThrow("Barbeiro já possui agendamento nesse horário");
  });
});

describe("listarAgendamentos", () => {
  test("deve retornar uma lista de agendamentos", () => {
    const agendamentos = listarAgendamentos(db);
    expect(Array.isArray(agendamentos)).toBe(true);
    expect(agendamentos.length).toBeGreaterThan(0);
  });
});

describe("cancelarAgendamento", () => {
  test("deve cancelar um agendamento existente", () => {
    const agendamento = criarAgendamento(
      {
        clienteId: 1,
        barbeiroId: 1,
        data: "2026-06-02",
        horario: "14:00",
        servico: "Corte",
      },
      db,
    );

    const resultado = cancelarAgendamento(agendamento.id, db);
    expect(resultado.mensagem).toBe("Agendamento cancelado com sucesso!");
  });

  test("deve lançar erro se agendamento não existir", () => {
    expect(() => cancelarAgendamento(9999, db)).toThrow(
      "Agendamento não encontrado",
    );
  });

  test("deve lançar erro se agendamento já estiver cancelado", () => {
    const agendamento = criarAgendamento(
      {
        clienteId: 1,
        barbeiroId: 1,
        data: "2026-06-03",
        horario: "15:00",
        servico: "Barba",
      },
      db,
    );

    cancelarAgendamento(agendamento.id, db);

    expect(() => cancelarAgendamento(agendamento.id, db)).toThrow(
      "Agendamento já está cancelado",
    );
  });
});
