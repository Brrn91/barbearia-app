import { Pool, PoolClient } from "pg";
import { HorarioDisponivel } from "../types";

const HORARIO_INICIO = "09:00";
const HORARIO_FIM = "18:00";
const INTERVALO_MINUTOS = 30;

function horaParaMinutos(hora: string): number {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
}

function minutosParaHoras(minutos:number): number {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${Number(horas).padStart(2, '0')}:${Number(mins).padStart(2, '0')}`;
}
