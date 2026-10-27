// Passo de dedução: o menor conjunto de pistas reveladas que resolve algum personagem ainda desconhecido.
// Usado pelo gerador (jogador perfeito e medida de dificuldade) e pelo site (dica).
import { CHEIA } from './grade.js';
import { compilar } from './pistas.js';
import { candidatos } from './verificador.js';

/** Máscara dos personagens certos entre as soluções da base aceitas por todas as `marcas`. */
function certezas(base, marcas) {
  let todas = CHEIA;
  let alguma = 0;
  let achou = false;
  for (let k = 0; k < base.length; k++) {
    let ok = true;
    for (const marca of marcas) {
      if (!marca[k]) { ok = false; break; }
    }
    if (ok) {
      todas &= base[k];
      alguma |= base[k];
      achou = true;
    }
  }
  if (!achou) throw new Error('Pistas contraditórias.');
  return (todas | (~alguma & CHEIA)) >>> 0;
}

/**
 * Dado o que se sabe e as pistas reveladas, devolve os personagens que ficam certos (`novos`), o tamanho
 * do menor conjunto de pistas que basta (`k`: 1, 2 ou 3 = todas) e os índices dessas pistas (`usadas`).
 * Sem dedução possível: `{ novos: 0, k: null, usadas: [] }`.
 */
export function passo(pistas, conhecidos) {
  const base = candidatos(conhecidos, []);
  const marcas = pistas.map((p) => {
    const f = compilar(p);
    const marca = new Uint8Array(base.length);
    for (let k = 0; k < base.length; k++) marca[k] = f(base[k]) ? 1 : 0;
    return marca;
  });
  const desconhecidos = (~conhecidos.mascara & CHEIA) >>> 0;

  let novos = 0;
  const usadas = [];
  for (let i = 0; i < marcas.length; i++) {
    const n = (certezas(base, [marcas[i]]) & desconhecidos) >>> 0;
    if (n) { novos |= n; usadas.push(i); }
  }
  if (novos) return { novos: novos >>> 0, k: 1, usadas };

  for (let i = 0; i < marcas.length; i++) {
    for (let j = i + 1; j < marcas.length; j++) {
      const n = (certezas(base, [marcas[i], marcas[j]]) & desconhecidos) >>> 0;
      if (n) { novos |= n; if (!usadas.length) usadas.push(i, j); }
    }
  }
  if (novos) return { novos: novos >>> 0, k: 2, usadas };

  novos = (certezas(base, marcas) & desconhecidos) >>> 0;
  return novos ? { novos, k: 3, usadas: marcas.map((_, i) => i) } : { novos: 0, k: null, usadas: [] };
}
