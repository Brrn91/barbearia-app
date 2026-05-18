require("dotenv").config();
const db = require("./src/database/database");

async function seed() {
  await db.query(`INSERT INTO clientes (nome, telefone) VALUES ($1, $2)`, [
    "Lucas",
    "47 99999-0000",
  ]);

  await db.query(
    `INSERT INTO barbeiros (nome, especialidade) VALUES ($1, $2)`,
    ["João", "Corte e Barba"],
  );

  console.log("Dados inseridos com sucesso!");
  await db.end();
}

seed().catch(console.error);
