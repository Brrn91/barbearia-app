const db = require('./database');

async function executarMigrations() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK (tipo IN ('cliente', 'admin')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER REFERENCES usuarios(id),
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS barbeiros (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER REFERENCES usuarios(id),
      nome TEXT NOT NULL,
      especialidade TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS servicos (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      preco DECIMAL(10,2) NOT NULL,
      duracao_minutos INTEGER NOT NULL,
      ativo BOOLEAN NOT NULL DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS agendamentos (
      id SERIAL PRIMARY KEY,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmado',
      cliente_id INTEGER NOT NULL REFERENCES clientes(id),
      barbeiro_id INTEGER NOT NULL REFERENCES barbeiros(id),
      servico_id INTEGER NOT NULL REFERENCES servicos(id)
    );
  `);

  console.log('Tabelas criadas com sucesso!');
}

module.exports = executarMigrations;
