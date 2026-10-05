import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CHEIA, TOTAL, indice, posicao, vizinhos, daLinha, daColuna,
  naDirecao, entre, borda, mascara, contar, conectados,
} from '../nucleo/grade.js';

const m = (...pos) => mascara(pos.map(indice));

test('indice e posicao se correspondem', () => {
  assert.equal(indice('A1'), 0);
  assert.equal(indice('D1'), 3);
  assert.equal(indice('A2'), 4);
  assert.equal(indice('D5'), 19);
  for (let i = 0; i < TOTAL; i++) assert.equal(indice(posicao(i)), i);
  for (const ruim of ['E1', 'A6', 'A0', 'A10', 'a1', '']) {
    assert.throws(() => indice(ruim), /Posição inválida/);
  }
});

test('vizinhos incluem diagonais', () => {
  assert.deepEqual(vizinhos(indice('A1')).sort((x, y) => x - y), [1, 4, 5]);
  assert.equal(vizinhos(indice('B1')).length, 5);
  assert.equal(vizinhos(indice('B2')).length, 8);
});

test('linhas e colunas', () => {
  assert.deepEqual(daLinha(3), [8, 9, 10, 11]);
  assert.deepEqual(daColuna(1), [1, 5, 9, 13, 17]);
});

test('direções a partir de B3', () => {
  const b3 = indice('B3');
  assert.deepEqual(naDirecao(b3, 'acima'), [indice('B1'), indice('B2')]);
  assert.deepEqual(naDirecao(b3, 'abaixo'), [indice('B4'), indice('B5')]);
  assert.deepEqual(naDirecao(b3, 'esquerda'), [indice('A3')]);
  assert.deepEqual(naDirecao(b3, 'direita'), [indice('C3'), indice('D3')]);
  assert.deepEqual(naDirecao(indice('A1'), 'acima'), []);
  assert.throws(() => naDirecao(b3, 'diagonal'), /Direção inválida/);
});

test('entre em linha, em coluna, vizinhos e diagonal', () => {
  assert.deepEqual(entre(indice('A1'), indice('D1')), [indice('B1'), indice('C1')]);
  assert.deepEqual(entre(indice('D1'), indice('A1')), [indice('B1'), indice('C1')]);
  assert.deepEqual(entre(indice('A1'), indice('A5')), [indice('A2'), indice('A3'), indice('A4')]);
  assert.deepEqual(entre(indice('A1'), indice('B1')), []);
  assert.equal(entre(indice('A1'), indice('B2')), null);
});

test('borda tem 14 personagens e exclui o miolo', () => {
  const b = borda();
  assert.equal(b.length, 14);
  for (const miolo of ['B2', 'C2', 'B3', 'C3', 'B4', 'C4']) assert.ok(!b.includes(indice(miolo)));
});

test('contar bits', () => {
  assert.equal(contar(0), 0);
  assert.equal(contar(0b1011), 3);
  assert.equal(contar(CHEIA), 20);
});

test('conectados usa só os lados e não atravessa a borda', () => {
  assert.equal(conectados(0), true);
  assert.equal(conectados(m('C3')), true);
  assert.equal(conectados(m('A1', 'A2', 'A3')), true);
  assert.equal(conectados(m('A1', 'B1', 'B2')), true);
  assert.equal(conectados(m('A1', 'C1')), false);
  assert.equal(conectados(m('A1', 'B2')), false);
  assert.equal(conectados(m('D1', 'A2')), false); // índices 3 e 4 são vizinhos na numeração, não na grade
});
