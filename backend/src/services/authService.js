const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbReal = require('../database/database');

const JWT_SECRET = process.env.JWT_SECRET;

async function cadastrarCliente(dados, db = dbReal) {
  const { nome, telefone, email, senha } = dados;

  if (!nome || !telefone || !email || !senha) {
    throw new Error('Todos os campos são obrigatórios');
  }

  const usuarioExistente = await db.query(
    `SELECT id FROM usuarios WHERE email = $1`,
    [email]
  );

  if (usuarioExistente.rows.length > 0) {
    throw new Error('Email já cadastrado');
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await db.query(
    `INSERT INTO usuarios (email, senha, tipo) VALUES ($1, $2, 'cliente') RETURNING id`,
    [email, senhaHash]
  );

  const usuarioId = usuario.rows[0].id;

  const cliente = await db.query(
    `INSERT INTO clientes (usuario_id, nome, telefone) VALUES ($1, $2, $3) RETURNING id`,
    [usuarioId, nome, telefone]
  );

  return { id: cliente.rows[0].id, mensagem: 'Cliente cadastrado com sucesso!' };
}

async function cadastrarAdmin(dados, db = dbReal) {
  const { nome, especialidade, email, senha } = dados;

  if (!nome || !especialidade || !email || !senha) {
    throw new Error('Todos os campos são obrigatórios');
  }

  const usuarioExistente = await db.query(
    `SELECT id FROM usuarios WHERE email = $1`,
    [email]
  );

  if (usuarioExistente.rows.length > 0) {
    throw new Error('Email já cadastrado');
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await db.query(
    `INSERT INTO usuarios (email, senha, tipo) VALUES ($1, $2, 'admin') RETURNING id`,
    [email, senhaHash]
  );

  const usuarioId = usuario.rows[0].id;

  const barbeiro = await db.query(
    `INSERT INTO barbeiros (usuario_id, nome, especialidade) VALUES ($1, $2, $3) RETURNING id`,
    [usuarioId, nome, especialidade]
  );

  return { id: barbeiro.rows[0].id, mensagem: 'Administrador cadastrado com sucesso!' };
}

async function login(dados, db = dbReal) {
  const { email, senha } = dados;

  if (!email || !senha) {
    throw new Error('Email e senha são obrigatórios');
  }

  const resultado = await db.query(
    `SELECT * FROM usuarios WHERE email = $1`,
    [email]
  );

  if (resultado.rows.length === 0) {
    throw new Error('Email ou senha inválidos');
  }

  const usuario = resultado.rows[0];

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new Error('Email ou senha inválidos');
  }

  const token = jwt.sign(
    { id: usuario.id, tipo: usuario.tipo },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, tipo: usuario.tipo, mensagem: 'Login realizado com sucesso!' };
}

module.exports = { cadastrarCliente, cadastrarAdmin, login };
