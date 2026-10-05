// Verificador lógico: quais soluções ainda são possíveis e o que já é certo.
// É o mesmo módulo no gerador e no site, para que o caso aprovado na geração nunca trave no jogo.
import { CHEIA } from './grade.js';
import { compilar } from './pistas.js';

/** Todas as soluções compatíveis com os personagens conhecidos e com as pistas. */
export function candidatos(conhecidos, pistas) {
  const livres = (~conhecidos.mascara & CHEIA) >>> 0;
  const base = conhecidos.culpados >>> 0;
  const testes = pistas.map(compilar);
  const res = [];
  let sub = 0;
  do {
    const m = (base | sub) >>> 0;
    if (testes.every((f) => f(m))) res.push(m);
    sub = ((sub - livres) & livres) >>> 0;
  } while (sub !== 0);
  return Uint32Array.from(res);
}

export function filtrar(lista, pista) {
  return lista.filter(compilar(pista));
}

/** Máscaras dos personagens cujo valor é igual em todas as soluções possíveis. */
export function deduzir(lista) {
  if (lista.length === 0) throw new Error('Nenhuma solução compatível com as pistas.');
  let todas = CHEIA;
  let alguma = 0;
  for (const m of lista) {
    todas &= m;
    alguma |= m;
  }
  return { culpados: todas >>> 0, inocentes: (~alguma & CHEIA) >>> 0 };
}

/** Julga a marcação do personagem i. "recusada" quando ainda não dá para ter certeza. */
export function julgar(lista, i, culpado) {
  const { culpados, inocentes } = deduzir(lista);
  const bit = (1 << i) >>> 0;
  if (culpados & bit) return culpado ? 'acerto' : 'erro';
  if (inocentes & bit) return culpado ? 'erro' : 'acerto';
  return 'recusada';
}
