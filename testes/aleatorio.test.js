import { test } from 'node:test';
import assert from 'node:assert/strict';
import { semente, criarAleatorio } from '../nucleo/aleatorio.js';

test('semente é determinística e muda com o texto', () => {
  assert.equal(semente('abc'), semente('abc'));
  assert.notEqual(semente('abc'), semente('abd'));
  assert.ok(Number.isInteger(semente('abc')) && semente('abc') >= 0);
});

test('mesma semente gera a mesma sequência', () => {
  const a = criarAleatorio(42), b = criarAleatorio(42);
  for (let k = 0; k < 5; k++) assert.equal(a.numero(), b.numero());
});

test('numero fica em [0, 1) e inteiro cobre 0..max-1', () => {
  const r = criarAleatorio(7);
  const vistos = new Set();
  for (let k = 0; k < 1000; k++) {
    const x = r.numero();
    assert.ok(x >= 0 && x < 1);
    vistos.add(r.inteiro(5));
  }
  assert.deepEqual([...vistos].sort(), [0, 1, 2, 3, 4]);
});

test('embaralhar mantém os elementos e não altera a lista original', () => {
  const r = criarAleatorio(1);
  const original = [1, 2, 3, 4, 5, 6];
  const copia = [...original];
  const resultado = r.embaralhar(original);
  assert.deepEqual(original, copia);
  assert.deepEqual([...resultado].sort(), copia);
});

test('ponderado nunca escolhe peso zero e falha sem opções', () => {
  const r = criarAleatorio(3);
  for (let k = 0; k < 100; k++) assert.equal(r.ponderado({ a: 0, b: 1 }), 'b');
  assert.throws(() => r.ponderado({ a: 0 }), /Nenhuma opção/);
});
