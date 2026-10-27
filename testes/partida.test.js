import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { TOTAL } from '../nucleo/grade.js';
import { deduzir } from '../nucleo/verificador.js';
import { gerarCaso } from '../gerador/gerar-caso.js';
import { criarPartida, desempenho, marcar, pedirDica, revelado, salvar, terminada } from '../site/js/partida.js';

const pasta = new URL('../cenarios/', import.meta.url);
const cenarios = readdirSync(pasta).filter((a) => a.endsWith('.json'))
  .map((a) => JSON.parse(readFileSync(new URL(a, pasta), 'utf8')));
const caso = gerarCaso({ dia: 0, dificuldade: 'medio', cenarios });
const eh = (i) => (caso.solucao & (1 << i)) !== 0;

/** Primeiro personagem ainda não revelado que já pode ser deduzido. */
function dedutivel(p) {
  const { culpados, inocentes } = deduzir(p.lista);
  for (let i = 0; i < TOTAL; i++) {
    if (!revelado(p, i) && ((culpados | inocentes) & (1 << i))) return i;
  }
  return -1;
}

test('recusa o chute sem contar erro', () => {
  const p = criarPartida(caso);
  let recusadas = 0;
  for (let i = 0; i < TOTAL; i++) {
    if (marcar(p, i, eh(i)) === 'recusada') recusadas++;
  }
  assert.ok(recusadas > 0, 'no início, algo deve estar fora de alcance');
  assert.equal(p.totalErros, 0);
});

test('erro conta e não revela; acerto revela; revelado é ignorado', () => {
  const p = criarPartida(caso);
  const i = dedutivel(p);
  assert.ok(i >= 0);
  assert.equal(marcar(p, i, !eh(i)), 'erro');
  assert.equal(p.totalErros, 1);
  assert.equal(revelado(p, i), false);
  assert.equal(marcar(p, i, eh(i)), 'acerto');
  assert.equal(revelado(p, i), true);
  assert.equal(p.reveladas.at(-1), i);
  assert.equal(marcar(p, i, eh(i)), 'ja-revelado');
  assert.equal(marcar(p, caso.inicial, true), 'ja-revelado');
  assert.equal(desempenho(p)[i], 'vermelho');
  assert.equal(desempenho(p)[caso.inicial], 'verde');
});

test('dica nível 1 aponta pistas, nível 2 aponta personagem e o marca de amarelo', () => {
  const p = criarPartida(caso);
  const d1 = pedirDica(p);
  assert.equal(d1.nivel, 1);
  assert.ok(d1.pistas.length >= 1);
  assert.ok(d1.pistas.every((i) => revelado(p, i)));
  const d2 = pedirDica(p);
  assert.equal(d2.nivel, 2);
  assert.equal(revelado(p, d2.personagem), false);
  assert.equal(p.totalDicas, 2);
  assert.equal(marcar(p, d2.personagem, eh(d2.personagem)), 'acerto');
  assert.equal(desempenho(p)[d2.personagem], 'amarelo');
  assert.equal(p.nivelDica, 0, 'depois do acerto a próxima dica volta ao nível 1');
});

test('jogar até o fim: termina com tudo verde; salvar e restaurar reproduz o estado', () => {
  const p = criarPartida(caso);
  let passos = 0;
  while (!terminada(p)) {
    const i = dedutivel(p);
    assert.ok(i >= 0, 'caso válido sempre tem alguém dedutível');
    assert.equal(marcar(p, i, eh(i)), 'acerto');
    if (++passos > TOTAL) assert.fail('loop');
  }
  assert.equal(p.reveladas.length, TOTAL);
  assert.ok(desempenho(p).every((x) => x === 'verde'));
  assert.equal(pedirDica(p), null);

  const q = criarPartida(caso);
  const j = dedutivel(q);
  marcar(q, j, !eh(j));
  pedirDica(q);
  const r = criarPartida(caso, JSON.parse(JSON.stringify(salvar(q))));
  assert.deepEqual(r.reveladas, q.reveladas);
  assert.equal(r.totalErros, 1);
  assert.equal(r.totalDicas, 1);
  assert.equal(r.nivelDica, 1);
  assert.deepEqual(Array.from(r.lista), Array.from(q.lista));
});
