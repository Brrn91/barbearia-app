const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://barbearia-app-production-62bc.up.railway.app/api";

const SERVICOS_FALLBACK = [
  { id: 1, nome: "Corte", preco: 35, duracao_minutos: 30 },
  { id: 2, nome: "Barba", preco: 25, duracao_minutos: 20 },
  { id: 3, nome: "Corte e Barba", preco: 55, duracao_minutos: 50 },
  { id: 4, nome: "Degradê", preco: 40, duracao_minutos: 40 },
];

const BARBEIROS_FALLBACK = [{ id: 1, nome: "João" }];

const NOMES_MARKETING = {
  Corte: "Corte Simples",
  Barba: "Barba",
  "Corte e Barba": "Corte Simples e Barba",
  Degradê: "Degradê",
};

function formatarPreco(valor) {
  return `R$ ${Number(valor).toFixed(0).replace(".", ",")}`;
}

function formatarDataBR(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

async function carregarServicos() {
  try {
    const response = await fetch(`${API_URL}/servicos`);
    if (!response.ok) throw new Error("API indisponível");
    return await response.json();
  } catch {
    return SERVICOS_FALLBACK;
  }
}

async function carregarBarbeiros() {
  try {
    const response = await fetch(`${API_URL}/barbeiros`);
    if (!response.ok) throw new Error("API indisponível");
    return await response.json();
  } catch {
    return BARBEIROS_FALLBACK;
  }
}

function popularSelectServicos(servicos) {
  const select = document.getElementById("servicoId");
  if (!select) return;

  select.innerHTML = '<option value="">Selecione um serviço</option>';

  servicos.forEach((servico) => {
    const option = document.createElement("option");
    option.value = servico.id;
    const nomeExibicao = NOMES_MARKETING[servico.nome] || servico.nome;
    option.textContent = `${nomeExibicao} — ${formatarPreco(servico.preco)}`;
    option.dataset.nome = servico.nome;
    select.appendChild(option);
  });

  document.querySelectorAll("[data-servico-preco]").forEach((el) => {
    const chave = el.getAttribute("data-servico-preco");
    const servico = servicos.find((s) => s.nome === chave);
    if (servico) el.textContent = formatarPreco(servico.preco);
  });
}

function popularSelectBarbeiros(barbeiros) {
  const select = document.getElementById("barbeiroId");
  if (!select) return;

  select.innerHTML = '<option value="">Selecione um barbeiro</option>';

  barbeiros.forEach((barbeiro) => {
    const option = document.createElement("option");
    option.value = barbeiro.id;
    option.textContent = barbeiro.nome;
    select.appendChild(option);
  });
}

function definirDataMinima() {
  const inputData = document.getElementById("data");
  if (!inputData) return;

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  inputData.min = `${ano}-${mes}-${dia}`;
}

function limparErros() {
  document.querySelectorAll(".form-input").forEach((input) => {
    input.classList.remove("form-error");
  });
  document.querySelectorAll(".error-message").forEach((el) => {
    el.classList.add("hidden");
    el.textContent = "";
  });
}

function mostrarErro(campo, mensagem) {
  const input = document.getElementById(campo);
  const errorEl = document.querySelector(`[data-error="${campo}"]`);

  if (input) input.classList.add("form-error");
  if (errorEl) {
    errorEl.textContent = mensagem;
    errorEl.classList.remove("hidden");
  }
}

function validarFormulario(dados) {
  limparErros();
  let valido = true;

  if (!dados.nome.trim()) {
    mostrarErro("nome", "Informe seu nome completo.");
    valido = false;
  }

  const telefoneNumeros = dados.telefone.replace(/\D/g, "");
  if (telefoneNumeros.length < 10) {
    mostrarErro("telefone", "Informe um telefone válido.");
    valido = false;
  }

  if (!dados.barbeiroId) {
    mostrarErro("barbeiroId", "Selecione um barbeiro.");
    valido = false;
  }

  if (!dados.servicoId) {
    mostrarErro("servicoId", "Selecione um serviço.");
    valido = false;
  }

  if (!dados.data) {
    mostrarErro("data", "Selecione uma data.");
    valido = false;
  } else {
    const dataSelecionada = new Date(`${dados.data}T00:00:00`);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (dataSelecionada < hoje) {
      mostrarErro("data", "A data não pode ser no passado.");
      valido = false;
    }
  }

  if (!dados.horario) {
    mostrarErro("horario", "Selecione um horário.");
    valido = false;
  }

  return valido;
}

function montarMensagemWhatsApp(dados) {
  const barbeiroSelect = document.getElementById("barbeiroId");
  const servicoSelect = document.getElementById("servicoId");
  const barbeiroNome =
    barbeiroSelect.options[barbeiroSelect.selectedIndex]?.textContent || "";
  const servicoOption = servicoSelect.options[servicoSelect.selectedIndex];
  const servicoNome = servicoOption?.textContent || "";

  return [
    "Olá! Gostaria de agendar um horário na barbearia-app.",
    "",
    `*Nome:* ${dados.nome}`,
    `*Telefone:* ${dados.telefone}`,
    `*Barbeiro:* ${barbeiroNome}`,
    `*Serviço:* ${servicoNome}`,
    `*Data:* ${formatarDataBR(dados.data)}`,
    `*Horário:* ${dados.horario}`,
  ].join("\n");
}

/*
 * Integração futura com a API (quando auth JWT estiver pronta):
 *
 * async function loginCliente(email, senha) {
 *   const res = await fetch(`${API_URL}/auth/login`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ email, senha }),
 *   });
 *   const { token } = await res.json();
 *   localStorage.setItem("token", token);
 *   return token;
 * }
 *
 * async function buscarDisponibilidade(barbeiroId, data) {
 *   const res = await fetch(
 *     `${API_URL}/disponibilidade?barbeiroId=${barbeiroId}&data=${data}`,
 *   );
 *   return res.json(); // [{ horario, disponivel }]
 * }
 *
 * async function criarAgendamentoAPI(dados, token) {
 *   const res = await fetch(`${API_URL}/agendamentos`, {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       Authorization: `Bearer ${token}`,
 *     },
 *     body: JSON.stringify({
 *       clienteId: dados.clienteId,
 *       barbeiroId: Number(dados.barbeiroId),
 *       data: dados.data,
 *       horario: dados.horario,
 *       servicoId: Number(dados.servicoId),
 *     }),
 *   });
 *   return res.json();
 * }
 */

async function initAgendamento() {
  const form = document.getElementById("formAgendamento");
  if (!form) return;

  definirDataMinima();

  const [servicos, barbeiros] = await Promise.all([
    carregarServicos(),
    carregarBarbeiros(),
  ]);

  popularSelectServicos(servicos);
  popularSelectBarbeiros(barbeiros);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const dados = {
      nome: document.getElementById("nome").value,
      telefone: document.getElementById("telefone").value,
      barbeiroId: document.getElementById("barbeiroId").value,
      servicoId: document.getElementById("servicoId").value,
      data: document.getElementById("data").value,
      horario: document.getElementById("horario").value,
    };

    if (!validarFormulario(dados)) return;

    const mensagem = montarMensagemWhatsApp(dados);
    window.abrirWhatsApp(mensagem);

    const formMensagem = document.getElementById("formMensagem");
    if (formMensagem) {
      formMensagem.textContent =
        "Redirecionando para o WhatsApp com seus dados...";
      formMensagem.className = "text-sm text-brand";
      formMensagem.classList.remove("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", initAgendamento);
