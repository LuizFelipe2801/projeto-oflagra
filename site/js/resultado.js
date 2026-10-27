// Texto do resultado para compartilhar. Mostra o desempenho por posição, nunca a solução.
import { ENDERECO, NOME_DA_DIFICULDADE } from './config.js';
import { NUM_COLUNAS } from './nucleo/grade.js';

export const EMOJI = { verde: '🟩', amarelo: '🟨', vermelho: '🟥' };

function minuscula(texto) {
  return texto ? texto[0].toLowerCase() + texto.slice(1) : '';
}

export function contagem(erros, dicas) {
  if (!erros && !dicas) return 'sem erro e sem dica';
  const e = `${erros} erro${erros === 1 ? '' : 's'}`;
  const d = `${dicas} dica${dicas === 1 ? '' : 's'}`;
  return `${e}, ${d}`;
}

export function linhasDaGrade(desempenho) {
  const linhas = [];
  for (let k = 0; k < desempenho.length; k += NUM_COLUNAS) {
    linhas.push(desempenho.slice(k, k + NUM_COLUNAS).map((d) => EMOJI[d]).join(''));
  }
  return linhas;
}

export function textoDoResultado({ numero, dificuldade, cenarioNome, titulo, desempenho, erros, dicas }) {
  return [
    `Flagra #${numero} · ${NOME_DA_DIFICULDADE[dificuldade]}`,
    `${cenarioNome}: ${minuscula(titulo)}`,
    ...linhasDaGrade(desempenho),
    contagem(erros, dicas),
    ENDERECO,
  ].join('\n');
}
