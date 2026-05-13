const db = require('./src/database/database');

db.prepare(`
  INSERT INTO clientes (nome, telefone) VALUES (?, ?)
  `).run('Lucas', '47 99999-0000');

db.prepare(`
  INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)
  `).run('João', 'Corte e Barba');

console.log('Dados inseridos com sucesso!');
