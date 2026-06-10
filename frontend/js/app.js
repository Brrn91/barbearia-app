const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://barbearia-app-production-62bc.up.railway.app/api";

async function carregarClientes() {
  const response = await fetch(`${API_URL}/clientes`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const clientes = await response.json();

  const select = document.getElementById("clienteId");
  clientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.id;
    option.textContent = cliente.nome;
    select.appendChild(option);
  });
}

async function carregarBarbeiros() {
  const response = await fetch(`${API_URL}/barbeiros`);
  const barbeiros = await response.json();

  const select = document.getElementById("barbeiroId");
  barbeiros.forEach((barbeiro) => {
    const option = document.createElement("option");
    option.value = barbeiro.id;
    option.textContent = barbeiro.nome;
    select.appendChild(option);
  });
}

async function carregarServicos() {
  const response = await fetch(`${API_URL}/servicos`);
  const servicos = await response.json();

  const select = document.getElementById("servicoId");
  servicos.forEach((servico) => {
    const option = document.createElement("option");
    option.value = servico.id;
    option.textContent = `${servico.nome} — R$ ${parseFloat(servico.preco).toFixed(2)}`;
    select.appendChild(option);
  });
}

async function carregarAgendamentos() {
  const token = localStorage.getItem("token");
  if (!token) {
    document.getElementById("listaAgendamentos").innerHTML =
      '<p class="text-gray-400">Faça login para ver os agendamentos.</p>';
    return;
  }

  const response = await fetch(`${API_URL}/agendamentos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401 || response.status === 403) {
    document.getElementById("listaAgendamentos").innerHTML =
      '<p class="text-gray-400">Sem permissão para ver agendamentos.</p>';
    return;
  }

  const agendamentos = await response.json();
  const lista = document.getElementById("listaAgendamentos");

  if (agendamentos.length === 0) {
    lista.innerHTML =
      '<p class="text-gray-400">Nenhum agendamento encontrado.</p>';
    return;
  }

  lista.innerHTML = agendamentos
    .map(
      (agendamento) => `
    <div class="bg-gray-700 rounded-lg p-4 mb-3 flex justify-between items-center">
      <div>
        <p class="font-semibold">${agendamento.nomeCliente}</p>
        <p class="text-gray-400 text-sm">${agendamento.data} às ${agendamento.horario} — ${agendamento.nomeServico} (R$ ${parseFloat(agendamento.precoServico).toFixed(2)})</p>
        <p class="text-gray-400 text-sm">Barbeiro: ${agendamento.nomeBarbeiro}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="px-2 py-1 rounded text-xs font-bold ${agendamento.status === "confirmado" ? "bg-green-600" : "bg-red-600"}">
          ${agendamento.status}
        </span>
        ${
          agendamento.status === "confirmado"
            ? `
          <button
            onclick="cancelarAgendamento(${agendamento.id})"
            class="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-400 transition">
            Cancelar
          </button>
        `
            : ""
        }
      </div>
    </div>
  `,
    )
    .join("");
}

async function criarAgendamento() {
  const clienteId = document.getElementById("clienteId").value;
  const barbeiroId = document.getElementById("barbeiroId").value;
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;
  const servicoId = document.getElementById("servicoId").value;
  const token = localStorage.getItem("token");
  const mensagem = document.getElementById("mensagem");

  if (!token) {
    mensagem.className = "mt-3 text-sm text-red-400";
    mensagem.textContent = "Você precisa estar logado para agendar.";
    return;
  }

  const response = await fetch(`${API_URL}/agendamentos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ clienteId, barbeiroId, data, horario, servicoId }),
  });

  const resultado = await response.json();

  if (response.ok) {
    mensagem.className = "mt-3 text-sm text-green-400";
    mensagem.textContent = resultado.mensagem;
    carregarAgendamentos();
  } else {
    mensagem.className = "mt-3 text-sm text-red-400";
    mensagem.textContent = resultado.mensagem;
  }
}

async function cancelarAgendamento(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/agendamentos/${id}/cancelar`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  const resultado = await response.json();
  alert(resultado.mensagem);
  carregarAgendamentos();
}

document
  .getElementById("btnAgendar")
  .addEventListener("click", criarAgendamento);

carregarBarbeiros();
carregarServicos();
carregarAgendamentos();
