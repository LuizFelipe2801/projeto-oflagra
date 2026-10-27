// Qual caso vale hoje: data em Brasília, número do caso, dia do ciclo e nome do arquivo.
import { CICLO, DATA_LANCAMENTO, FUSO } from './config.js';

const formato = new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' });

/** Data de hoje no horário de Brasília, como 'AAAA-MM-DD'. */
export function dataDeHoje(agora = new Date()) {
  return formato.format(agora);
}

const DIA_MS = 86400000;
const utc = (data) => {
  const [a, m, d] = data.split('-').map(Number);
  return Date.UTC(a, m - 1, d);
};

/** Dias entre duas datas 'AAAA-MM-DD' (b − a). */
export function diasEntre(a, b) {
  return Math.round((utc(b) - utc(a)) / DIA_MS);
}

/** Número do caso: o lançamento é o #1; antes dele também é #1. */
export function numeroDoCaso(data) {
  return Math.max(1, diasEntre(DATA_LANCAMENTO, data) + 1);
}

export function diaDoCiclo(numero) {
  return (numero - 1) % CICLO;
}

export function arquivoDoCaso(numero, dificuldade) {
  return `casos/${String(diaDoCiclo(numero)).padStart(3, '0')}-${dificuldade}.json`;
}

export function dataAnterior(data) {
  return new Date(utc(data) - DIA_MS).toISOString().slice(0, 10);
}
