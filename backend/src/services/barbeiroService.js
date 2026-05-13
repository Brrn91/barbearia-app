const db = require('../database/database');

function criarBarbeiro(dados) {
  const { nome, especialidade } = dados;

  if (!nome || !especialidade) {
    throw new Error('Nome e especialidade são obrigatórios!');
  }

  const barbeiroExistente = db.prepare(`
    SELECT id FROM barbeiros WHERE nome = ?
  `).get(nome);

  if (barbeiroExistente) {
    throw new Error('Já existe um barbeiro com esse nome');
  }

  const resultado = db.prepare(`
    INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)
  `).run(nome, especialidade);

  return { id: resultado.lastInsertRowid, mensagem: 'Barbeiro criado com sucesso!' };
}

function listarBarbeiros() {
  return db.prepare(`SELECT * FROM barbeiros`).all();
}

module.exports = { criarBarbeiro, listarBarbeiros };
