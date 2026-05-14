const express = require('express');
const cors = require('cors');
const app = express();

const routes = require('./src/routes/index');
const executarMigrations = require('./src/database/migrations');

app.use(cors());
app.use(express.json());
app.use('/api', routes);

executarMigrations();

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
