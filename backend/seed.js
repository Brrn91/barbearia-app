require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./src/database/database");

async function seed() {
  const usuarioExistente = await db.query(
    `SELECT id FROM usuarios WHERE email = $1`,
    ["joao@barbearia.com"],
  );

  if (usuarioExistente.rows.length === 0) {
    const senhaCriptografada = await bcrypt.hash("admin123", 10);

    const usuario = await db.query(
      `INSERT INTO usuarios (email, senha, tipo) VALUES ($1, $2, 'admin') RETURNING id`,
      ["joao@barbearia.com", senhaCriptografada],
    );

    await db.query(
      `INSERT INTO barbeiros (usuario_id, nome, especialidade) VALUES ($1, $2, $3)`,
      [usuario.rows[0].id, "João", "Corte e Barba"],
    );

    console.log("Admin criado - Email: joao@barbearia.com | Senha: admin123");
  } else {
    console.log("Admin já existe — pulando...");
  }

  const servicosExistentes = await db.query(`SELECT id FROM servicos`);

  if (servicosExistentes.rows.length === 0) {
    await db.query(`
      INSERT INTO servicos (nome, preco, duracao_minutos) VALUES
        ('Corte', 35.00, 30),
        ('Barba', 25.00, 20),
        ('Corte e Barba', 55.00, 50),
        ('Degradê', 40.00, 40)
    `);
    console.log("Serviços criados com sucesso!");
  } else {
    console.log("Serviços já existem — pulando...");
  }

  await db.end();
}

seed().catch(console.error);
