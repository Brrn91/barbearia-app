import { Pool, PoolClient } from 'pg';
import { HorarioDisponivel } from '../types';

const HORARIO_INICIO = '09:00';
const HORARIO_FIM = '18:00';
const INTERVALO_MINUTOS = 30;
