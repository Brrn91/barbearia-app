const db = require("./database");

function executarMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS barbeiros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      especialidade TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      servico TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmado',
      cliente_id INTEGER NOT NULL,
      barbeiro_id INTEGER NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (barbeiro_id) REFERENCES barbeiros(id)
    );
  `);
  console.log('Tabelas criadas com sucesso!');
};

module.exports = executarMigrations;
