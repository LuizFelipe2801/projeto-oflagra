import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHEIA, indice } from '../nucleo/grade.js';
import { candidatos, deduzir, filtrar, julgar } from '../nucleo/verificador.js';

const LINHA1 = { tipo: 'linha', valor: 1 };
const umCulpadoNaLinha1 = { tipo: 'contagem', params: { area: LINHA1, n: 1 } };
const todosAEsquerdaDeB1Culpados = { tipo: 'direcao', params: { alvo: indice('B1'), direcao: 'esquerda', valor: 'culpado' } };
// Todos conhecidos e inocentes, menos A1 (bit 0) e B1 (bit 1).
const quaseTudo = { mascara: (CHEIA & ~0b11) >>> 0, culpados: 0 };

test('candidatos enumera só o que não se sabe', () => {
  assert.deepEqual([...candidatos(quaseTudo, [])], [0, 1, 2, 3]);
  assert.equal(candidatos({ mascara: 0, culpados: 0 }, []).length, 2 ** 20);
});

test('candidatos e filtrar aplicam as pistas', () => {
  assert.deepEqual([...candidatos(quaseTudo, [umCulpadoNaLinha1])], [1, 2]);
  assert.deepEqual([...filtrar(candidatos(quaseTudo, []), umCulpadoNaLinha1)], [1, 2]);
});

test('deduzir mostra o que é certo', () => {
  const d = deduzir(Uint32Array.from([0b01, 0b11]));
  assert.equal(d.culpados, 0b01);
  assert.equal(d.inocentes, (CHEIA & ~0b11) >>> 0);
  assert.throws(() => deduzir(new Uint32Array(0)), /Nenhuma solução/);
});

test('julgar recusa o chute e separa acerto de erro', () => {
  const incerta = candidatos(quaseTudo, [umCulpadoNaLinha1]);
  assert.equal(julgar(incerta, 0, true), 'recusada');
  assert.equal(julgar(incerta, 0, false), 'recusada');

  const certa = candidatos(quaseTudo, [umCulpadoNaLinha1, todosAEsquerdaDeB1Culpados]);
  assert.equal(julgar(certa, 0, true), 'acerto');
  assert.equal(julgar(certa, 0, false), 'erro');
  assert.equal(julgar(certa, 1, false), 'acerto');
  assert.equal(julgar(certa, 1, true), 'erro');
});
