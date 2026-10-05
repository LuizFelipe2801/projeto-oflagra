import { test } from 'node:test';
import assert from 'node:assert/strict';
import { indice, mascara } from '../nucleo/grade.js';
import { compilar, chavePista, indicesDaArea, nomeDaArea } from '../nucleo/pistas.js';

const m = (...pos) => mascara(pos.map(indice));
const SOL = m('A1', 'B1', 'B2', 'D5');
const vale = (tipo, params, sol = SOL) => compilar({ tipo, params })(sol);
const LINHA1 = { tipo: 'linha', valor: 1 };
const COL_A = { tipo: 'coluna', valor: 'A' };
const COL_B = { tipo: 'coluna', valor: 'B' };
const COL_D = { tipo: 'coluna', valor: 'D' };

test('áreas', () => {
  assert.deepEqual(indicesDaArea(LINHA1), [0, 1, 2, 3]);
  assert.deepEqual(indicesDaArea(COL_B), [1, 5, 9, 13, 17]);
  assert.equal(indicesDaArea({ tipo: 'borda' }).length, 14);
  assert.equal(nomeDaArea(LINHA1), 'linha 1');
  assert.equal(nomeDaArea(COL_B), 'coluna B');
  assert.equal(nomeDaArea({ tipo: 'borda' }), 'borda');
  assert.throws(() => indicesDaArea({ tipo: 'diagonal' }), /Área inválida/);
});

test('vizinhos', () => {
  assert.equal(vale('vizinhos', { alvo: indice('A2'), n: 3 }), true);
  assert.equal(vale('vizinhos', { alvo: indice('A2'), n: 2 }), false);
});

test('contagem em linha, coluna e borda', () => {
  assert.equal(vale('contagem', { area: LINHA1, n: 2 }), true);
  assert.equal(vale('contagem', { area: COL_B, n: 2 }), true);
  assert.equal(vale('contagem', { area: { tipo: 'borda' }, n: 3 }), true);
  assert.equal(vale('contagem', { area: { tipo: 'borda' }, n: 4 }), false);
});

test('maioria não vale em empate', () => {
  assert.equal(vale('maioria', { area: LINHA1, valor: 'culpado' }), false);
  assert.equal(vale('maioria', { area: LINHA1, valor: 'inocente' }), false);
  assert.equal(vale('maioria', { area: COL_A, valor: 'inocente' }), true);
});

test('paridade', () => {
  assert.equal(vale('paridade', { area: COL_D, impar: true }), true);
  assert.equal(vale('paridade', { area: COL_D, impar: false }), false);
});

test('direção', () => {
  assert.equal(vale('direcao', { alvo: indice('A2'), direcao: 'acima', valor: 'culpado' }), true);
  assert.equal(vale('direcao', { alvo: indice('C5'), direcao: 'direita', valor: 'culpado' }), true);
  assert.equal(vale('direcao', { alvo: indice('A3'), direcao: 'abaixo', valor: 'inocente' }), true);
  assert.equal(vale('direcao', { alvo: indice('A3'), direcao: 'acima', valor: 'inocente' }), false);
});

test('entre', () => {
  assert.equal(vale('entre', { a: indice('A1'), b: indice('D1'), n: 1 }), true);
  assert.equal(vale('entre', { a: indice('A1'), b: indice('D1'), n: 2 }), false);
});

test('profissão', () => {
  const membros = [indice('A1'), indice('C3'), indice('D5')];
  assert.equal(vale('profissao', { profissao: 'copeira', membros, n: 2 }), true);
  assert.equal(vale('profissao', { profissao: 'copeira', membros, n: 1 }), false);
});

test('comparação', () => {
  assert.equal(vale('comparacao', { a: indice('A2'), b: indice('D4') }), true);
  assert.equal(vale('comparacao', { a: indice('D4'), b: indice('A2') }), false);
});

test('conexão', () => {
  assert.equal(vale('conexao', { area: COL_B }), true);
  assert.equal(vale('conexao', { area: LINHA1 }), true);
  assert.equal(vale('conexao', { area: LINHA1 }, SOL | m('D1')), false);
});

test('tipo desconhecido e chave de pista', () => {
  assert.throws(() => compilar({ tipo: 'sorte', params: {} }), /Tipo de pista desconhecido/);
  const a = { tipo: 'contagem', params: { area: LINHA1, n: 2 } };
  const b = { tipo: 'contagem', params: { area: LINHA1, n: 2 } };
  assert.equal(chavePista(a), chavePista(b));
  assert.notEqual(chavePista(a), chavePista({ tipo: 'contagem', params: { area: LINHA1, n: 1 } }));
});
