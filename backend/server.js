const express = require('express');
const app = express();

const routes = require('./src/routes/index');

app.use(express.json());
app.use('/api', routes)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
