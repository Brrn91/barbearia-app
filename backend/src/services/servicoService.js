const dbReal = require("../database/database");

async function criarServico(dados, db = dbReal) {
  const { nome, preco, duracaoMinutos } = dados;

  if (!nome || !preco || !duracaoMinutos) {
    throw new Error("Nome, preço e duração são obrigatórios");
  }

  const resultado = await db.query(
    `INSERT INTO servicos (nome, preco, duracao_minutos) VALUES ($1, $2, $3) RETURNING id`,
    [nome, preco, duracaoMinutos],
  );

  return { id: resultado.rows[0].id, mensagem: "Serviço criado com sucesso!" };
}

async function listarServicos(db = dbReal) {
  const resultado = await db.query(
    `SELECT * FROM servicos WHERE ativo = true ORDER BY nome`,
  );
  return resultado.rows;
}

async function atualizarServico(id, dados, db = dbReal) {
  const { nome, preco, duracaoMinutos } = dados;

  const servico = await db.query(`SELECT id FROM servicos WHERE id = $1`, [id]);

  if (servico.rows.length === 0) {
    throw new Error("Serviço não encontrado");
  }

  await db.query(
    `UPDATE servicos SET nome = $1, preco = $2, duracao_minutos = $3 WHERE id = $4`,
    [nome, preco, duracaoMinutos, id],
  );

  return { mensagem: "Serviço atualizado com sucesso!" };
}

async function desativarServico(id, db = dbReal) {
  const servico = await db.query(
    `SELECT id, ativo FROM servicos WHERE id = $1`,
    [id],
  );

  if (servico.rows.length === 0) {
    throw new Error("Serviço não encontrado");
  }

  if (!servico.rows[0].ativo) {
    throw new Error("Serviço já está desativado");
  }

  await db.query(`UPDATE servicos SET ativo = false WHERE id = $1`, [id]);

  return { mensagem: "Serviço desativado com sucesso!" };
}

module.exports = {
  criarServico,
  listarServicos,
  atualizarServico,
  desativarServico,
};
