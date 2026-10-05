// Tipos de pista: avaliação, texto e geração das pistas verdadeiras de uma solução.
import {
  COLUNAS, TOTAL, borda, coluna, conectados, contar, daColuna, daLinha,
  entre, linha, mascara, naDirecao, vizinhos,
} from './grade.js';

const VIZINHOS = Array.from({ length: TOTAL }, (_, i) => mascara(vizinhos(i)));

export function indicesDaArea(area) {
  switch (area?.tipo) {
    case 'linha': return daLinha(area.valor);
    case 'coluna': return daColuna(COLUNAS.indexOf(area.valor));
    case 'borda': return borda();
    default: throw new Error(`Área inválida: ${JSON.stringify(area)}`);
  }
}

export function nomeDaArea(area) {
  return area.tipo === 'borda' ? 'borda' : `${area.tipo} ${area.valor}`;
}

export function chavePista(pista) {
  return JSON.stringify([pista.tipo, pista.params]);
}

/** Transforma a pista numa função que diz se uma solução (máscara) a satisfaz. */
export function compilar(pista) {
  const p = pista.params;
  switch (pista.tipo) {
    case 'vizinhos': {
      const v = VIZINHOS[p.alvo];
      return (m) => contar(m & v) === p.n;
    }
    case 'contagem': {
      const a = mascara(indicesDaArea(p.area));
      return (m) => contar(m & a) === p.n;
    }
    case 'maioria': {
      const a = mascara(indicesDaArea(p.area));
      const t = contar(a);
      return p.valor === 'culpado'
        ? (m) => 2 * contar(m & a) > t
        : (m) => 2 * contar(m & a) < t;
    }
    case 'paridade': {
      const a = mascara(indicesDaArea(p.area));
      return (m) => (contar(m & a) % 2 === 1) === p.impar;
    }
    case 'direcao': {
      const d = mascara(naDirecao(p.alvo, p.direcao));
      return p.valor === 'culpado'
        ? (m) => ((m & d) >>> 0) === d
        : (m) => (m & d) === 0;
    }
    case 'entre': {
      const e = mascara(entre(p.a, p.b) ?? []);
      return (m) => contar(m & e) === p.n;
    }
    case 'profissao': {
      const g = mascara(p.membros);
      return (m) => contar(m & g) === p.n;
    }
    case 'comparacao': {
      const va = VIZINHOS[p.a];
      const vb = VIZINHOS[p.b];
      return (m) => contar(m & va) > contar(m & vb);
    }
    case 'conexao': {
      const a = mascara(indicesDaArea(p.area));
      return (m) => conectados(m & a);
    }
    default:
      throw new Error(`Tipo de pista desconhecido: ${pista.tipo}`);
  }
}
