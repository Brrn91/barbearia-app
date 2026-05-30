require("dotenv").config();
const db = require("./src/database/database");

async function seedServicos() {
  await db.query(
    `INSERT INTO servicos (nome, preco, duracao_minutos) VALUES
      ('Corte', 35.00, 30),
      ('Barba', 25.00, 20),
      ('Corte e Barba', 55.00, 50),
      ('Degradê', 40.00, 40)`,
  );

  console.log("Serviços criados com sucesso!");
  await db.end();
}

seedServicos().catch(console.error);
