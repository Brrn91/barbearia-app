require('dotenv').config();
const db = require('./src/database/database');

async function reset() {
  await db.query(`
    DROP TABLE IF EXISTS agendamentos;
    DROP TABLE IF EXISTS clientes;
    DROP TABLE IF EXISTS barbeiros;
    DROP TABLE IF EXISTS usuarios;
  `);
  console.log('Tabelas removidas com sucesso!');
  await db.end();
}

reset().catch(console.error);
