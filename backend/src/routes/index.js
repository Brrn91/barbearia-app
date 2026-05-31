const express = require("express");
const router = express.Router();

const agendamentoController = require("../controllers/agendamentoController");
const clienteController = require("../controllers/clienteController");
const barbeiroController = require("../controllers/barbeiroController");
const authController = require("../controllers/authController");
const servicoController = require("../controllers/servicoController");
const disponibilidadeController = require("../controllers/disponibilidadeController");
const { autenticar, autenticarAdmin } = require("../authMiddleware");

router.get("/health", (request, response) => {
  response.json({ status: "ok", message: "API da Barbearia funcionando!" });
});

// Rotas públicas
router.post("/auth/cadastro", authController.cadastrarCliente);
router.post("/auth/login", authController.login);

// Rotas de disponibilidade
router.get(
  "/disponibilidade",
  disponibilidadeController.listarHorariosDisponiveis,
);

// Rotas de serviços
router.post("/servicos", autenticarAdmin, servicoController.criarServico);
router.get("/servicos", servicoController.listarServicos);
router.put(
  "/servicos/:id",
  autenticarAdmin,
  servicoController.atualizarServico,
);
router.patch(
  "/servicos/:id/desativar",
  autenticarAdmin,
  servicoController.desativarServico,
);

// Rotas de clientes
router.post("/clientes", autenticarAdmin, clienteController.criarCliente);
router.get("/clientes", autenticarAdmin, clienteController.listarClientes);

// Rotas de barbeiros
router.post("/barbeiros", autenticarAdmin, barbeiroController.criarBarbeiro);
router.get("/barbeiros", barbeiroController.listarBarbeiros);

// Rotas de agendamentos
router.post(
  "/agendamentos",
  autenticar,
  agendamentoController.criarAgendamento,
);
router.get(
  "/agendamentos",
  autenticarAdmin,
  agendamentoController.listarAgendamentos,
);
router.patch(
  "/agendamentos/:id/cancelar",
  autenticar,
  agendamentoController.cancelarAgendamento,
);

module.exports = router;
