const express = require('express');
const router = express.Router();

router.get('/health', (request, response) => {
  response.send({
    status: 'ok',
    message: 'API da Barbearia funcionando!',
  });
});

module.exports = router;
