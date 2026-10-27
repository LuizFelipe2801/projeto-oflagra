import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arquivoDoCaso, dataAnterior, dataDeHoje, diaDoCiclo, diasEntre, numeroDoCaso } from '../site/js/calendario.js';

test('dataDeHoje usa o horário de Brasília', () => {
  assert.equal(dataDeHoje(new Date('2026-10-28T02:30:00Z')), '2026-10-27');
  assert.equal(dataDeHoje(new Date('2026-10-28T03:30:00Z')), '2026-10-28');
});

test('número do caso conta desde o lançamento e não volta no fim do ciclo', () => {
  assert.equal(numeroDoCaso('2026-10-27'), 1);
  assert.equal(numeroDoCaso('2026-10-01'), 1);
  assert.equal(numeroDoCaso('2026-11-29'), 34);
  assert.equal(numeroDoCaso('2027-10-27'), 366);
  assert.equal(diaDoCiclo(366), 0);
  assert.equal(diaDoCiclo(34), 33);
});

test('nome do arquivo e datas', () => {
  assert.equal(arquivoDoCaso(35, 'medio'), 'casos/034-medio.json');
  assert.equal(dataAnterior('2026-03-01'), '2026-02-28');
  assert.equal(diasEntre('2026-01-01', '2026-12-31'), 364);
});
