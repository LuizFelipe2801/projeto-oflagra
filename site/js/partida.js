// Estado de uma partida: marcações sem chute, erros, dicas em dois níveis e desempenho por posição.
import { CHEIA, TOTAL } from './nucleo/grade.js';
import { candidatos, julgar } from './nucleo/verificador.js';
import { passo } from './nucleo/deducao.js';

function recalcular(p) {
  p.lista = candidatos(p.conhecidos, p.reveladas.map((i) => p.caso.pistas[i]));
}

/** Cria a partida de um caso; `salvo` (de `salvar`) restaura uma partida em andamento. */
export function criarPartida(caso, salvo = null) {
  const bit = (1 << caso.inicial) >>> 0;
  const p = {
    caso,
    conhecidos: { mascara: bit, culpados: (caso.solucao & bit) >>> 0 },
    reveladas: [caso.inicial],
    erros: new Uint8Array(TOTAL),
    comDica: new Uint8Array(TOTAL),
    totalErros: 0,
    totalDicas: 0,
    nivelDica: 0,
    ultimaDica: null,
    lista: null,
  };
  if (salvo) {
    for (const i of salvo.reveladas) {
      if (i === caso.inicial) continue;
      p.reveladas.push(i);
      p.conhecidos.mascara = (p.conhecidos.mascara | (1 << i)) >>> 0;
    }
    p.conhecidos.culpados = (caso.solucao & p.conhecidos.mascara) >>> 0;
    p.erros.set(salvo.erros);
    p.comDica.set(salvo.comDica);
    p.totalErros = salvo.totalErros;
    p.totalDicas = salvo.totalDicas;
    p.nivelDica = salvo.nivelDica ?? 0;
  }
  recalcular(p);
  return p;
}

export function revelado(p, i) {
  return (p.conhecidos.mascara & (1 << i)) !== 0;
}

export function culpado(p, i) {
  return (p.caso.solucao & (1 << i)) !== 0;
}

/** Marca o personagem i. Devolve 'acerto', 'erro', 'recusada' ou 'ja-revelado'. */
export function marcar(p, i, ehCulpado) {
  if (revelado(p, i)) return 'ja-revelado';
  const r = julgar(p.lista, i, ehCulpado);
  if (r === 'erro') {
    p.erros[i]++;
    p.totalErros++;
  } else if (r === 'acerto') {
    p.reveladas.push(i);
    p.conhecidos.mascara = (p.conhecidos.mascara | (1 << i)) >>> 0;
    p.conhecidos.culpados = (p.caso.solucao & p.conhecidos.mascara) >>> 0;
    p.nivelDica = 0;
    p.ultimaDica = null;
    recalcular(p);
  }
  return r;
}

/**
 * Dica em dois níveis: a primeira aponta as pistas que resolvem alguém; a segunda aponta o personagem.
 * Devolve null se nada for dedutível (não acontece em caso válido).
 */
export function pedirDica(p) {
  if (terminada(p)) return null;
  const { novos, usadas } = passo(p.reveladas.map((i) => p.caso.pistas[i]), p.conhecidos);
  if (!novos) return null;
  p.totalDicas++;
  if (p.nivelDica === 0) {
    p.nivelDica = 1;
    p.ultimaDica = { nivel: 1, pistas: usadas.map((k) => p.reveladas[k]) };
  } else {
    let personagem = 0;
    while (!(novos & (1 << personagem))) personagem++;
    p.comDica[personagem] = 1;
    p.ultimaDica = { nivel: 2, personagem, pistas: usadas.map((k) => p.reveladas[k]) };
  }
  return p.ultimaDica;
}

export function terminada(p) {
  return p.conhecidos.mascara === CHEIA;
}

/** 'verde' acertou de primeira, 'amarelo' acertou depois de dica, 'vermelho' errou pelo menos uma vez. */
export function desempenho(p) {
  return Array.from({ length: TOTAL }, (_, i) =>
    (p.erros[i] ? 'vermelho' : p.comDica[i] ? 'amarelo' : 'verde'));
}

export function salvar(p) {
  return {
    reveladas: [...p.reveladas],
    erros: Array.from(p.erros),
    comDica: Array.from(p.comDica),
    totalErros: p.totalErros,
    totalDicas: p.totalDicas,
    nivelDica: p.nivelDica,
  };
}
