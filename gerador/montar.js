// Cenários: validação, sorteio dos 20 personagens e escolha do cenário de cada dia.
import { TOTAL } from '../nucleo/grade.js';

const ORDEM = ['facil', 'medio', 'dificil'];
const MAX_PROFISSOES = 8; // com 20 personagens, garante de 2 a 4 por profissão

export function validarCenario(c, arquivo = '') {
  const onde = arquivo ? `Cenário ${arquivo}` : 'Cenário';
  const falha = (msg) => { throw new Error(`${onde}: ${msg}`); };
  if (!c || typeof c.id !== 'string' || !c.id) falha('precisa de um id.');
  if (!Array.isArray(c.travessuras) || c.travessuras.length < 1) falha('precisa de pelo menos 1 travessura.');
  if (!Array.isArray(c.nomes) || c.nomes.length < TOTAL) falha(`precisa de pelo menos ${TOTAL} nomes.`);
  const vistos = new Set();
  for (const n of c.nomes) {
    if (vistos.has(n)) falha(`nome repetido: ${n}.`);
    vistos.add(n);
  }
  if (!Array.isArray(c.profissoes) || new Set(c.profissoes).size < 5) falha('precisa de pelo menos 5 profissões diferentes.');
}

export function montarPersonagens(cenario, rng) {
  const nomes = rng.embaralhar(cenario.nomes).slice(0, TOTAL);
  const profissoes = rng.embaralhar([...new Set(cenario.profissoes)]).slice(0, MAX_PROFISSOES);
  const distribuidas = rng.embaralhar(Array.from({ length: TOTAL }, (_, k) => profissoes[k % profissoes.length]));
  return nomes.map((nome, k) => ({ nome, profissao: distribuidas[k] }));
}

/** Rodízio: cada dificuldade anda um cenário por dia, começando em pontos diferentes da lista. */
export function escolherCenario(cenarios, dia, dificuldade) {
  const d = ORDEM.indexOf(dificuldade);
  if (d < 0) throw new Error(`Dificuldade inválida: ${dificuldade}`);
  const lista = [...cenarios].sort((a, b) => a.id.localeCompare(b.id));
  const deslocamento = Math.floor((lista.length * d) / ORDEM.length);
  return lista[(dia + deslocamento) % lista.length];
}
