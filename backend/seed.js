require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/database/database');

async function seed() {
  const senhaCriptografada = await bcrypt.hash('admin123', 10);

  const usuario = await db.query(
    `INSERT INTO usuarios (email, senha, tipo) VALUES ($1, $2, 'admin') RETURNING id`,
    ['joao@barbearia.com', senhaCriptografada]
  );

  const usuarioId = usuario.rows[0].id;

  await db.query(
    `INSERT INTO barbeiros (usuario_id, nome, especialidade) VALUES ($1, $2, $3)`,
    [usuarioId, 'João', 'Corte e Barba']
  );

  console.log('Admin criado com sucesso!');
  console.log('Email: joao@barbearia.com');
  console.log('Senha: admin123');

  await db.end();
}

seed().catch(console.error);
