const disponibilidadeService = require("../services/disponibilidadeService");

async function listarHorariosDisponiveis(request, response) {
  try {
    const { barbeiroId, data } = request.query;
    const horarios = await disponibilidadeService.listarHorariosDisponiveis(
      barbeiroId,
      data,
    );
    response.status(200).json(horarios);
  } catch (erro) {
    response.status(400).json({ mensagem: erro.message });
  }
}

module.exports = { listarHorariosDisponiveis };
