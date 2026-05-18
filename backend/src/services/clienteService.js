const dbReal = require('../database/database');

async function criarCliente(dados, db = dbReal) {
  const { nome, telefone } = dados;

  if (!nome || !telefone) {
    throw new Error('Nome e telefone são obrigatórios');
  }

  const clienteExistente = await db.query(
    `SELECT id FROM clientes WHERE telefone = $1`,
    [telefone]
  );

  if (clienteExistente.rows.length > 0) {
    throw new Error('Já existe um cliente com esse telefone');
  }

  const resultado = await db.query(
    `INSERT INTO clientes (nome, telefone) VALUES ($1, $2) RETURNING id`,
    [nome, telefone]
  );

  return { id: resultado.rows[0].id, mensagem: 'Cliente criado com sucesso!' };
}

async function listarClientes(db = dbReal) {
  const resultado = await db.query(`SELECT * FROM clientes`);
  return resultado.rows;
}

module.exports = { criarCliente, listarClientes };
