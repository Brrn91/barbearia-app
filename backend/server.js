require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("./src/routes/index");
const executarMigrations = require("./src/database/migrations");
const logger = require("./src/logger");

app.use(cors());
app.use(express.json());

app.use((request, response, next) => {
  logger.info(`${request.method} ${request.url}`);
  next();
});

app.use("/api", routes);

const PORT = process.env.PORT || 3000;

executarMigrations()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((erro) => {
    logger.error(`Erro ao iniciar servidor: ${erro.message}`);
    process.exit(1);
  });
