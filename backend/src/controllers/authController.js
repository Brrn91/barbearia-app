const authService = require("../services/authService");

async function cadastrarCliente(request, response) {
  try {
    const resultado = await authService.cadastrarCliente(request.body);
    response.status(201).json(resultado);
  } catch (erro) {
    response.status(400).json({ mensagem: erro.message });
  }
}

async function login(request, response) {
  try {
    const resultado = await authService.login(request.body);
    response.status(200).json(resultado);
  } catch (erro) {
    response.status(401).json({ mensagem: erro.message });
  }
}

module.exports = { cadastrarCliente, login };
