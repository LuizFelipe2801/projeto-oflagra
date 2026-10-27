// Jogador perfeito: confere se o caso se resolve sem chute e mede a dificuldade.
// Em cada passo, o jogador usa o menor número de pistas que basta (1, 2, ou todas).
import { CHEIA, TOTAL } from '../nucleo/grade.js';
import { passo } from '../nucleo/deducao.js';

export { passo };

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
