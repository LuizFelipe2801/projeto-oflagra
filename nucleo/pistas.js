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

const DIRECAO = { acima: 'acima de', abaixo: 'abaixo de', esquerda: 'à esquerda de', direita: 'à direita de' };

function quantidade(n) {
  return n === 1 ? 'exatamente 1 culpado' : `exatamente ${n} culpados`;
}

/** Texto da pista dito pelo personagem `falante` (que fala de si em primeira pessoa). */
export function texto(pista, personagens, falante) {
  const p = pista.params;
  const nome = (i) => personagens[i].nome;
  switch (pista.tipo) {
    case 'vizinhos': {
      const eu = p.alvo === falante;
      if (p.n === 0) {
        return eu ? 'Não tenho nenhum culpado entre os vizinhos.' : `${nome(p.alvo)} não tem nenhum culpado entre os vizinhos.`;
      }
      return eu ? `Tenho ${quantidade(p.n)} entre os vizinhos.` : `${nome(p.alvo)} tem ${quantidade(p.n)} entre os vizinhos.`;
    }
    case 'contagem':
      return p.n === 0
        ? `Não há nenhum culpado na ${nomeDaArea(p.area)}.`
        : `Há ${quantidade(p.n)} na ${nomeDaArea(p.area)}.`;
    case 'maioria':
      return `Há mais ${p.valor === 'culpado' ? 'culpados que inocentes' : 'inocentes que culpados'} na ${nomeDaArea(p.area)}.`;
    case 'paridade':
      return `Há um número ${p.impar ? 'ímpar' : 'par'} de culpados na ${nomeDaArea(p.area)}.`;
    case 'direcao': {
      const quem = p.alvo === falante ? 'mim' : nome(p.alvo);
      return `Todos ${DIRECAO[p.direcao]} ${quem} são ${p.valor}s.`;
    }
    case 'entre': {
      const [x, y] = p.b === falante ? [p.b, p.a] : [p.a, p.b];
      const par = x === falante ? `mim e ${nome(y)}` : `${nome(x)} e ${nome(y)}`;
      return p.n === 0 ? `Não há nenhum culpado entre ${par}.` : `Há ${quantidade(p.n)} entre ${par}.`;
    }
    case 'profissao':
      return p.n === 0
        ? `Entre quem é ${p.profissao}, não há nenhum culpado.`
        : `Entre quem é ${p.profissao}, há ${quantidade(p.n)}.`;
    case 'comparacao':
      if (p.a === falante) return `Tenho mais vizinhos culpados que ${nome(p.b)}.`;
      if (p.b === falante) return `${nome(p.a)} tem mais vizinhos culpados que eu.`;
      return `${nome(p.a)} tem mais vizinhos culpados que ${nome(p.b)}.`;
    case 'conexao':
      return `Todos os culpados da ${nomeDaArea(p.area)} estão conectados.`;
    default:
      throw new Error(`Tipo de pista desconhecido: ${pista.tipo}`);
  }
}

const AREAS = [
  ...[1, 2, 3, 4, 5].map((valor) => ({ tipo: 'linha', valor })),
  ...COLUNAS.map((valor) => ({ tipo: 'coluna', valor })),
  { tipo: 'borda' },
];

/** Todas as pistas verdadeiras e úteis para a solução dada, sem repetição. */
export function candidatas(solucao, personagens) {
  const m = solucao >>> 0;
  const lista = [];
  const add = (tipo, params) => lista.push({ tipo, params });
  const qtd = (indices) => contar(m & mascara(indices));

  for (let i = 0; i < TOTAL; i++) add('vizinhos', { alvo: i, n: qtd(vizinhos(i)) });

  for (const area of AREAS) {
    const idx = indicesDaArea(area);
    const n = qtd(idx);
    add('contagem', { area, n });
    add('paridade', { area, impar: n % 2 === 1 });
    if (2 * n !== idx.length) add('maioria', { area, valor: 2 * n > idx.length ? 'culpado' : 'inocente' });
    if (area.tipo !== 'borda' && n >= 2 && conectados(m & mascara(idx))) add('conexao', { area });
  }

  for (let i = 0; i < TOTAL; i++) {
    for (const direcao of ['acima', 'abaixo', 'esquerda', 'direita']) {
      const idx = naDirecao(i, direcao);
      if (!idx.length) continue;
      const n = qtd(idx);
      if (n === 0) add('direcao', { alvo: i, direcao, valor: 'inocente' });
      else if (n === idx.length) add('direcao', { alvo: i, direcao, valor: 'culpado' });
    }
  }

  for (let a = 0; a < TOTAL; a++) {
    for (let b = a + 1; b < TOTAL; b++) {
      const e = entre(a, b);
      if (e && e.length) add('entre', { a, b, n: qtd(e) });
    }
  }

  const porProfissao = {};
  personagens.forEach((p, i) => (porProfissao[p.profissao] ??= []).push(i));
  for (const [profissao, membros] of Object.entries(porProfissao)) {
    if (membros.length >= 2) add('profissao', { profissao, membros, n: qtd(membros) });
  }

  for (let a = 0; a < TOTAL; a++) {
    for (let b = 0; b < TOTAL; b++) {
      if (a === b || Math.abs(linha(a) - linha(b)) > 2 || Math.abs(coluna(a) - coluna(b)) > 2) continue;
      if (qtd(vizinhos(a)) > qtd(vizinhos(b))) add('comparacao', { a, b });
    }
  }

  return lista;
}
