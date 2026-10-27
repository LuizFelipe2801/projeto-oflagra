import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarEstado, estatisticas, sequencia } from '../site/js/estado.js';

function memoria() {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}

test('progresso vai e volta; chave de outro caso devolve null', () => {
  const e = criarEstado(memoria());
  assert.equal(e.disponivel, true);
  assert.equal(e.carregarProgresso(5, 'facil'), null);
  e.salvarProgresso(5, 'facil', { reveladas: [3], totalErros: 1 });
  assert.deepEqual(e.carregarProgresso(5, 'facil'), { reveladas: [3], totalErros: 1, numero: 5, dificuldade: 'facil' });
  assert.equal(e.carregarProgresso(6, 'facil'), null);
  e.apagarProgresso(5, 'facil');
  assert.equal(e.carregarProgresso(5, 'facil'), null);
});

test('sem armazenamento, nada lança', () => {
  const falha = () => { throw new Error('bloqueado'); };
  const e = criarEstado({ getItem: falha, setItem: falha, removeItem: falha });
  assert.equal(e.disponivel, false);
  assert.equal(e.salvarProgresso(1, 'facil', {}), false);
  assert.equal(e.carregarProgresso(1, 'facil'), null);
  assert.deepEqual(e.carregarHistorico(), {});
  assert.doesNotThrow(() => e.registrarConclusao('2026-10-27', 1, 'facil', { erros: 0, dicas: 0 }));
  assert.equal(e.lerPreferencia('regras'), null);
});

test('histórico, sequência e estatísticas', () => {
  const e = criarEstado(memoria());
  e.registrarConclusao('2026-10-25', 1, 'facil', { erros: 0, dicas: 1 });
  e.registrarConclusao('2026-10-26', 1, 'medio', { erros: 2, dicas: 0 });
  const h = e.registrarConclusao('2026-10-27', 1, 'facil', { erros: 0, dicas: 0 });
  assert.equal(sequencia(h, '2026-10-27'), 3);
  assert.equal(sequencia(h, '2026-10-28'), 3, 'ontem jogou: a sequência segue viva');
  assert.equal(sequencia(h, '2026-10-29'), 0);
  assert.equal(sequencia({}, '2026-10-29'), 0);
  assert.equal(sequencia({ '2026-10-20': { facil: {} }, '2026-10-27': { facil: {} } }, '2026-10-27'), 1);
  assert.deepEqual(estatisticas(h), {
    facil: { jogos: 2, semErro: 2 }, medio: { jogos: 1, semErro: 0 }, dificil: { jogos: 0, semErro: 0 },
  });
});
