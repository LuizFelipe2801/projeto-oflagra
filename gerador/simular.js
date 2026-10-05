// Jogador perfeito: confere se o caso se resolve sem chute e mede a dificuldade.
// Em cada passo, o jogador usa o menor número de pistas que basta (1, 2, ou todas).
import { CHEIA, TOTAL } from '../nucleo/grade.js';
import { compilar } from '../nucleo/pistas.js';
import { candidatos } from '../nucleo/verificador.js';

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
  for (const marca of marcas) novos |= certezas(base, [marca]);
  novos = (novos & desconhecidos) >>> 0;
  if (novos) return { novos, k: 1 };

  for (let i = 0; i < marcas.length; i++) {
    for (let j = i + 1; j < marcas.length; j++) novos |= certezas(base, [marcas[i], marcas[j]]);
  }
  novos = (novos & desconhecidos) >>> 0;
  if (novos) return { novos, k: 2 };

  novos = (certezas(base, marcas) & desconhecidos) >>> 0;
  return novos ? { novos, k: 3 } : { novos: 0, k: null };
}

export function simular({ solucao, inicial, pistas }) {
  const bit = (1 << inicial) >>> 0;
  const conhecidos = { mascara: bit, culpados: (solucao & bit) >>> 0 };
  const reveladas = [inicial];
  let dificuldade = 0;
  while (conhecidos.mascara !== CHEIA) {
    const { novos, k } = passo(reveladas.map((i) => pistas[i]), conhecidos);
    if (!novos) return { resolvido: false, dificuldade: null };
    dificuldade = Math.max(dificuldade, k);
    for (let i = 0; i < TOTAL; i++) {
      if (novos & (1 << i)) reveladas.push(i);
    }
    conhecidos.mascara = (conhecidos.mascara | novos) >>> 0;
    conhecidos.culpados = (solucao & conhecidos.mascara) >>> 0;
  }
  return { resolvido: true, dificuldade };
}
