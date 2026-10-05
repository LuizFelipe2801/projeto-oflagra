import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nomeDoArquivo } from '../gerador/gerar.js';
import { problemasDoCaso } from '../gerador/validar.js';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const rodar = (...args) => spawnSync(process.execPath, args, { cwd: raiz, encoding: 'utf8' });
const temporaria = () => mkdtempSync(join(tmpdir(), 'flagra-'));

test('nome do arquivo tem três dígitos', () => {
  assert.equal(nomeDoArquivo(7, 'facil'), '007-facil.json');
  assert.equal(nomeDoArquivo(364, 'dificil'), '364-dificil.json');
});

test('gera só o trecho pedido, e o validador aprova', { timeout: 900_000 }, () => {
  const saida = temporaria();
  try {
    const g = rodar('gerador/gerar.js', '--inicio', '5', '--dias', '1', '--saida', saida);
    assert.equal(g.status, 0, g.stderr);
    assert.deepEqual(readdirSync(saida).sort(), ['005-dificil.json', '005-facil.json', '005-medio.json']);

    const nomesDosCenarios = new Set(readdirSync(join(raiz, 'cenarios'))
      .flatMap((a) => JSON.parse(readFileSync(join(raiz, 'cenarios', a), 'utf8')).nomes));
    for (const arquivo of readdirSync(saida)) {
      const json = JSON.parse(readFileSync(join(saida, arquivo), 'utf8'));
      for (const p of json.personagens) assert.ok(nomesDosCenarios.has(p.nome), `nome corrompido: ${p.nome}`);
    }

    const v = rodar('gerador/validar.js', '--pasta', saida);
    assert.equal(v.status, 0, v.stdout + v.stderr);
    assert.match(v.stdout, /3 casos conferidos, nenhum problema/);
  } finally {
    rmSync(saida, { recursive: true, force: true });
  }
});

test('o validador aponta pista falsa', { timeout: 900_000 }, () => {
  const saida = temporaria();
  try {
    assert.equal(rodar('gerador/gerar.js', '--dias', '1', '--saida', saida).status, 0);
    const arquivo = join(saida, '000-facil.json');
    const json = JSON.parse(readFileSync(arquivo, 'utf8'));
    const pos = Object.keys(json.pistas).find((k) => json.pistas[k].tipo === 'vizinhos');
    json.pistas[pos].params.n = (json.pistas[pos].params.n + 1) % 9;
    assert.ok(problemasDoCaso(json).some((p) => p.includes(`pista de ${pos} é falsa`)));
    writeFileSync(arquivo, JSON.stringify(json));
    const v = rodar('gerador/validar.js', '--pasta', saida);
    assert.equal(v.status, 1);
    assert.match(v.stdout, /000-facil\.json/);
  } finally {
    rmSync(saida, { recursive: true, force: true });
  }
});

test('erros de entrada saem com código 1 e mensagem clara', () => {
  const vazia = temporaria();
  const ruim = temporaria();
  try {
    let r = rodar('gerador/gerar.js', '--dias', '1', '--cenarios', vazia, '--saida', join(vazia, 'saida'));
    assert.equal(r.status, 1);
    assert.match(r.stderr, /Nenhum cenário encontrado/);

    writeFileSync(join(ruim, 'quebrado.json'), '{ isto não é json');
    r = rodar('gerador/gerar.js', '--dias', '1', '--cenarios', ruim, '--saida', join(ruim, 'saida'));
    assert.equal(r.status, 1);
    assert.match(r.stderr, /quebrado\.json não é um JSON válido/);

    r = rodar('gerador/gerar.js', '--dias', '0');
    assert.equal(r.status, 1);
    assert.match(r.stderr, /--dias/);

    mkdirSync(join(vazia, 'casos'));
    r = rodar('gerador/validar.js', '--pasta', join(vazia, 'casos'));
    assert.equal(r.status, 1);
    assert.match(r.stderr, /Nenhum caso encontrado/);
  } finally {
    rmSync(vazia, { recursive: true, force: true });
    rmSync(ruim, { recursive: true, force: true });
  }
});
