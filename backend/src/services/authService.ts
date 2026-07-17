import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Pool, PoolClient } from "pg";
import {
  DadosCadastroCliente,
  DadosLogin,
  ResultadoLogin,
  ResultadoOperacao,
} from "../types";

const dbReal: Pool = require("../database/database");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
}

const secret: string = JWT_SECRET;

async function cadastrarCliente(
  dados: DadosCadastroCliente,
  db: Pool | PoolClient = dbReal,
): Promise<ResultadoOperacao> {
  const { nome, telefone, email, senha } = dados;

  if (!nome || !telefone || !email || !senha) {
    throw new Error("Todos os campos são obrigatórios");
  }

  const usuarioExistente = await db.query(
    `SELECT id FROM usuarios WHERE email = $1`,
    [email],
  );

  if (usuarioExistente.rows.length > 0) {
    throw new Error("Email já cadastrado");
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const usuario = await db.query(
    `INSERT INTO usuarios (email, senha, tipo) VALUES ($1, $2, 'cliente') RETURNING id`,
    [email, senhaCriptografada],
  );

  const usuarioId: number = usuario.rows[0].id;

  const cliente = await db.query(
    `INSERT INTO clientes (usuario_id, nome, telefone) VALUES ($1, $2, $3) RETURNING id`,
    [usuarioId, nome, telefone],
  );

  return {
    mensagem: "Cliente cadastrado com sucesso!",
    id: cliente.rows[0].id,
  };
}

async function login(
  dados: DadosLogin,
  db: Pool | PoolClient = dbReal,
): Promise<ResultadoLogin> {
  const { email, senha } = dados;

  if (!email || !senha) {
    throw new Error("Email e senha são obrigatórios");
  }

  const resultado = await db.query(`SELECT * FROM usuarios WHERE email = $1`, [
    email,
  ]);

  if (resultado.rows.length === 0) {
    throw new Error("Email ou senha inválidos");
  }

  const usuario = resultado.rows[0];

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    throw new Error("Email ou senha inválidos");
  }

  const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, secret, {
    expiresIn: "7d",
  });

  return {
    token,
    tipo: usuario.tipo,
    mensagem: "Login realizado com sucesso!",
  };
}

export { cadastrarCliente, login };
