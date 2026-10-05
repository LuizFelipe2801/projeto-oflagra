import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { criarAleatorio } from '../nucleo/aleatorio.js';
import { escolherCenario, montarPersonagens, validarCenario } from '../gerador/montar.js';

const pasta = new URL('../cenarios/', import.meta.url);
const reais = readdirSync(pasta).filter((a) => a.endsWith('.json')).sort()
  .map((a) => [a, JSON.parse(readFileSync(new URL(a, pasta), 'utf8'))]);

const base = () => ({
  id: 'teste', nome: 'Teste', travessuras: ['Quem foi?'],
  profissoes: ['a', 'b', 'c', 'd', 'e', 'f'],
  nomes: Array.from({ length: 20 }, (_, i) => `N${i}`),
});

test('os cenários do repositório são válidos', () => {
  assert.ok(reais.length >= 3);
  for (const [arquivo, c] of reais) validarCenario(c, arquivo);
});

test('validarCenario recusa cenários malformados citando o arquivo', () => {
  validarCenario(base(), 'ok.json');
  assert.throws(() => validarCenario({ ...base(), nomes: base().nomes.slice(0, 19) }, 'x.json'), /x\.json.*pelo menos 20 nomes/);
  assert.throws(() => validarCenario({ ...base(), nomes: [...base().nomes.slice(0, 19), 'N0'] }, 'x.json'), /nome repetido: N0/);
  assert.throws(() => validarCenario({ ...base(), profissoes: ['a', 'b', 'c', 'd'] }, 'x.json'), /pelo menos 5 profissões/);
  assert.throws(() => validarCenario({ ...base(), travessuras: [] }, 'x.json'), /pelo menos 1 travessura/);
  assert.throws(() => validarCenario({ ...base(), id: '' }, 'x.json'), /id/);
});

test('montarPersonagens: 20 nomes únicos e cada profissão de 2 a 4 vezes', () => {
  for (const [, c] of reais) {
    const ps = montarPersonagens(c, criarAleatorio(1));
    assert.equal(ps.length, 20);
    assert.equal(new Set(ps.map((p) => p.nome)).size, 20);
    const conta = {};
    for (const p of ps) conta[p.profissao] = (conta[p.profissao] ?? 0) + 1;
    for (const n of Object.values(conta)) assert.ok(n >= 2 && n <= 4, JSON.stringify(conta));
  }
  assert.deepEqual(montarPersonagens(base(), criarAleatorio(8)), montarPersonagens(base(), criarAleatorio(8)));
});

test('escolherCenario: três dificuldades diferentes no mesmo dia e rodízio entre dias', () => {
  const doze = Array.from({ length: 12 }, (_, i) => ({ id: `c${String(i).padStart(2, '0')}` }));
  const doDia = ['facil', 'medio', 'dificil'].map((d) => escolherCenario(doze, 0, d).id);
  assert.equal(new Set(doDia).size, 3);
  const facilNaSemana = Array.from({ length: 7 }, (_, dia) => escolherCenario(doze, dia, 'facil').id);
  assert.equal(new Set(facilNaSemana).size, 7);
  assert.throws(() => escolherCenario(doze, 0, 'impossivel'), /Dificuldade inválida/);
});
