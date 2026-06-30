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
