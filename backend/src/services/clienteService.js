const db = require('../database/database');

function criarCliente(dados) {
  const {nome, telefone} = dados;

  if(!nome || !telefone) {
    throw new Error('Nome e telefone são obrigatórios!');
  }

  const clienteExistente = db.prepare(`
    SELECT id FROM clientes WHERE telefone = ?
    `).get(telefone);

  if (clienteExistente) {
    throw new Error('Já existe um cliente com esse telefone');
  }

  const resultado = db.prepare(`
    INSERT INTO clientes (nome, telefone) VALUES (?, ?)
    `).run(nome, telefone);

  return {id: resultado.lastInsertRowid, mensagem: 'Cliente criado com sucesso!'};
};

function listarClientes() {
  return db.prepare(`SELECT * FROM clientes`).all();
}

module.exports = {criarCliente, listarClientes};
