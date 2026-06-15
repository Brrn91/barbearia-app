jest.mock("../logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const {
  criarAgendamento,
  listarAgendamentos,
  cancelarAgendamento,
} = require("../services/agendamentoService");

function criarDbMock(respostas) {
  return {
    query: jest.fn().mockImplementation(() => {
      const resposta = respostas.shift();
      return Promise.resolve(resposta || { rows: [] });
    }),
  };
}

describe("agendamentoService.criarAgendamento", () => {
  test("deve criar um agendamento com dados válidos", async () => {
    const db = criarDbMock([
      { rows: [{ id: 1, ativo: true, duracao_minutos: 30 }] },
      { rows: [] },
      { rows: [{ id: 10 }] },
    ]);

    const resultado = await criarAgendamento(
      {
        clienteId: 1,
        barbeiroId: 2,
        data: "2026-06-20",
        horario: "10:00",
        servicoId: 3,
      },
      db,
    );

    expect(resultado).toEqual({
      id: 10,
      mensagem: "Agendamento criado com sucesso!",
    });
    expect(db.query).toHaveBeenCalledTimes(3);
  });

  test("deve usar o cliente vinculado ao usuário logado quando o usuário for cliente", async () => {
    const db = criarDbMock([
      { rows: [{ id: 7 }] },
      { rows: [{ id: 1, ativo: true, duracao_minutos: 30 }] },
      { rows: [] },
      { rows: [{ id: 10 }] },
    ]);

    await criarAgendamento(
      {
        clienteId: 999,
        barbeiroId: 2,
        data: "2026-06-20",
        horario: "10:00",
        servicoId: 3,
        usuario: { id: 4, tipo: "cliente" },
      },
      db,
    );

    expect(db.query).toHaveBeenLastCalledWith(
      expect.stringContaining("INSERT INTO agendamentos"),
      [7, 2, "2026-06-20", "10:00", 3],
    );
  });

  test("deve lançar erro quando o usuário logado não tiver cliente vinculado", async () => {
    const db = criarDbMock([{ rows: [] }]);

    await expect(
      criarAgendamento(
        {
          barbeiroId: 2,
          data: "2026-06-20",
          horario: "10:00",
          servicoId: 3,
          usuario: { id: 4, tipo: "cliente" },
        },
        db,
      ),
    ).rejects.toThrow("Cliente não encontrado para o usuário logado");
  });

  test("deve lançar erro se campos obrigatórios estiverem faltando", async () => {
    const db = criarDbMock([]);

    await expect(
      criarAgendamento(
        {
          clienteId: 1,
          barbeiroId: 2,
          data: "2026-06-20",
        },
        db,
      ),
    ).rejects.toThrow("Todos os campos são obrigatórios");

    expect(db.query).not.toHaveBeenCalled();
  });

  test("deve lançar erro se o serviço não existir", async () => {
    const db = criarDbMock([{ rows: [] }]);

    await expect(
      criarAgendamento(
        {
          clienteId: 1,
          barbeiroId: 2,
          data: "2026-06-20",
          horario: "10:00",
          servicoId: 999,
        },
        db,
      ),
    ).rejects.toThrow("Serviço não encontrado ou inativo");
  });

  test("deve lançar erro se o serviço estiver inativo", async () => {
    const db = criarDbMock([{ rows: [{ id: 1, ativo: false }] }]);

    await expect(
      criarAgendamento(
        {
          clienteId: 1,
          barbeiroId: 2,
          data: "2026-06-20",
          horario: "10:00",
          servicoId: 1,
        },
        db,
      ),
    ).rejects.toThrow("Serviço não encontrado ou inativo");
  });

  test("deve lançar erro se o barbeiro já tiver agendamento no mesmo período", async () => {
    const db = criarDbMock([
      { rows: [{ id: 1, ativo: true, duracao_minutos: 30 }] },
      { rows: [{ horario: "10:00", duracao_minutos: 50 }] },
    ]);

    await expect(
      criarAgendamento(
        {
          clienteId: 1,
          barbeiroId: 2,
          data: "2026-06-20",
          horario: "10:30",
          servicoId: 1,
        },
        db,
      ),
    ).rejects.toThrow("Barbeiro já possui agendamento nesse período");
  });

  test("deve permitir agendamento quando o período não estiver ocupado", async () => {
    const db = criarDbMock([
      { rows: [{ id: 1, ativo: true, duracao_minutos: 30 }] },
      { rows: [{ horario: "10:00", duracao_minutos: 30 }] },
      { rows: [{ id: 11 }] },
    ]);

    const resultado = await criarAgendamento(
      {
        clienteId: 1,
        barbeiroId: 2,
        data: "2026-06-20",
        horario: "10:30",
        servicoId: 1,
      },
      db,
    );

    expect(resultado.id).toBe(11);
  });
});

describe("agendamentoService.listarAgendamentos", () => {
  test("deve retornar os agendamentos cadastrados", async () => {
    const agendamentos = [
      {
        id: 1,
        data: "2026-06-20",
        horario: "10:00",
        status: "confirmado",
        nomeCliente: "Lucas",
        nomeBarbeiro: "João",
        nomeServico: "Corte",
        precoServico: "35.00",
      },
    ];
    const db = criarDbMock([{ rows: agendamentos }]);

    const resultado = await listarAgendamentos(db);

    expect(resultado).toEqual(agendamentos);
  });
});

describe("agendamentoService.cancelarAgendamento", () => {
  test("deve cancelar um agendamento existente", async () => {
    const db = criarDbMock([{ rows: [{ id: 1, status: "confirmado" }] }, { rows: [] }]);

    const resultado = await cancelarAgendamento(1, db);

    expect(resultado).toEqual({
      mensagem: "Agendamento cancelado com sucesso!",
    });
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  test("deve lançar erro se o agendamento não existir", async () => {
    const db = criarDbMock([{ rows: [] }]);

    await expect(cancelarAgendamento(999, db)).rejects.toThrow(
      "Agendamento não encontrado",
    );
  });

  test("deve lançar erro se o agendamento já estiver cancelado", async () => {
    const db = criarDbMock([{ rows: [{ id: 1, status: "cancelado" }] }]);

    await expect(cancelarAgendamento(1, db)).rejects.toThrow(
      "Agendamento já está cancelado",
    );
  });
});
