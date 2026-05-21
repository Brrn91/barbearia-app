const servicoService = require("../services/servicoService");

async function criarServico(request, response) {
  try {
    const resultado = await servicoService.criarServico(request.body);
    response.status(201).json(resultado);
  } catch (erro) {
    response.status(400).json({ mensagem: erro.message });
  }
}

async function listarServicos(request, response) {
  try {
    const servicos = await servicoService.listarServicos();
    response.status(200).json(servicos);
  } catch (erro) {
    response.status(500).json({ mensagem: erro.message });
  }
}

async function atualizarServico(request, response) {
  try {
    const { id } = request.params;
    const resultado = await servicoService.atualizarServico(id, request.body);
    response.status(200).json(resultado);
  } catch (erro) {
    response.status(400).json({ mensagem: erro.message });
  }
}

async function desativarServico(request, response) {
  try {
    const { id } = request.params;
    const resultado = await servicoService.desativarServico(id);
    response.status(200).json(resultado);
  } catch (erro) {
    response.status(400).json({ mensagem: erro.message });
  }
}

module.exports = {
  criarServico,
  listarServicos,
  atualizarServico,
  desativarServico,
};
