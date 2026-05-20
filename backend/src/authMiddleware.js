const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function autenticar(request, response, next) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({ mensagem: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    request.usuario = decoded;
    next();
  } catch (erro) {
    return response
      .status(401)
      .json({ mensagem: "Token inválido ou expirado" });
  }
}

function autenticarAdmin(request, response, next) {
  autenticar(request, response, () => {
    if (request.usuario.tipo !== "admin") {
      return response.status(403).json({ mensagem: "Acesso negado" });
    }
    next();
  });
}

module.exports = { autenticar, autenticarAdmin };
