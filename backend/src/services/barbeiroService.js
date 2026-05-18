const dbReal = require('../database/database');

async function criarBarbeiro(dados, db = dbReal) {
  const { nome, especialidade } = dados;

  if (!nome || !especialidade) {
    throw new Error('Nome e especialidade são obrigatórios!');
  }

  const barbeiroExistente = await db.query(
    `SELECT id FROM barbeiros WHERE nome = $1`,
    [nome]
  );

  if (barbeiroExistente.rows.length > 0) {
    throw new Error('Já existe um barbeiro com esse nome');
  }

  const resultado = await db.query(
    `INSERT INTO barbeiros (nome, especialidade) VALUES ($1, $2) RETURNING id`,
    [nome, especialidade]
  );

  return { id: resultado.rows[0].id, mensagem: 'Barbeiro criado com sucesso!' };
}

async function listarBarbeiros(db = dbReal) {
  const resultado = await db.query(`SELECT * FROM barbeiros`);
  return resultado.rows;
}

module.exports = { criarBarbeiro, listarBarbeiros };
