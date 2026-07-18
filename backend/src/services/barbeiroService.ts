const dbReal = require("../database/database");
const bcrypt = require("bcryptjs");

async function criarBarbeiro(dados, db = dbReal) {
  const { nome, especialidade, email, senha } = dados;

  if (!nome || !especialidade || !email || !senha) {
    throw new Error("Nome, especialidade, email e senha são obrigatórios");
  }

  const emailExistente = await db.query(
    `SELECT id FROM usuarios WHERE email = $1`,
    [email],
  );

  if (emailExistente.rows.length > 0) {
    throw new Error("Já existe um usuário com esse email");
  }

  const nomeExistente = await db.query(
    `SELECT id FROM barbeiros WHERE nome = $1`,
    [nome],
  );

  if (nomeExistente.rows.length > 0) {
    throw new Error("Já existe um barbeiro com esse nome");
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const usuario = await db.query(
    `INSERT INTO usuarios (email, senha, tipo) VALUES ($1, $2, 'admin') RETURNING id`,
    [email, senhaCriptografada],
  );

  const usuarioId = usuario.rows[0].id;

  const resultado = await db.query(
    `INSERT INTO barbeiros (usuario_id, nome, especialidade) VALUES ($1, $2, $3) RETURNING id`,
    [usuarioId, nome, especialidade],
  );

  return { id: resultado.rows[0].id, mensagem: "Barbeiro criado com sucesso!" };
}

async function listarBarbeiros(db = dbReal) {
  const resultado = await db.query(`SELECT * FROM barbeiros`);
  return resultado.rows;
}

module.exports = { criarBarbeiro, listarBarbeiros };
