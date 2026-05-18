const barbeiroService = require("../services/barbeiroService");

async function criarBarbeiro(request, response) {
  try {
    const resultado = await barbeiroService.criarBarbeiro(request.body);
    response.status(201).json(resultado);
  } catch (erro) {
    response.status(400).json({ mensagem: erro.message });
  }
}

async function listarBarbeiros(request, response) {
  try {
    const barbeiros = await barbeiroService.listarBarbeiros();
    response.status(200).json(barbeiros);
  } catch (erro) {
    response.status(500).json({ mensagem: erro.message });
  }
}

module.exports = { criarBarbeiro, listarBarbeiros };
