import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { CHEIA, TOTAL } from '../nucleo/grade.js';
import { chavePista, compilar } from '../nucleo/pistas.js';
import { desembaralharSolucao, desserializar, embaralharSolucao, serializar } from '../nucleo/caso.js';
import { DIFICULDADES, NIVEL, gerarCaso } from '../gerador/gerar-caso.js';
import { simular } from '../gerador/simular.js';
import { criarAleatorio } from '../nucleo/aleatorio.js';

const pasta = new URL('../cenarios/', import.meta.url);
const cenarios = readdirSync(pasta).filter((a) => a.endsWith('.json'))
  .map((a) => JSON.parse(readFileSync(new URL(a, pasta), 'utf8')));
const LONGO = { timeout: 600_000 };

test('embaralhar e desembaralhar a solução', () => {
  const r = criarAleatorio(4);
  for (let dia = 0; dia < 365; dia++) {
    const sol = r.inteiro(CHEIA + 1);
    const t = embaralharSolucao(sol, dia);
    assert.equal(typeof t, 'string');
    assert.equal(desembaralharSolucao(t, dia), sol);
  }
});

test('desserializar recusa versão desconhecida', () => {
  assert.throws(() => desserializar({ versao: 2 }), /Versão de caso desconhecida: 2/);
});

test('gerarCaso falha com mensagem clara quando não acha o caso', () => {
  assert.throws(
    () => gerarCaso({ dia: 3, dificuldade: 'dificil', cenarios, maxTentativas: 0 }),
    /Não consegui gerar o caso "dificil" do dia 3 em 0 tentativas/,
  );
  assert.throws(() => gerarCaso({ dia: 3, dificuldade: 'facilimo', cenarios }), /Dificuldade inválida/);
});

for (const dificuldade of DIFICULDADES) {
  test(`caso ${dificuldade} do dia 0: válido, sem chute, na dificuldade certa e reprodutível`, LONGO, () => {
    const caso = gerarCaso({ dia: 0, dificuldade, cenarios });

    // CT-02: pistas verdadeiras; ponto de atenção 4: sem pistas repetidas
    assert.equal(caso.pistas.length, TOTAL);
    for (const p of caso.pistas) assert.equal(compilar(p)(caso.solucao), true, chavePista(p));
    assert.equal(new Set(caso.pistas.map(chavePista)).size, TOTAL);

    // CT-03 e CT-04
    assert.deepEqual(simular(caso), { resolvido: true, dificuldade: NIVEL[dificuldade] });

    // Restrição global: entre 6 e 12 culpados
    const culpados = [...Array(TOTAL).keys()].filter((i) => caso.solucao & (1 << i)).length;
    assert.ok(culpados >= 6 && culpados <= 12);

    // Formato do arquivo e ponto de atenção 5: ninguém fala o próprio nome
    const json = serializar(caso);
    assert.equal(json.versao, 1);
    assert.equal(json.dia_do_ciclo, 0);
    assert.equal(json.personagens[0].pos, 'A1');
    assert.equal(Object.keys(json.pistas).length, TOTAL);
    for (const { pos, nome } of json.personagens) {
      const fala = json.pistas[pos].texto;
      assert.ok(fala.length > 10);
      assert.ok(!new RegExp(`(^|[^\p{L}])${nome}([^\p{L}]|$)`, 'u').test(fala), `${pos}: ${fala}`);
    }

    // Ida e volta pelo formato de arquivo
    const volta = desserializar(JSON.parse(JSON.stringify(json)));
    assert.equal(volta.solucao, caso.solucao);
    assert.equal(volta.inicial, caso.inicial);
    assert.deepEqual(volta.pistas, caso.pistas);
    assert.deepEqual(volta.personagens, caso.personagens);

    // CT-06: mesma entrada, mesmo caso
    assert.deepEqual(serializar(gerarCaso({ dia: 0, dificuldade, cenarios })), json);
  });
}
