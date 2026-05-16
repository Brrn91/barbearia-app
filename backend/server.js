const express = require('express');
const cors = require('cors');
const app = express();

const routes = require('./src/routes/index');
const executarMigrations = require('./src/database/migrations');
const logger = require('./src/logger');

app.use(cors());
app.use(express.json());

app.use((request, response, next) => {
  logger.info(`${request.method} ${request.url}`);
  next();
});

app.use('/api', routes);

executarMigrations();

app.listen(3000, () => {
  logger.info('Servidor rodando na porta 3000');
});
