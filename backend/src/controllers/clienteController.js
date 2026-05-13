const clienteService = require('../services/clienteService');

function criarCliente(request, response) {
  try {
    const resultado = clienteService.criarCliente(request.body);
    response.status(201).json(resultado);
  } catch (erro) {
    response.status(400).json({mensagem: erro.message});
  };
};

function listarClientes(request, response) {
  try {
    const clientes = clienteService.listarClientes();
    response.status(200).json(clientes);
  } catch (erro) {
    response.status(500).json({mensagem: erro.message});
  };
};

module.exports = {criarCliente, listarClientes};
