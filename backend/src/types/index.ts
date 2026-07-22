export interface Agendamento {
  id: number;
  data: string;
  horario: string;
  status: string;
  nomeCliente: string;
  nomeBarbeiro: string;
  nomeServico: string;
  precoServico: number;
}

export interface DadosCriarAgendamento {
  clienteId: number;
  barbeiroId: number;
  data: string;
  horario: string;
  servicoId: number;
}

export interface ResultadoOperacao {
  id?: number;
  mensagem: string;
}

export interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracao_minutos: number;
  ativo: boolean;
}

export interface DadosCadastroCliente {
  nome: string;
  telefone: string;
  email: string;
  senha: string;
}

export interface DadosLogin {
  email: string;
  senha: string;
}

export interface ResultadoLogin {
  token: string;
  tipo: string;
  mensagem: string;
}

export interface HorarioDisponivel {
  horario: string;
  disponivel: boolean;
}

export interface DadosCriarBarbeiro {
  nome: string;
  especialidade: string;
  email: string;
  senha: string;
}

export interface Barbeiro {
  id: number;
  usuario_id: number;
  nome: string;
  especialidade: string;
}
