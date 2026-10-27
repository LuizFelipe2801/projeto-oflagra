import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contagem, textoDoResultado } from '../site/js/resultado.js';

test('resultado no formato das regras', () => {
  const d = Array(20).fill('verde');
  d[3] = 'amarelo';
  d[5] = 'vermelho';
  d[12] = 'amarelo';
  const texto = textoDoResultado({
    numero: 34, dificuldade: 'medio', cenarioNome: 'A firma', titulo: 'Quem comeu o bolo?', desempenho: d, erros: 1, dicas: 2,
  });
  assert.equal(texto, [
    'Flagra #34 · Médio',
    'A firma: quem comeu o bolo?',
    '🟩🟩🟩🟨',
    '🟩🟥🟩🟩',
    '🟩🟩🟩🟩',
    '🟨🟩🟩🟩',
    '🟩🟩🟩🟩',
    '1 erro, 2 dicas',
    'oflagra.com.br',
  ].join('\n'));
});

test('plural e caso perfeito', () => {
  assert.equal(contagem(0, 0), 'sem erro e sem dica');
  assert.equal(contagem(0, 1), '0 erros, 1 dica');
  assert.equal(contagem(2, 0), '2 erros, 0 dicas');
});
