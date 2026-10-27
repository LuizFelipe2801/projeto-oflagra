// Sorteio com semente. Mesmo texto de semente, mesma sequência, em qualquer máquina.

/** FNV-1a de 32 bits: transforma um texto num número de semente. */
export function semente(texto) {
  let h = 0x811c9dc5;
  for (const ch of String(texto)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Gerador mulberry32, com utilitários de sorteio. */
export function criarAleatorio(sementeInicial) {
  let a = sementeInicial >>> 0;
  const numero = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const inteiro = (max) => Math.floor(numero() * max);
  return {
    numero,
    inteiro,
    escolher: (lista) => lista[inteiro(lista.length)],
    embaralhar(lista) {
      const c = [...lista];
      for (let i = c.length - 1; i > 0; i--) {
        const j = inteiro(i + 1);
        [c[i], c[j]] = [c[j], c[i]];
      }
      return c;
    },
    ponderado(pesos) {
      const entradas = Object.entries(pesos).filter(([, w]) => w > 0);
      const total = entradas.reduce((s, [, w]) => s + w, 0);
      if (!total) throw new Error('Nenhuma opção com peso positivo.');
      let r = numero() * total;
      for (const [chave, w] of entradas) {
        r -= w;
        if (r < 0) return chave;
      }
      return entradas[entradas.length - 1][0];
    },
  };
}
