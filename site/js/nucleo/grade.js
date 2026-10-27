// Geometria da grade 4 × 5. Índice i = (linha - 1) * 4 + coluna; coluna A = 0; linha 1 em cima.
// Conjuntos de personagens são máscaras de 20 bits (bit i = personagem i).

export const COLUNAS = ['A', 'B', 'C', 'D'];
export const NUM_COLUNAS = 4;
export const NUM_LINHAS = 5;
export const TOTAL = NUM_COLUNAS * NUM_LINHAS;
export const CHEIA = (1 << TOTAL) - 1;

const em = (c, l) => (l - 1) * NUM_COLUNAS + c;

export function coluna(i) { return i % NUM_COLUNAS; }
export function linha(i) { return Math.floor(i / NUM_COLUNAS) + 1; }

export function indice(pos) {
  const c = COLUNAS.indexOf(String(pos)[0]);
  const l = Number(String(pos).slice(1));
  if (String(pos).length !== 2 || c < 0 || !(l >= 1 && l <= NUM_LINHAS)) {
    throw new Error(`Posição inválida: ${pos}`);
  }
  return em(c, l);
}

export function posicao(i) { return COLUNAS[coluna(i)] + linha(i); }

export function vizinhos(i) {
  const res = [];
  for (let dl = -1; dl <= 1; dl++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dl && !dc) continue;
      const c = coluna(i) + dc;
      const l = linha(i) + dl;
      if (c >= 0 && c < NUM_COLUNAS && l >= 1 && l <= NUM_LINHAS) res.push(em(c, l));
    }
  }
  return res;
}

export function daLinha(l) { return COLUNAS.map((_, c) => em(c, l)); }

export function daColuna(c) { return Array.from({ length: NUM_LINHAS }, (_, k) => em(c, k + 1)); }

export function naDirecao(i, direcao) {
  const c = coluna(i);
  const l = linha(i);
  switch (direcao) {
    case 'acima': return Array.from({ length: l - 1 }, (_, k) => em(c, k + 1));
    case 'abaixo': return Array.from({ length: NUM_LINHAS - l }, (_, k) => em(c, l + 1 + k));
    case 'esquerda': return Array.from({ length: c }, (_, k) => em(k, l));
    case 'direita': return Array.from({ length: NUM_COLUNAS - 1 - c }, (_, k) => em(c + 1 + k, l));
    default: throw new Error(`Direção inválida: ${direcao}`);
  }
}

export function entre(a, b) {
  const [i, j] = a < b ? [a, b] : [b, a];
  if (linha(i) === linha(j)) return Array.from({ length: Math.max(0, j - i - 1) }, (_, k) => i + 1 + k);
  if (coluna(i) === coluna(j)) {
    const res = [];
    for (let k = i + NUM_COLUNAS; k < j; k += NUM_COLUNAS) res.push(k);
    return res;
  }
  return null;
}

export function borda() {
  return Array.from({ length: TOTAL }, (_, i) => i).filter((i) =>
    linha(i) === 1 || linha(i) === NUM_LINHAS || coluna(i) === 0 || coluna(i) === NUM_COLUNAS - 1);
}

export function mascara(indices) {
  return indices.reduce((m, i) => (m | (1 << i)) >>> 0, 0);
}

export function contar(x) {
  x >>>= 0;
  x -= (x >>> 1) & 0x55555555;
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  return Math.imul((x + (x >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24;
}

const SEM_A = (CHEIA & ~mascara(daColuna(0))) >>> 0;
const SEM_D = (CHEIA & ~mascara(daColuna(NUM_COLUNAS - 1))) >>> 0;

/** Verdadeiro se os bits ligados formam um único grupo ligado pelos lados (0 ou 1 bit: verdadeiro). */
export function conectados(m) {
  m >>>= 0;
  if (contar(m) <= 1) return true;
  let grupo = (m & -m) >>> 0;
  for (;;) {
    const proximo = (grupo
      | ((grupo << 1) & SEM_A)
      | ((grupo >>> 1) & SEM_D)
      | ((grupo << NUM_COLUNAS) & CHEIA)
      | (grupo >>> NUM_COLUNAS)) & m;
    if ((proximo >>> 0) === grupo) break;
    grupo = proximo >>> 0;
  }
  return grupo === m;
}
