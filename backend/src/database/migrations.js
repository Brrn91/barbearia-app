const db = require("./database");

async function executarMigrations() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS barbeiros (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      especialidade TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agendamentos (
      id SERIAL PRIMARY KEY,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      servico TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmado',
      cliente_id INTEGER NOT NULL REFERENCES clientes(id),
      barbeiro_id INTEGER NOT NULL REFERENCES barbeiros(id)
    );
  `);

  console.log("Tabelas criadas com sucesso!");
}

module.exports = executarMigrations;
