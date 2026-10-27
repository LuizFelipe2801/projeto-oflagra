import { test } from 'node:test';
import assert from 'node:assert/strict';
import { passo } from '../nucleo/deducao.js';
import { daColuna, indice, mascara } from '../nucleo/grade.js';

const A1 = indice('A1');

test('uma pista basta: coluna A toda inocente abaixo de A1', () => {
  const conhecidos = { mascara: 1 << A1, culpados: 0 };
  const pistas = [{ tipo: 'direcao', params: { alvo: A1, direcao: 'abaixo', valor: 'inocente' } }];
  const r = passo(pistas, conhecidos);
  assert.equal(r.k, 1);
  assert.deepEqual(r.usadas, [0]);
  assert.equal(r.novos, mascara(daColuna(0).filter((i) => i !== A1)));
});

test('duas pistas combinadas: contagem na linha 1 mais direção', () => {
  // Linha 1 tem exatamente 1 culpado; todos à direita de B1 são culpados → C1 e D1 culpados
  // é impossível (seriam 2). Logo a pista 2 precisa ser lida junto: "todos à direita de C1" = só D1.
  const C1 = indice('C1');
  const conhecidos = { mascara: 1 << C1, culpados: 0 };
  const pistas = [
    { tipo: 'contagem', params: { area: { tipo: 'linha', valor: 1 }, n: 1 } },
    { tipo: 'direcao', params: { alvo: C1, direcao: 'direita', valor: 'culpado' } },
  ];
  const r = passo(pistas, conhecidos);
  assert.equal(r.k, 1, 'a direção sozinha já resolve D1');
  assert.deepEqual(r.usadas, [1]);
  const r2 = passo(pistas, { mascara: (1 << C1) | (1 << indice('D1')), culpados: 1 << indice('D1') });
  assert.equal(r2.k, 1, 'a contagem sozinha resolve A1 e B1 depois de D1');
  assert.deepEqual(r2.usadas, [0]);
});

test('sem dedução possível devolve novos 0 e usadas vazia', () => {
  const conhecidos = { mascara: 1 << A1, culpados: 0 };
  const pistas = [{ tipo: 'paridade', params: { area: { tipo: 'linha', valor: 5 }, impar: true } }];
  assert.deepEqual(passo(pistas, conhecidos), { novos: 0, k: null, usadas: [] });
});
