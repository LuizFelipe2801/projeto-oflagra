import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHEIA, TOTAL, indice, mascara } from '../nucleo/grade.js';
import { passo, simular } from '../gerador/simular.js';

const m = (...pos) => mascara(pos.map(indice));
const area = (tipo, valor) => (valor === undefined ? { tipo } : { tipo, valor });
const contagem = (a, n) => ({ tipo: 'contagem', params: { area: a, n } });
const paridade = (a, impar) => ({ tipo: 'paridade', params: { area: a, impar } });

test('caso fácil se resolve todo com uma pista por vez', () => {
  const linhas = [contagem(area('linha', 2), 0), contagem(area('linha', 3), 0), contagem(area('linha', 4), 0)];
  const pistas = Array.from({ length: TOTAL }, (_, i) => (i === 0 ? contagem(area('borda'), 0) : linhas[i % 3]));
  assert.deepEqual(simular({ solucao: 0, inicial: 0, pistas }), { resolvido: true, dificuldade: 1 });
});

test('caso que exige chute trava', () => {
  const pistas = Array.from({ length: TOTAL }, () => paridade(area('linha', 3), false));
  assert.deepEqual(simular({ solucao: m('A1'), inicial: 0, pistas }), { resolvido: false, dificuldade: null });
});

test('passo que exige combinar duas pistas', () => {
  // Coluna A conhecida e inocente; o único culpado é C1.
  const conhecidos = { mascara: m('A1', 'A2', 'A3', 'A4', 'A5'), culpados: 0 };
  const pistas = [
    contagem(area('linha', 1), 1),
    { tipo: 'entre', params: { a: indice('A1'), b: indice('D1'), n: 1 } },
    paridade(area('linha', 5), false),
    paridade(area('linha', 4), false),
    contagem(area('coluna', 'A'), 0),
  ];
  assert.deepEqual(passo(pistas, conhecidos), { novos: m('D1'), k: 2 });
});

test('passo que exige combinar três pistas', () => {
  // Desconhecidos: A1, B1, D3, D4, A5. Culpados: A1 e D3. Os outros 15 são conhecidos e inocentes.
  const desconhecidos = m('A1', 'B1', 'D3', 'D4', 'A5');
  const conhecidos = { mascara: (CHEIA & ~desconhecidos) >>> 0, culpados: 0 };
  const pistas = [
    paridade(area('linha', 1), true),
    paridade(area('coluna', 'D'), true),
    paridade(area('borda'), false),
  ];
  assert.deepEqual(passo(pistas, conhecidos), { novos: m('A5'), k: 3 });
});
