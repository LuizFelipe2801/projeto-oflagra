// Formato do arquivo de caso (versão 1). Usado pelo gerador para gravar e pelo site para ler.
import { CHEIA, TOTAL, indice, posicao } from './grade.js';
import { semente } from './aleatorio.js';
import { texto } from './pistas.js';

const chave = (dia) => (semente(`flagra-solucao-${dia}`) & CHEIA) >>> 0;

/** Não é segurança: só evita ver a resposta sem querer ao abrir o arquivo. */
export function embaralharSolucao(solucao, dia) {
  return ((solucao ^ chave(dia)) >>> 0).toString(36);
}

export function desembaralharSolucao(textoSolucao, dia) {
  return (parseInt(textoSolucao, 36) ^ chave(dia)) >>> 0;
}

export function serializar(caso) {
  return {
    versao: 1,
    dia_do_ciclo: caso.dia,
    dificuldade: caso.dificuldade,
    cenario: caso.cenario,
    titulo: caso.titulo,
    personagens: caso.personagens.map((p, i) => ({ pos: posicao(i), nome: p.nome, profissao: p.profissao })),
    inicial: posicao(caso.inicial),
    pistas: Object.fromEntries(caso.pistas.map((p, i) => [
      posicao(i),
      { tipo: p.tipo, params: p.params, texto: texto(p, caso.personagens, i) },
    ])),
    solucao: embaralharSolucao(caso.solucao, caso.dia),
  };
}

export function desserializar(json) {
  if (json?.versao !== 1) throw new Error(`Versão de caso desconhecida: ${json?.versao}`);
  const personagens = new Array(TOTAL);
  const pistas = new Array(TOTAL);
  for (const p of json.personagens) personagens[indice(p.pos)] = { nome: p.nome, profissao: p.profissao };
  for (const [pos, p] of Object.entries(json.pistas)) pistas[indice(pos)] = { tipo: p.tipo, params: p.params };
  return {
    dia: json.dia_do_ciclo,
    dificuldade: json.dificuldade,
    cenario: json.cenario,
    titulo: json.titulo,
    personagens,
    solucao: desembaralharSolucao(json.solucao, json.dia_do_ciclo),
    inicial: indice(json.inicial),
    pistas,
  };
}
