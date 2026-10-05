import { test } from 'node:test';
import assert from 'node:assert/strict';
import { texto } from '../nucleo/pistas.js';

const NOMES = ['Ana', 'Bia', 'Caio', 'Duda', 'Edu', 'Fê', 'Gil', 'Hugo', 'Iara', 'Jair',
  'Kátia', 'Léo', 'Mel', 'Nina', 'Otto', 'Paula', 'Quim', 'Rita', 'Sami', 'Téo'];
const P = NOMES.map((nome, i) => ({ nome, profissao: i % 2 ? 'copeira' : 'estagiário' }));
const t = (tipo, params, falante) => texto({ tipo, params }, P, falante);

test('vizinhos em primeira e terceira pessoa', () => {
  assert.equal(t('vizinhos', { alvo: 4, n: 3 }, 4), 'Tenho exatamente 3 culpados entre os vizinhos.');
  assert.equal(t('vizinhos', { alvo: 4, n: 3 }, 0), 'Edu tem exatamente 3 culpados entre os vizinhos.');
  assert.equal(t('vizinhos', { alvo: 4, n: 1 }, 0), 'Edu tem exatamente 1 culpado entre os vizinhos.');
  assert.equal(t('vizinhos', { alvo: 4, n: 0 }, 4), 'Não tenho nenhum culpado entre os vizinhos.');
  assert.equal(t('vizinhos', { alvo: 4, n: 0 }, 0), 'Edu não tem nenhum culpado entre os vizinhos.');
});

test('contagem, maioria, paridade e conexão', () => {
  assert.equal(t('contagem', { area: { tipo: 'linha', valor: 2 }, n: 0 }, 0), 'Não há nenhum culpado na linha 2.');
  assert.equal(t('contagem', { area: { tipo: 'coluna', valor: 'B' }, n: 2 }, 0), 'Há exatamente 2 culpados na coluna B.');
  assert.equal(t('contagem', { area: { tipo: 'borda' }, n: 1 }, 0), 'Há exatamente 1 culpado na borda.');
  assert.equal(t('maioria', { area: { tipo: 'coluna', valor: 'A' }, valor: 'inocente' }, 0), 'Há mais inocentes que culpados na coluna A.');
  assert.equal(t('maioria', { area: { tipo: 'linha', valor: 3 }, valor: 'culpado' }, 0), 'Há mais culpados que inocentes na linha 3.');
  assert.equal(t('paridade', { area: { tipo: 'coluna', valor: 'D' }, impar: true }, 0), 'Há um número ímpar de culpados na coluna D.');
  assert.equal(t('paridade', { area: { tipo: 'borda' }, impar: false }, 0), 'Há um número par de culpados na borda.');
  assert.equal(t('conexao', { area: { tipo: 'coluna', valor: 'B' } }, 0), 'Todos os culpados da coluna B estão conectados.');
});

test('direção', () => {
  assert.equal(t('direcao', { alvo: 4, direcao: 'acima', valor: 'inocente' }, 4), 'Todos acima de mim são inocentes.');
  assert.equal(t('direcao', { alvo: 2, direcao: 'esquerda', valor: 'culpado' }, 0), 'Todos à esquerda de Caio são culpados.');
  assert.equal(t('direcao', { alvo: 2, direcao: 'direita', valor: 'inocente' }, 0), 'Todos à direita de Caio são inocentes.');
  assert.equal(t('direcao', { alvo: 2, direcao: 'abaixo', valor: 'inocente' }, 0), 'Todos abaixo de Caio são inocentes.');
});

test('entre põe "mim" primeiro quando o falante está no par', () => {
  assert.equal(t('entre', { a: 0, b: 3, n: 1 }, 0), 'Há exatamente 1 culpado entre mim e Duda.');
  assert.equal(t('entre', { a: 0, b: 3, n: 1 }, 3), 'Há exatamente 1 culpado entre mim e Ana.');
  assert.equal(t('entre', { a: 0, b: 3, n: 0 }, 5), 'Não há nenhum culpado entre Ana e Duda.');
});

test('profissão', () => {
  assert.equal(t('profissao', { profissao: 'copeira', membros: [1, 3], n: 2 }, 0), 'Entre quem é copeira, há exatamente 2 culpados.');
  assert.equal(t('profissao', { profissao: 'copeira', membros: [1, 3], n: 0 }, 0), 'Entre quem é copeira, não há nenhum culpado.');
});

test('comparação', () => {
  assert.equal(t('comparacao', { a: 0, b: 1 }, 0), 'Tenho mais vizinhos culpados que Bia.');
  assert.equal(t('comparacao', { a: 0, b: 1 }, 1), 'Ana tem mais vizinhos culpados que eu.');
  assert.equal(t('comparacao', { a: 0, b: 1 }, 2), 'Ana tem mais vizinhos culpados que Bia.');
});

test('o falante nunca aparece pelo próprio nome', () => {
  const casos = [
    ['vizinhos', { alvo: 7, n: 2 }], ['direcao', { alvo: 7, direcao: 'acima', valor: 'inocente' }],
    ['entre', { a: 7, b: 15, n: 1 }], ['entre', { a: 3, b: 7, n: 0 }],
    ['comparacao', { a: 7, b: 2 }], ['comparacao', { a: 2, b: 7 }],
  ];
  for (const [tipo, params] of casos) assert.ok(!t(tipo, params, 7).includes('Hugo'), `${tipo}: ${t(tipo, params, 7)}`);
});
