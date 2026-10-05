import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOTAL, coluna, linha, mascara, naDirecao } from '../nucleo/grade.js';
import { candidatas, chavePista, compilar } from '../nucleo/pistas.js';
import { criarAleatorio } from '../nucleo/aleatorio.js';

const PROFS = ['copeira', 'estagiário', 'contador', 'RH', 'TI'];
const personagens = Array.from({ length: TOTAL }, (_, i) => ({ nome: `P${i}`, profissao: PROFS[i % 5] }));

function solucaoAleatoria(r) {
  const n = 6 + r.inteiro(7);
  return mascara(r.embaralhar([...Array(TOTAL).keys()]).slice(0, n));
}

test('toda candidata é verdadeira para a solução (50 soluções)', () => {
  const r = criarAleatorio(99);
  for (let k = 0; k < 50; k++) {
    const sol = solucaoAleatoria(r);
    for (const p of candidatas(sol, personagens)) assert.equal(compilar(p)(sol), true, chavePista(p));
  }
});

test('sem repetição', () => {
  const lista = candidatas(solucaoAleatoria(criarAleatorio(5)), personagens);
  assert.equal(new Set(lista.map(chavePista)).size, lista.length);
});

test('regras de utilidade de cada tipo', () => {
  const sol = solucaoAleatoria(criarAleatorio(11));
  const lista = candidatas(sol, personagens);
  const deTipo = (t) => lista.filter((p) => p.tipo === t);
  assert.equal(deTipo('vizinhos').length, TOTAL);
  for (const p of deTipo('direcao')) assert.ok(naDirecao(p.params.alvo, p.params.direcao).length > 0);
  for (const p of deTipo('conexao')) assert.notEqual(p.params.area.tipo, 'borda');
  for (const p of deTipo('comparacao')) {
    const { a, b } = p.params;
    assert.ok(a !== b && Math.abs(linha(a) - linha(b)) <= 2 && Math.abs(coluna(a) - coluna(b)) <= 2);
  }
  for (const p of deTipo('profissao')) {
    assert.ok(p.params.membros.length >= 2);
    for (const i of p.params.membros) assert.equal(personagens[i].profissao, p.params.profissao);
  }
  for (const p of deTipo('entre')) assert.ok(p.params.a < p.params.b);
});
