# Plano 1: núcleo e gerador do Flagra

> **Para quem executar com agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para executar este plano tarefa por tarefa. Os passos usam caixas de seleção (`- [ ]`) para acompanhamento.

**Objetivo:** um comando (`npm run gerar`) que produz casos do Flagra com solução única, resolvíveis sem chute e classificados em fácil, médio e difícil, mais um validador que confere os arquivos gerados.

**Arquitetura:** o `nucleo/` é JavaScript puro em módulos ES, sem dependências e sem APIs do Node, para rodar também no navegador (o site, no Plano 2, usa os mesmos arquivos). A solução e as máscaras de personagens são números de 20 bits (bit `i` ligado = personagem `i` culpado). O verificador enumera as soluções compatíveis com o que se sabe e diz o que já é certo. O `gerador/` (Node) sorteia casos, simula um jogador perfeito para garantir solução única sem chute e mede a dificuldade pelo número de pistas que precisam ser combinadas.

**Tecnologia:** Node.js 24, módulos ES, executor de testes nativo (`node --test`), nenhuma dependência externa.

**Especificação:** `documentos/01-Contexto.md` a `documentos/09-Referencias.md`, em especial `04-Regras-do-Jogo.md` e `05-Arquitetura.md`.

**Fora deste plano (Plano 2):** o site jogável, a cópia do núcleo para `site/`, a geração do ciclo completo de 365 dias, os 9 cenários restantes, a estatística anônima e a publicação.

## Restrições globais

- `nucleo/` não importa nada de `node:*` e não usa `Buffer`, `fs` ou `process`: precisa rodar no navegador sem etapa de build.
- Nenhuma dependência em `package.json` (nem de desenvolvimento).
- Grade de 4 colunas (A a D) por 5 linhas (1 a 5); 20 personagens; índice `i = (linha − 1) × 4 + coluna`, com coluna A = 0. A linha 1 é a de cima.
- "Vizinhos" incluem as diagonais (até 8). "Conectados" usa só os lados.
- Todo mundo fala a verdade: toda pista gravada é verdadeira para a solução.
- Entre 6 e 12 culpados por caso.
- Dificuldade: fácil = toda dedução sai de 1 pista; médio = alguma dedução exige combinar 2; difícil = alguma exige 3 ou mais.
- A semente de cada caso vem do dia do ciclo e da dificuldade; rodar o gerador de novo produz arquivos idênticos.
- Arquivos de caso: `<dia do ciclo com 3 dígitos>-<dificuldade>.json`, por exemplo `034-medio.json`; dia do ciclo começa em 0.
- Textos em português do Brasil, em primeira pessoa quando a pista fala do próprio personagem ("Tenho", "mim", "eu"); nunca o próprio nome do falante.
- Nomes fictícios e comuns, sem pessoas públicas e sem marcas (guia de texto do documento 06).
- Nenhum dado pessoal de jogador é coletado ou gravado.
- Mensagens de commit no imperativo, em português, terminando com a linha `Co-Authored-By` usada no projeto.

## Pontos de atenção na revisão

1. **Cenário malformado** (menos de 20 nomes, nome repetido, menos de 5 profissões, JSON inválido): o gerador para com uma mensagem que cita o arquivo, e o comando sai com código 1. Testes nas tarefas 8 e 10.
2. **O gerador não acha um caso da dificuldade pedida:** erro claro com o dia e a dificuldade, sem gravar arquivo pela metade. Teste na tarefa 9.
3. **Regerar só um trecho do ciclo** (`--inicio 5 --dias 1`): grava apenas `005-*.json`, com nome de três dígitos. Teste na tarefa 10.
4. **Duas pessoas com a mesma pista no mesmo caso:** nunca acontece. Teste na tarefa 9.
5. **A pista de um personagem citando o próprio nome:** nunca acontece; ele fala em primeira pessoa. Testes nas tarefas 4 e 9.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `package.json` | Módulos ES e os comandos `test`, `gerar` e `validar` |
| `nucleo/aleatorio.js` | Sorteio com semente: mesmo texto de semente, mesma sequência |
| `nucleo/grade.js` | Posições, vizinhos, linhas, colunas, direções, "entre", borda, contagem de bits e conexão |
| `nucleo/pistas.js` | Tipos de pista: avaliação (`compilar`), texto (`texto`) e lista de pistas verdadeiras (`candidatas`) |
| `nucleo/verificador.js` | Soluções compatíveis, o que é certo e o julgamento de uma marcação |
| `nucleo/caso.js` | Formato do arquivo: `serializar`, `desserializar` e o embaralhamento da solução |
| `gerador/montar.js` | Validação de cenário, sorteio de personagens e escolha do cenário do dia |
| `gerador/simular.js` | Jogador perfeito: confere se o caso se resolve sem chute e mede a dificuldade |
| `gerador/gerar-caso.js` | Monta um caso de uma dificuldade, tentando até acertar |
| `gerador/gerar.js` | Linha de comando que grava os arquivos |
| `gerador/validar.js` | Linha de comando que confere arquivos já gerados |
| `cenarios/*.json` | Três cenários iniciais: firma, condomínio, escola |
| `testes/*.test.js` | Testes de cada módulo |

---

### Tarefa 1: projeto Node e sorteio com semente

**Arquivos:**
- Criar: `package.json`
- Criar: `nucleo/aleatorio.js`
- Teste: `testes/aleatorio.test.js`

**Interfaces:**
- Consome: nada.
- Produz:
  - `semente(texto: string) → number` (inteiro de 32 bits sem sinal)
  - `criarAleatorio(semente: number) → { numero(): number, inteiro(max: number): number, escolher(lista: T[]): T, embaralhar(lista: T[]): T[], ponderado(pesos: Record<string, number>): string }`

- [ ] **Passo 1: criar a branch de trabalho**

```bash
git checkout -b nucleo-e-gerador
```

- [ ] **Passo 2: criar o `package.json`**

```json
{
  "name": "oflagra",
  "version": "0.3.0",
  "private": true,
  "type": "module",
  "description": "Flagra: jogo diário de dedução lógica",
  "engines": { "node": ">=24" },
  "scripts": {
    "test": "node --test \"testes/**/*.test.js\"",
    "gerar": "node gerador/gerar.js",
    "validar": "node gerador/validar.js"
  }
}
```

- [ ] **Passo 3: escrever o teste que falha**

`testes/aleatorio.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { semente, criarAleatorio } from '../nucleo/aleatorio.js';

test('semente é determinística e muda com o texto', () => {
  assert.equal(semente('abc'), semente('abc'));
  assert.notEqual(semente('abc'), semente('abd'));
  assert.ok(Number.isInteger(semente('abc')) && semente('abc') >= 0);
});

test('mesma semente gera a mesma sequência', () => {
  const a = criarAleatorio(42), b = criarAleatorio(42);
  for (let k = 0; k < 5; k++) assert.equal(a.numero(), b.numero());
});

test('numero fica em [0, 1) e inteiro cobre 0..max-1', () => {
  const r = criarAleatorio(7);
  const vistos = new Set();
  for (let k = 0; k < 1000; k++) {
    const x = r.numero();
    assert.ok(x >= 0 && x < 1);
    vistos.add(r.inteiro(5));
  }
  assert.deepEqual([...vistos].sort(), [0, 1, 2, 3, 4]);
});

test('embaralhar mantém os elementos e não altera a lista original', () => {
  const r = criarAleatorio(1);
  const original = [1, 2, 3, 4, 5, 6];
  const copia = [...original];
  const resultado = r.embaralhar(original);
  assert.deepEqual(original, copia);
  assert.deepEqual([...resultado].sort(), copia);
});

test('ponderado nunca escolhe peso zero e falha sem opções', () => {
  const r = criarAleatorio(3);
  for (let k = 0; k < 100; k++) assert.equal(r.ponderado({ a: 0, b: 1 }), 'b');
  assert.throws(() => r.ponderado({ a: 0 }), /Nenhuma opção/);
});
```

- [ ] **Passo 4: rodar e ver falhar**

Rodar: `npm test`
Esperado: FALHA, com erro de módulo não encontrado (`nucleo/aleatorio.js`).

- [ ] **Passo 5: implementar**

`nucleo/aleatorio.js`:

```js
// Sorteio com semente. Mesmo texto de semente, mesma sequência, em qualquer máquina.

/** FNV-1a de 32 bits: transforma um texto num número de semente. */
export function semente(texto) {
  let h = 0x811c9dc5;
  for (const ch of String(texto)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Gerador mulberry32, com utilitários de sorteio. */
export function criarAleatorio(sementeInicial) {
  let a = sementeInicial >>> 0;
  const numero = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const inteiro = (max) => Math.floor(numero() * max);
  return {
    numero,
    inteiro,
    escolher: (lista) => lista[inteiro(lista.length)],
    embaralhar(lista) {
      const c = [...lista];
      for (let i = c.length - 1; i > 0; i--) {
        const j = inteiro(i + 1);
        [c[i], c[j]] = [c[j], c[i]];
      }
      return c;
    },
    ponderado(pesos) {
      const entradas = Object.entries(pesos).filter(([, w]) => w > 0);
      const total = entradas.reduce((s, [, w]) => s + w, 0);
      if (!total) throw new Error('Nenhuma opção com peso positivo.');
      let r = numero() * total;
      for (const [chave, w] of entradas) {
        r -= w;
        if (r < 0) return chave;
      }
      return entradas[entradas.length - 1][0];
    },
  };
}
```

- [ ] **Passo 6: rodar e ver passar**

Rodar: `npm test`
Esperado: 5 testes, todos passando.

- [ ] **Passo 7: commit**

```bash
git add package.json nucleo/aleatorio.js testes/aleatorio.test.js
git commit -m "Cria o projeto Node e o sorteio com semente" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 2: geometria da grade (CT-01)

**Arquivos:**
- Criar: `nucleo/grade.js`
- Teste: `testes/grade.test.js`

**Interfaces:**
- Consome: nada.
- Produz:
  - Constantes `COLUNAS = ['A','B','C','D']`, `NUM_COLUNAS = 4`, `NUM_LINHAS = 5`, `TOTAL = 20`, `CHEIA = 0xFFFFF`
  - `indice(pos: string) → number`, `posicao(i) → string`, `coluna(i) → 0..3`, `linha(i) → 1..5`
  - `vizinhos(i) → number[]`, `daLinha(l) → number[]`, `daColuna(c: 0..3) → number[]`
  - `naDirecao(i, direcao: 'acima'|'abaixo'|'esquerda'|'direita') → number[]`
  - `entre(a, b) → number[] | null` (null quando não estão na mesma linha nem coluna)
  - `borda() → number[]`
  - `mascara(indices: number[]) → number`, `contar(mascara) → number`, `conectados(mascara) → boolean`

- [ ] **Passo 1: escrever o teste que falha**

`testes/grade.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CHEIA, TOTAL, indice, posicao, vizinhos, daLinha, daColuna,
  naDirecao, entre, borda, mascara, contar, conectados,
} from '../nucleo/grade.js';

const m = (...pos) => mascara(pos.map(indice));

test('indice e posicao se correspondem', () => {
  assert.equal(indice('A1'), 0);
  assert.equal(indice('D1'), 3);
  assert.equal(indice('A2'), 4);
  assert.equal(indice('D5'), 19);
  for (let i = 0; i < TOTAL; i++) assert.equal(indice(posicao(i)), i);
  for (const ruim of ['E1', 'A6', 'A0', 'A10', 'a1', '']) {
    assert.throws(() => indice(ruim), /Posição inválida/);
  }
});

test('vizinhos incluem diagonais', () => {
  assert.deepEqual(vizinhos(indice('A1')).sort((x, y) => x - y), [1, 4, 5]);
  assert.equal(vizinhos(indice('B1')).length, 5);
  assert.equal(vizinhos(indice('B2')).length, 8);
});

test('linhas e colunas', () => {
  assert.deepEqual(daLinha(3), [8, 9, 10, 11]);
  assert.deepEqual(daColuna(1), [1, 5, 9, 13, 17]);
});

test('direções a partir de B3', () => {
  const b3 = indice('B3');
  assert.deepEqual(naDirecao(b3, 'acima'), [indice('B1'), indice('B2')]);
  assert.deepEqual(naDirecao(b3, 'abaixo'), [indice('B4'), indice('B5')]);
  assert.deepEqual(naDirecao(b3, 'esquerda'), [indice('A3')]);
  assert.deepEqual(naDirecao(b3, 'direita'), [indice('C3'), indice('D3')]);
  assert.deepEqual(naDirecao(indice('A1'), 'acima'), []);
  assert.throws(() => naDirecao(b3, 'diagonal'), /Direção inválida/);
});

test('entre em linha, em coluna, vizinhos e diagonal', () => {
  assert.deepEqual(entre(indice('A1'), indice('D1')), [indice('B1'), indice('C1')]);
  assert.deepEqual(entre(indice('D1'), indice('A1')), [indice('B1'), indice('C1')]);
  assert.deepEqual(entre(indice('A1'), indice('A5')), [indice('A2'), indice('A3'), indice('A4')]);
  assert.deepEqual(entre(indice('A1'), indice('B1')), []);
  assert.equal(entre(indice('A1'), indice('B2')), null);
});

test('borda tem 14 personagens e exclui o miolo', () => {
  const b = borda();
  assert.equal(b.length, 14);
  for (const miolo of ['B2', 'C2', 'B3', 'C3', 'B4', 'C4']) assert.ok(!b.includes(indice(miolo)));
});

test('contar bits', () => {
  assert.equal(contar(0), 0);
  assert.equal(contar(0b1011), 3);
  assert.equal(contar(CHEIA), 20);
});

test('conectados usa só os lados e não atravessa a borda', () => {
  assert.equal(conectados(0), true);
  assert.equal(conectados(m('C3')), true);
  assert.equal(conectados(m('A1', 'A2', 'A3')), true);
  assert.equal(conectados(m('A1', 'B1', 'B2')), true);
  assert.equal(conectados(m('A1', 'C1')), false);
  assert.equal(conectados(m('A1', 'B2')), false);
  assert.equal(conectados(m('D1', 'A2')), false); // índices 3 e 4 são vizinhos na numeração, não na grade
});
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npm test`
Esperado: FALHA em `testes/grade.test.js` (módulo não encontrado).

- [ ] **Passo 3: implementar**

`nucleo/grade.js`:

```js
// Geometria da grade 4 × 5. Índice i = (linha - 1) * 4 + coluna; coluna A = 0; linha 1 em cima.
// Conjuntos de personagens são máscaras de 20 bits (bit i = personagem i).

export const COLUNAS = ['A', 'B', 'C', 'D'];
export const NUM_COLUNAS = 4;
export const NUM_LINHAS = 5;
export const TOTAL = NUM_COLUNAS * NUM_LINHAS;
export const CHEIA = (1 << TOTAL) - 1;

const em = (c, l) => (l - 1) * NUM_COLUNAS + c;

export function coluna(i) { return i % NUM_COLUNAS; }
export function linha(i) { return Math.floor(i / NUM_COLUNAS) + 1; }

export function indice(pos) {
  const c = COLUNAS.indexOf(String(pos)[0]);
  const l = Number(String(pos).slice(1));
  if (String(pos).length !== 2 || c < 0 || !(l >= 1 && l <= NUM_LINHAS)) {
    throw new Error(`Posição inválida: ${pos}`);
  }
  return em(c, l);
}

export function posicao(i) { return COLUNAS[coluna(i)] + linha(i); }

export function vizinhos(i) {
  const res = [];
  for (let dl = -1; dl <= 1; dl++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dl && !dc) continue;
      const c = coluna(i) + dc;
      const l = linha(i) + dl;
      if (c >= 0 && c < NUM_COLUNAS && l >= 1 && l <= NUM_LINHAS) res.push(em(c, l));
    }
  }
  return res;
}

export function daLinha(l) { return COLUNAS.map((_, c) => em(c, l)); }

export function daColuna(c) { return Array.from({ length: NUM_LINHAS }, (_, k) => em(c, k + 1)); }

export function naDirecao(i, direcao) {
  const c = coluna(i);
  const l = linha(i);
  switch (direcao) {
    case 'acima': return Array.from({ length: l - 1 }, (_, k) => em(c, k + 1));
    case 'abaixo': return Array.from({ length: NUM_LINHAS - l }, (_, k) => em(c, l + 1 + k));
    case 'esquerda': return Array.from({ length: c }, (_, k) => em(k, l));
    case 'direita': return Array.from({ length: NUM_COLUNAS - 1 - c }, (_, k) => em(c + 1 + k, l));
    default: throw new Error(`Direção inválida: ${direcao}`);
  }
}

export function entre(a, b) {
  const [i, j] = a < b ? [a, b] : [b, a];
  if (linha(i) === linha(j)) return Array.from({ length: Math.max(0, j - i - 1) }, (_, k) => i + 1 + k);
  if (coluna(i) === coluna(j)) {
    const res = [];
    for (let k = i + NUM_COLUNAS; k < j; k += NUM_COLUNAS) res.push(k);
    return res;
  }
  return null;
}

export function borda() {
  return Array.from({ length: TOTAL }, (_, i) => i).filter((i) =>
    linha(i) === 1 || linha(i) === NUM_LINHAS || coluna(i) === 0 || coluna(i) === NUM_COLUNAS - 1);
}

export function mascara(indices) {
  return indices.reduce((m, i) => (m | (1 << i)) >>> 0, 0);
}

export function contar(x) {
  x >>>= 0;
  x -= (x >>> 1) & 0x55555555;
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  return Math.imul((x + (x >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24;
}

const SEM_A = (CHEIA & ~mascara(daColuna(0))) >>> 0;
const SEM_D = (CHEIA & ~mascara(daColuna(NUM_COLUNAS - 1))) >>> 0;

/** Verdadeiro se os bits ligados formam um único grupo ligado pelos lados (0 ou 1 bit: verdadeiro). */
export function conectados(m) {
  m >>>= 0;
  if (contar(m) <= 1) return true;
  let grupo = (m & -m) >>> 0;
  for (;;) {
    const proximo = (grupo
      | ((grupo << 1) & SEM_A)
      | ((grupo >>> 1) & SEM_D)
      | ((grupo << NUM_COLUNAS) & CHEIA)
      | (grupo >>> NUM_COLUNAS)) & m;
    if ((proximo >>> 0) === grupo) break;
    grupo = proximo >>> 0;
  }
  return grupo === m;
}
```

- [ ] **Passo 4: rodar e ver passar**

Rodar: `npm test`
Esperado: todos os testes passando (os 5 da tarefa 1 e os 8 desta).

- [ ] **Passo 5: commit**

```bash
git add nucleo/grade.js testes/grade.test.js
git commit -m "Implementa a geometria da grade" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 3: avaliação das pistas

**Arquivos:**
- Criar: `nucleo/pistas.js`
- Teste: `testes/pistas-avaliar.test.js`

**Interfaces:**
- Consome: `nucleo/grade.js` (tarefa 2).
- Produz:
  - Formato de pista: `{ tipo: string, params: object }`. Tipos e `params`:
    - `vizinhos`: `{ alvo, n }`: o alvo tem exatamente `n` culpados entre os vizinhos
    - `contagem`: `{ area, n }`: exatamente `n` culpados na área
    - `maioria`: `{ area, valor: 'culpado'|'inocente' }`: há estritamente mais desse valor na área
    - `paridade`: `{ area, impar: boolean }`
    - `direcao`: `{ alvo, direcao, valor }`: todos naquela direção têm aquele valor
    - `entre`: `{ a, b, n }`
    - `profissao`: `{ profissao, membros: number[], n }`
    - `comparacao`: `{ a, b }`: `a` tem mais vizinhos culpados que `b`
    - `conexao`: `{ area }`: os culpados da área estão conectados
  - Área: `{ tipo: 'linha', valor: 1..5 } | { tipo: 'coluna', valor: 'A'..'D' } | { tipo: 'borda' }`
  - `indicesDaArea(area) → number[]`, `nomeDaArea(area) → string` ("linha 3", "coluna B", "borda")
  - `compilar(pista) → (mascara: number) => boolean`
  - `chavePista(pista) → string` (identifica pistas iguais)

- [ ] **Passo 1: escrever o teste que falha**

`testes/pistas-avaliar.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { indice, mascara } from '../nucleo/grade.js';
import { compilar, chavePista, indicesDaArea, nomeDaArea } from '../nucleo/pistas.js';

const m = (...pos) => mascara(pos.map(indice));
const SOL = m('A1', 'B1', 'B2', 'D5');
const vale = (tipo, params, sol = SOL) => compilar({ tipo, params })(sol);
const LINHA1 = { tipo: 'linha', valor: 1 };
const COL_A = { tipo: 'coluna', valor: 'A' };
const COL_B = { tipo: 'coluna', valor: 'B' };
const COL_D = { tipo: 'coluna', valor: 'D' };

test('áreas', () => {
  assert.deepEqual(indicesDaArea(LINHA1), [0, 1, 2, 3]);
  assert.deepEqual(indicesDaArea(COL_B), [1, 5, 9, 13, 17]);
  assert.equal(indicesDaArea({ tipo: 'borda' }).length, 14);
  assert.equal(nomeDaArea(LINHA1), 'linha 1');
  assert.equal(nomeDaArea(COL_B), 'coluna B');
  assert.equal(nomeDaArea({ tipo: 'borda' }), 'borda');
  assert.throws(() => indicesDaArea({ tipo: 'diagonal' }), /Área inválida/);
});

test('vizinhos', () => {
  assert.equal(vale('vizinhos', { alvo: indice('A2'), n: 3 }), true);
  assert.equal(vale('vizinhos', { alvo: indice('A2'), n: 2 }), false);
});

test('contagem em linha, coluna e borda', () => {
  assert.equal(vale('contagem', { area: LINHA1, n: 2 }), true);
  assert.equal(vale('contagem', { area: COL_B, n: 2 }), true);
  assert.equal(vale('contagem', { area: { tipo: 'borda' }, n: 3 }), true);
  assert.equal(vale('contagem', { area: { tipo: 'borda' }, n: 4 }), false);
});

test('maioria não vale em empate', () => {
  assert.equal(vale('maioria', { area: LINHA1, valor: 'culpado' }), false);
  assert.equal(vale('maioria', { area: LINHA1, valor: 'inocente' }), false);
  assert.equal(vale('maioria', { area: COL_A, valor: 'inocente' }), true);
});

test('paridade', () => {
  assert.equal(vale('paridade', { area: COL_D, impar: true }), true);
  assert.equal(vale('paridade', { area: COL_D, impar: false }), false);
});

test('direção', () => {
  assert.equal(vale('direcao', { alvo: indice('A2'), direcao: 'acima', valor: 'culpado' }), true);
  assert.equal(vale('direcao', { alvo: indice('C5'), direcao: 'direita', valor: 'culpado' }), true);
  assert.equal(vale('direcao', { alvo: indice('A3'), direcao: 'abaixo', valor: 'inocente' }), true);
  assert.equal(vale('direcao', { alvo: indice('A3'), direcao: 'acima', valor: 'inocente' }), false);
});

test('entre', () => {
  assert.equal(vale('entre', { a: indice('A1'), b: indice('D1'), n: 1 }), true);
  assert.equal(vale('entre', { a: indice('A1'), b: indice('D1'), n: 2 }), false);
});

test('profissão', () => {
  const membros = [indice('A1'), indice('C3'), indice('D5')];
  assert.equal(vale('profissao', { profissao: 'copeira', membros, n: 2 }), true);
  assert.equal(vale('profissao', { profissao: 'copeira', membros, n: 1 }), false);
});

test('comparação', () => {
  assert.equal(vale('comparacao', { a: indice('A2'), b: indice('D4') }), true);
  assert.equal(vale('comparacao', { a: indice('D4'), b: indice('A2') }), false);
});

test('conexão', () => {
  assert.equal(vale('conexao', { area: COL_B }), true);
  assert.equal(vale('conexao', { area: LINHA1 }), true);
  assert.equal(vale('conexao', { area: LINHA1 }, SOL | m('D1')), false);
});

test('tipo desconhecido e chave de pista', () => {
  assert.throws(() => compilar({ tipo: 'sorte', params: {} }), /Tipo de pista desconhecido/);
  const a = { tipo: 'contagem', params: { area: LINHA1, n: 2 } };
  const b = { tipo: 'contagem', params: { area: LINHA1, n: 2 } };
  assert.equal(chavePista(a), chavePista(b));
  assert.notEqual(chavePista(a), chavePista({ tipo: 'contagem', params: { area: LINHA1, n: 1 } }));
});
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npm test`
Esperado: FALHA em `testes/pistas-avaliar.test.js` (módulo não encontrado).

- [ ] **Passo 3: implementar**

`nucleo/pistas.js`:

```js
// Tipos de pista: avaliação, texto e geração das pistas verdadeiras de uma solução.
import {
  COLUNAS, TOTAL, borda, coluna, conectados, contar, daColuna, daLinha,
  entre, linha, mascara, naDirecao, vizinhos,
} from './grade.js';

const VIZINHOS = Array.from({ length: TOTAL }, (_, i) => mascara(vizinhos(i)));

export function indicesDaArea(area) {
  switch (area?.tipo) {
    case 'linha': return daLinha(area.valor);
    case 'coluna': return daColuna(COLUNAS.indexOf(area.valor));
    case 'borda': return borda();
    default: throw new Error(`Área inválida: ${JSON.stringify(area)}`);
  }
}

export function nomeDaArea(area) {
  return area.tipo === 'borda' ? 'borda' : `${area.tipo} ${area.valor}`;
}

export function chavePista(pista) {
  return JSON.stringify([pista.tipo, pista.params]);
}

/** Transforma a pista numa função que diz se uma solução (máscara) a satisfaz. */
export function compilar(pista) {
  const p = pista.params;
  switch (pista.tipo) {
    case 'vizinhos': {
      const v = VIZINHOS[p.alvo];
      return (m) => contar(m & v) === p.n;
    }
    case 'contagem': {
      const a = mascara(indicesDaArea(p.area));
      return (m) => contar(m & a) === p.n;
    }
    case 'maioria': {
      const a = mascara(indicesDaArea(p.area));
      const t = contar(a);
      return p.valor === 'culpado'
        ? (m) => 2 * contar(m & a) > t
        : (m) => 2 * contar(m & a) < t;
    }
    case 'paridade': {
      const a = mascara(indicesDaArea(p.area));
      return (m) => (contar(m & a) % 2 === 1) === p.impar;
    }
    case 'direcao': {
      const d = mascara(naDirecao(p.alvo, p.direcao));
      return p.valor === 'culpado'
        ? (m) => ((m & d) >>> 0) === d
        : (m) => (m & d) === 0;
    }
    case 'entre': {
      const e = mascara(entre(p.a, p.b) ?? []);
      return (m) => contar(m & e) === p.n;
    }
    case 'profissao': {
      const g = mascara(p.membros);
      return (m) => contar(m & g) === p.n;
    }
    case 'comparacao': {
      const va = VIZINHOS[p.a];
      const vb = VIZINHOS[p.b];
      return (m) => contar(m & va) > contar(m & vb);
    }
    case 'conexao': {
      const a = mascara(indicesDaArea(p.area));
      return (m) => conectados(m & a);
    }
    default:
      throw new Error(`Tipo de pista desconhecido: ${pista.tipo}`);
  }
}
```

(`coluna`, `linha` e `COLUNAS` já ficam importados para as tarefas 4 e 5.)

- [ ] **Passo 4: rodar e ver passar**

Rodar: `npm test`
Esperado: todos os testes passando.

- [ ] **Passo 5: commit**

```bash
git add nucleo/pistas.js testes/pistas-avaliar.test.js
git commit -m "Implementa a avaliação das pistas" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 4: texto das pistas

**Arquivos:**
- Modificar: `nucleo/pistas.js` (acrescentar ao final)
- Teste: `testes/pistas-texto.test.js`

**Interfaces:**
- Consome: `compilar`, `nomeDaArea` (tarefa 3).
- Produz: `texto(pista, personagens: {nome, profissao}[], falante: number) → string`

- [ ] **Passo 1: escrever o teste que falha**

`testes/pistas-texto.test.js`:

```js
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
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npm test`
Esperado: FALHA, com `texto` não exportado por `nucleo/pistas.js`.

- [ ] **Passo 3: implementar (acrescentar ao final de `nucleo/pistas.js`)**

```js
const DIRECAO = { acima: 'acima de', abaixo: 'abaixo de', esquerda: 'à esquerda de', direita: 'à direita de' };

function quantidade(n) {
  return n === 1 ? 'exatamente 1 culpado' : `exatamente ${n} culpados`;
}

/** Texto da pista dito pelo personagem `falante` (que fala de si em primeira pessoa). */
export function texto(pista, personagens, falante) {
  const p = pista.params;
  const nome = (i) => personagens[i].nome;
  switch (pista.tipo) {
    case 'vizinhos': {
      const eu = p.alvo === falante;
      if (p.n === 0) {
        return eu ? 'Não tenho nenhum culpado entre os vizinhos.' : `${nome(p.alvo)} não tem nenhum culpado entre os vizinhos.`;
      }
      return eu ? `Tenho ${quantidade(p.n)} entre os vizinhos.` : `${nome(p.alvo)} tem ${quantidade(p.n)} entre os vizinhos.`;
    }
    case 'contagem':
      return p.n === 0
        ? `Não há nenhum culpado na ${nomeDaArea(p.area)}.`
        : `Há ${quantidade(p.n)} na ${nomeDaArea(p.area)}.`;
    case 'maioria':
      return `Há mais ${p.valor === 'culpado' ? 'culpados que inocentes' : 'inocentes que culpados'} na ${nomeDaArea(p.area)}.`;
    case 'paridade':
      return `Há um número ${p.impar ? 'ímpar' : 'par'} de culpados na ${nomeDaArea(p.area)}.`;
    case 'direcao': {
      const quem = p.alvo === falante ? 'mim' : nome(p.alvo);
      return `Todos ${DIRECAO[p.direcao]} ${quem} são ${p.valor}s.`;
    }
    case 'entre': {
      const [x, y] = p.b === falante ? [p.b, p.a] : [p.a, p.b];
      const par = x === falante ? `mim e ${nome(y)}` : `${nome(x)} e ${nome(y)}`;
      return p.n === 0 ? `Não há nenhum culpado entre ${par}.` : `Há ${quantidade(p.n)} entre ${par}.`;
    }
    case 'profissao':
      return p.n === 0
        ? `Entre quem é ${p.profissao}, não há nenhum culpado.`
        : `Entre quem é ${p.profissao}, há ${quantidade(p.n)}.`;
    case 'comparacao':
      if (p.a === falante) return `Tenho mais vizinhos culpados que ${nome(p.b)}.`;
      if (p.b === falante) return `${nome(p.a)} tem mais vizinhos culpados que eu.`;
      return `${nome(p.a)} tem mais vizinhos culpados que ${nome(p.b)}.`;
    case 'conexao':
      return `Todos os culpados da ${nomeDaArea(p.area)} estão conectados.`;
    default:
      throw new Error(`Tipo de pista desconhecido: ${pista.tipo}`);
  }
}
```

- [ ] **Passo 4: rodar e ver passar**

Rodar: `npm test`
Esperado: todos os testes passando.

- [ ] **Passo 5: commit**

```bash
git add nucleo/pistas.js testes/pistas-texto.test.js
git commit -m "Escreve o texto das pistas em português" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 5: pistas verdadeiras de uma solução (base do CT-02)

**Arquivos:**
- Modificar: `nucleo/pistas.js` (acrescentar ao final)
- Teste: `testes/pistas-candidatas.test.js`

**Interfaces:**
- Consome: `compilar`, `indicesDaArea`, funções de `grade.js`.
- Produz: `candidatas(solucao: number, personagens: {nome, profissao}[]) → pista[]`: todas as pistas verdadeiras e úteis, sem repetição.

- [ ] **Passo 1: escrever o teste que falha**

`testes/pistas-candidatas.test.js`:

```js
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
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npm test`
Esperado: FALHA, com `candidatas` não exportado.

- [ ] **Passo 3: implementar (acrescentar ao final de `nucleo/pistas.js`)**

```js
const AREAS = [
  ...[1, 2, 3, 4, 5].map((valor) => ({ tipo: 'linha', valor })),
  ...COLUNAS.map((valor) => ({ tipo: 'coluna', valor })),
  { tipo: 'borda' },
];

/** Todas as pistas verdadeiras e úteis para a solução dada, sem repetição. */
export function candidatas(solucao, personagens) {
  const m = solucao >>> 0;
  const lista = [];
  const add = (tipo, params) => lista.push({ tipo, params });
  const qtd = (indices) => contar(m & mascara(indices));

  for (let i = 0; i < TOTAL; i++) add('vizinhos', { alvo: i, n: qtd(vizinhos(i)) });

  for (const area of AREAS) {
    const idx = indicesDaArea(area);
    const n = qtd(idx);
    add('contagem', { area, n });
    add('paridade', { area, impar: n % 2 === 1 });
    if (2 * n !== idx.length) add('maioria', { area, valor: 2 * n > idx.length ? 'culpado' : 'inocente' });
    if (area.tipo !== 'borda' && n >= 2 && conectados(m & mascara(idx))) add('conexao', { area });
  }

  for (let i = 0; i < TOTAL; i++) {
    for (const direcao of ['acima', 'abaixo', 'esquerda', 'direita']) {
      const idx = naDirecao(i, direcao);
      if (!idx.length) continue;
      const n = qtd(idx);
      if (n === 0) add('direcao', { alvo: i, direcao, valor: 'inocente' });
      else if (n === idx.length) add('direcao', { alvo: i, direcao, valor: 'culpado' });
    }
  }

  for (let a = 0; a < TOTAL; a++) {
    for (let b = a + 1; b < TOTAL; b++) {
      const e = entre(a, b);
      if (e && e.length) add('entre', { a, b, n: qtd(e) });
    }
  }

  const porProfissao = {};
  personagens.forEach((p, i) => (porProfissao[p.profissao] ??= []).push(i));
  for (const [profissao, membros] of Object.entries(porProfissao)) {
    if (membros.length >= 2) add('profissao', { profissao, membros, n: qtd(membros) });
  }

  for (let a = 0; a < TOTAL; a++) {
    for (let b = 0; b < TOTAL; b++) {
      if (a === b || Math.abs(linha(a) - linha(b)) > 2 || Math.abs(coluna(a) - coluna(b)) > 2) continue;
      if (qtd(vizinhos(a)) > qtd(vizinhos(b))) add('comparacao', { a, b });
    }
  }

  return lista;
}
```

- [ ] **Passo 4: rodar e ver passar**

Rodar: `npm test`
Esperado: todos os testes passando.

- [ ] **Passo 5: commit**

```bash
git add nucleo/pistas.js testes/pistas-candidatas.test.js
git commit -m "Gera as pistas verdadeiras de uma solução" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 6: verificador (CT-05)

**Arquivos:**
- Criar: `nucleo/verificador.js`
- Teste: `testes/verificador.test.js`

**Interfaces:**
- Consome: `CHEIA` (tarefa 2), `compilar` (tarefa 3).
- Produz:
  - `conhecidos`: `{ mascara: number, culpados: number }`: quem já está marcado, e quais desses são culpados
  - `candidatos(conhecidos, pistas: pista[]) → Uint32Array`: todas as soluções compatíveis
  - `filtrar(lista: Uint32Array, pista) → Uint32Array`
  - `deduzir(lista) → { culpados: number, inocentes: number }`: máscaras do que é certo (inclui os já conhecidos); lança erro se a lista estiver vazia
  - `julgar(lista, i, culpado: boolean) → 'recusada' | 'acerto' | 'erro'`

- [ ] **Passo 1: escrever o teste que falha**

`testes/verificador.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHEIA, indice } from '../nucleo/grade.js';
import { candidatos, deduzir, filtrar, julgar } from '../nucleo/verificador.js';

const LINHA1 = { tipo: 'linha', valor: 1 };
const umCulpadoNaLinha1 = { tipo: 'contagem', params: { area: LINHA1, n: 1 } };
const todosAEsquerdaDeB1Culpados = { tipo: 'direcao', params: { alvo: indice('B1'), direcao: 'esquerda', valor: 'culpado' } };
// Todos conhecidos e inocentes, menos A1 (bit 0) e B1 (bit 1).
const quaseTudo = { mascara: (CHEIA & ~0b11) >>> 0, culpados: 0 };

test('candidatos enumera só o que não se sabe', () => {
  assert.deepEqual([...candidatos(quaseTudo, [])], [0, 1, 2, 3]);
  assert.equal(candidatos({ mascara: 0, culpados: 0 }, []).length, 2 ** 20);
});

test('candidatos e filtrar aplicam as pistas', () => {
  assert.deepEqual([...candidatos(quaseTudo, [umCulpadoNaLinha1])], [1, 2]);
  assert.deepEqual([...filtrar(candidatos(quaseTudo, []), umCulpadoNaLinha1)], [1, 2]);
});

test('deduzir mostra o que é certo', () => {
  const d = deduzir(Uint32Array.from([0b01, 0b11]));
  assert.equal(d.culpados, 0b01);
  assert.equal(d.inocentes, (CHEIA & ~0b11) >>> 0);
  assert.throws(() => deduzir(new Uint32Array(0)), /Nenhuma solução/);
});

test('julgar recusa o chute e separa acerto de erro', () => {
  const incerta = candidatos(quaseTudo, [umCulpadoNaLinha1]);
  assert.equal(julgar(incerta, 0, true), 'recusada');
  assert.equal(julgar(incerta, 0, false), 'recusada');

  const certa = candidatos(quaseTudo, [umCulpadoNaLinha1, todosAEsquerdaDeB1Culpados]);
  assert.equal(julgar(certa, 0, true), 'acerto');
  assert.equal(julgar(certa, 0, false), 'erro');
  assert.equal(julgar(certa, 1, false), 'acerto');
  assert.equal(julgar(certa, 1, true), 'erro');
});
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npm test`
Esperado: FALHA em `testes/verificador.test.js` (módulo não encontrado).

- [ ] **Passo 3: implementar**

`nucleo/verificador.js`:

```js
// Verificador lógico: quais soluções ainda são possíveis e o que já é certo.
// É o mesmo módulo no gerador e no site, para que o caso aprovado na geração nunca trave no jogo.
import { CHEIA } from './grade.js';
import { compilar } from './pistas.js';

/** Todas as soluções compatíveis com os personagens conhecidos e com as pistas. */
export function candidatos(conhecidos, pistas) {
  const livres = (~conhecidos.mascara & CHEIA) >>> 0;
  const base = conhecidos.culpados >>> 0;
  const testes = pistas.map(compilar);
  const res = [];
  let sub = 0;
  do {
    const m = (base | sub) >>> 0;
    if (testes.every((f) => f(m))) res.push(m);
    sub = ((sub - livres) & livres) >>> 0;
  } while (sub !== 0);
  return Uint32Array.from(res);
}

export function filtrar(lista, pista) {
  return lista.filter(compilar(pista));
}

/** Máscaras dos personagens cujo valor é igual em todas as soluções possíveis. */
export function deduzir(lista) {
  if (lista.length === 0) throw new Error('Nenhuma solução compatível com as pistas.');
  let todas = CHEIA;
  let alguma = 0;
  for (const m of lista) {
    todas &= m;
    alguma |= m;
  }
  return { culpados: todas >>> 0, inocentes: (~alguma & CHEIA) >>> 0 };
}

/** Julga a marcação do personagem i. "recusada" quando ainda não dá para ter certeza. */
export function julgar(lista, i, culpado) {
  const { culpados, inocentes } = deduzir(lista);
  const bit = (1 << i) >>> 0;
  if (culpados & bit) return culpado ? 'acerto' : 'erro';
  if (inocentes & bit) return culpado ? 'erro' : 'acerto';
  return 'recusada';
}
```

- [ ] **Passo 4: rodar e ver passar**

Rodar: `npm test`
Esperado: todos os testes passando.

- [ ] **Passo 5: commit**

```bash
git add nucleo/verificador.js testes/verificador.test.js
git commit -m "Implementa o verificador lógico" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 7: jogador perfeito e dificuldade (base do CT-03 e do CT-04)

**Arquivos:**
- Criar: `gerador/simular.js`
- Teste: `testes/simular.test.js`

**Interfaces:**
- Consome: `CHEIA`, `TOTAL` (tarefa 2), `compilar` (tarefa 3), `candidatos` (tarefa 6).
- Produz:
  - `passo(pistas: pista[], conhecidos) → { novos: number, k: 1 | 2 | 3 | null }`: o que pode ser descoberto agora e quantas pistas foram necessárias (`novos = 0` e `k = null` quando trava)
  - `simular({ solucao, inicial, pistas: pista[20] }) → { resolvido: boolean, dificuldade: 1 | 2 | 3 | null }`

- [ ] **Passo 1: escrever o teste que falha**

`testes/simular.test.js`:

```js
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
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npm test`
Esperado: FALHA em `testes/simular.test.js` (módulo não encontrado).

- [ ] **Passo 3: implementar**

`gerador/simular.js`:

```js
// Jogador perfeito: confere se o caso se resolve sem chute e mede a dificuldade.
// Em cada passo, o jogador usa o menor número de pistas que basta (1, 2, ou todas).
import { CHEIA, TOTAL } from '../nucleo/grade.js';
import { compilar } from '../nucleo/pistas.js';
import { candidatos } from '../nucleo/verificador.js';

/** Máscara dos personagens certos entre as soluções da base aceitas por todas as `marcas`. */
function certezas(base, marcas) {
  let todas = CHEIA;
  let alguma = 0;
  let achou = false;
  for (let k = 0; k < base.length; k++) {
    let ok = true;
    for (const marca of marcas) {
      if (!marca[k]) { ok = false; break; }
    }
    if (ok) {
      todas &= base[k];
      alguma |= base[k];
      achou = true;
    }
  }
  if (!achou) throw new Error('Pistas contraditórias.');
  return (todas | (~alguma & CHEIA)) >>> 0;
}

export function passo(pistas, conhecidos) {
  const base = candidatos(conhecidos, []);
  const marcas = pistas.map((p) => {
    const f = compilar(p);
    const marca = new Uint8Array(base.length);
    for (let k = 0; k < base.length; k++) marca[k] = f(base[k]) ? 1 : 0;
    return marca;
  });
  const desconhecidos = (~conhecidos.mascara & CHEIA) >>> 0;

  let novos = 0;
  for (const marca of marcas) novos |= certezas(base, [marca]);
  novos = (novos & desconhecidos) >>> 0;
  if (novos) return { novos, k: 1 };

  for (let i = 0; i < marcas.length; i++) {
    for (let j = i + 1; j < marcas.length; j++) novos |= certezas(base, [marcas[i], marcas[j]]);
  }
  novos = (novos & desconhecidos) >>> 0;
  if (novos) return { novos, k: 2 };

  novos = (certezas(base, marcas) & desconhecidos) >>> 0;
  return novos ? { novos, k: 3 } : { novos: 0, k: null };
}

export function simular({ solucao, inicial, pistas }) {
  const bit = (1 << inicial) >>> 0;
  const conhecidos = { mascara: bit, culpados: (solucao & bit) >>> 0 };
  const reveladas = [inicial];
  let dificuldade = 0;
  while (conhecidos.mascara !== CHEIA) {
    const { novos, k } = passo(reveladas.map((i) => pistas[i]), conhecidos);
    if (!novos) return { resolvido: false, dificuldade: null };
    dificuldade = Math.max(dificuldade, k);
    for (let i = 0; i < TOTAL; i++) {
      if (novos & (1 << i)) reveladas.push(i);
    }
    conhecidos.mascara = (conhecidos.mascara | novos) >>> 0;
    conhecidos.culpados = (solucao & conhecidos.mascara) >>> 0;
  }
  return { resolvido: true, dificuldade };
}
```

- [ ] **Passo 4: rodar e ver passar**

Rodar: `npm test`
Esperado: todos os testes passando.

- [ ] **Passo 5: commit**

```bash
git add gerador/simular.js testes/simular.test.js
git commit -m "Simula o jogador perfeito e mede a dificuldade" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 8: cenários e personagens

**Arquivos:**
- Criar: `cenarios/firma.json`, `cenarios/condominio.json`, `cenarios/escola.json`
- Criar: `gerador/montar.js`
- Teste: `testes/montar.test.js`

**Interfaces:**
- Consome: `criarAleatorio` (tarefa 1), `TOTAL` (tarefa 2).
- Produz:
  - Cenário: `{ id, nome, travessuras: string[], profissoes: string[], nomes: string[], culpado: 'culpado', inocente: 'inocente' }`
  - `validarCenario(cenario, arquivo = '') → void` (lança erro citando o arquivo)
  - `montarPersonagens(cenario, rng) → { nome, profissao }[20]`
  - `escolherCenario(cenarios: cenario[], dia: number, dificuldade: 'facil'|'medio'|'dificil') → cenario`

- [ ] **Passo 1: criar os três cenários**

`cenarios/firma.json`:

```json
{
  "id": "firma",
  "nome": "A firma",
  "travessuras": [
    "Quem comeu o bolo do chefe?",
    "Quem deixou a impressora sem papel?",
    "Quem esqueceu a marmita na geladeira?"
  ],
  "profissoes": ["copeira", "estagiário", "contador", "RH", "TI", "vendedora"],
  "nomes": ["Cida", "Zé", "Bia", "Caio", "Lu", "Rosa", "Tião", "Duda", "Neide", "Beto", "Juju", "Marcão",
    "Sil", "Rafa", "Lia", "Toninho", "Vera", "Gabi", "Nando", "Dani", "Fábio", "Kel", "Paulo", "Iva"],
  "culpado": "culpado",
  "inocente": "inocente"
}
```

`cenarios/condominio.json`:

```json
{
  "id": "condominio",
  "nome": "O condomínio",
  "travessuras": [
    "Quem deixou o portão da garagem aberto?",
    "Quem pegou o jornal do vizinho?",
    "Quem largou o lixo no corredor?"
  ],
  "profissoes": ["síndico", "porteiro", "faxineira", "motoboy", "aposentada", "estudante"],
  "nomes": ["Lurdes", "Antônio", "Marlene", "Wesley", "Jéssica", "Cleide", "Robson", "Tânia", "Valdir", "Patrícia",
    "Edson", "Sueli", "Márcio", "Kátia", "Renan", "Helena", "Osvaldo", "Nair", "Igor", "Fernanda",
    "Gilberto", "Sônia", "Thiago", "Bruna"],
  "culpado": "culpado",
  "inocente": "inocente"
}
```

`cenarios/escola.json`:

```json
{
  "id": "escola",
  "nome": "A escola",
  "travessuras": [
    "Quem colou chiclete na cadeira da professora?",
    "Quem escondeu o apagador?",
    "Quem trocou os lanches da turma?"
  ],
  "profissoes": ["professora", "merendeira", "inspetor", "diretora", "aluno", "bibliotecária"],
  "nomes": ["Pedrinho", "Laura", "Enzo", "Valentina", "Miguel", "Sofia", "Arthur", "Alice", "Davi", "Helena",
    "Gael", "Maitê", "Theo", "Cecília", "Bento", "Lorena", "Caio", "Manu", "Heitor", "Isis",
    "Murilo", "Lívia", "Benício", "Clara"],
  "culpado": "culpado",
  "inocente": "inocente"
}
```

- [ ] **Passo 2: escrever o teste que falha**

`testes/montar.test.js`:

```js
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
```

- [ ] **Passo 3: rodar e ver falhar**

Rodar: `npm test`
Esperado: FALHA em `testes/montar.test.js` (módulo `gerador/montar.js` não encontrado).

- [ ] **Passo 4: implementar**

`gerador/montar.js`:

```js
// Cenários: validação, sorteio dos 20 personagens e escolha do cenário de cada dia.
import { TOTAL } from '../nucleo/grade.js';

const ORDEM = ['facil', 'medio', 'dificil'];
const MAX_PROFISSOES = 8; // com 20 personagens, garante de 2 a 4 por profissão

export function validarCenario(c, arquivo = '') {
  const onde = arquivo ? `Cenário ${arquivo}` : 'Cenário';
  const falha = (msg) => { throw new Error(`${onde}: ${msg}`); };
  if (!c || typeof c.id !== 'string' || !c.id) falha('precisa de um id.');
  if (!Array.isArray(c.travessuras) || c.travessuras.length < 1) falha('precisa de pelo menos 1 travessura.');
  if (!Array.isArray(c.nomes) || c.nomes.length < TOTAL) falha(`precisa de pelo menos ${TOTAL} nomes.`);
  const vistos = new Set();
  for (const n of c.nomes) {
    if (vistos.has(n)) falha(`nome repetido: ${n}.`);
    vistos.add(n);
  }
  if (!Array.isArray(c.profissoes) || new Set(c.profissoes).size < 5) falha('precisa de pelo menos 5 profissões diferentes.');
}

export function montarPersonagens(cenario, rng) {
  const nomes = rng.embaralhar(cenario.nomes).slice(0, TOTAL);
  const profissoes = rng.embaralhar([...new Set(cenario.profissoes)]).slice(0, MAX_PROFISSOES);
  const distribuidas = rng.embaralhar(Array.from({ length: TOTAL }, (_, k) => profissoes[k % profissoes.length]));
  return nomes.map((nome, k) => ({ nome, profissao: distribuidas[k] }));
}

/** Rodízio: cada dificuldade anda um cenário por dia, começando em pontos diferentes da lista. */
export function escolherCenario(cenarios, dia, dificuldade) {
  const d = ORDEM.indexOf(dificuldade);
  if (d < 0) throw new Error(`Dificuldade inválida: ${dificuldade}`);
  const lista = [...cenarios].sort((a, b) => a.id.localeCompare(b.id));
  const deslocamento = Math.floor((lista.length * d) / ORDEM.length);
  return lista[(dia + deslocamento) % lista.length];
}
```

- [ ] **Passo 5: rodar e ver passar**

Rodar: `npm test`
Esperado: todos os testes passando.

- [ ] **Passo 6: commit**

```bash
git add cenarios gerador/montar.js testes/montar.test.js
git commit -m "Cria os três primeiros cenários e o sorteio de personagens" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 9: formato do caso e geração de um caso (CT-02 a CT-04 e CT-06)

**Arquivos:**
- Criar: `nucleo/caso.js`
- Criar: `gerador/gerar-caso.js`
- Teste: `testes/caso.test.js`

**Interfaces:**
- Consome: `semente`, `criarAleatorio` (tarefa 1); `TOTAL`, `CHEIA`, `mascara`, `indice`, `posicao` (tarefa 2); `candidatas`, `texto`, `compilar`, `chavePista` (tarefas 3 a 5); `simular` (tarefa 7); `montarPersonagens`, `escolherCenario` (tarefa 8).
- Produz:
  - Caso interno: `{ dia, dificuldade, cenario: string, titulo, personagens: {nome, profissao}[20], solucao: number, inicial: number, pistas: pista[20], tentativas?: number }`
  - `nucleo/caso.js`: `embaralharSolucao(solucao, dia) → string`, `desembaralharSolucao(texto, dia) → number`, `serializar(caso) → objeto JSON`, `desserializar(json) → caso interno` (lança erro em versão desconhecida)
  - `gerador/gerar-caso.js`: `DIFICULDADES = ['facil','medio','dificil']`, `NIVEL = { facil: 1, medio: 2, dificil: 3 }`, `PESOS`, `gerarCaso({ dia, dificuldade, cenarios, maxTentativas = 500 }) → caso interno`

- [ ] **Passo 1: escrever o teste que falha**

`testes/caso.test.js`:

```js
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
      assert.ok(!new RegExp(`(^|[^\\p{L}])${nome}([^\\p{L}]|$)`, 'u').test(fala), `${pos}: ${fala}`);
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
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npm test`
Esperado: FALHA em `testes/caso.test.js` (módulos `nucleo/caso.js` e `gerador/gerar-caso.js` não encontrados).

- [ ] **Passo 3: implementar o formato do caso**

`nucleo/caso.js`:

```js
// Formato do arquivo de caso (versão 1). Usado pelo gerador para gravar e pelo site para ler.
import { CHEIA, TOTAL, indice, posicao } from './grade.js';
import { semente } from './aleatorio.js';
import { texto } from './pistas.js';

const chave = (dia) => (semente(`flagra-solucao-${dia}`) & CHEIA) >>> 0;

/** Não é segurança: só evita ver a resposta sem querer ao abrir o arquivo. */
export function embaralharSolucao(solucao, dia) {
  return ((solucao ^ chave(dia)) >>> 0).toString(36);
}

export function desembaralharSolucao(textoSolucao, dia) {
  return (parseInt(textoSolucao, 36) ^ chave(dia)) >>> 0;
}

export function serializar(caso) {
  return {
    versao: 1,
    dia_do_ciclo: caso.dia,
    dificuldade: caso.dificuldade,
    cenario: caso.cenario,
    titulo: caso.titulo,
    personagens: caso.personagens.map((p, i) => ({ pos: posicao(i), nome: p.nome, profissao: p.profissao })),
    inicial: posicao(caso.inicial),
    pistas: Object.fromEntries(caso.pistas.map((p, i) => [
      posicao(i),
      { tipo: p.tipo, params: p.params, texto: texto(p, caso.personagens, i) },
    ])),
    solucao: embaralharSolucao(caso.solucao, caso.dia),
  };
}

export function desserializar(json) {
  if (json?.versao !== 1) throw new Error(`Versão de caso desconhecida: ${json?.versao}`);
  const personagens = new Array(TOTAL);
  const pistas = new Array(TOTAL);
  for (const p of json.personagens) personagens[indice(p.pos)] = { nome: p.nome, profissao: p.profissao };
  for (const [pos, p] of Object.entries(json.pistas)) pistas[indice(pos)] = { tipo: p.tipo, params: p.params };
  return {
    dia: json.dia_do_ciclo,
    dificuldade: json.dificuldade,
    cenario: json.cenario,
    titulo: json.titulo,
    personagens,
    solucao: desembaralharSolucao(json.solucao, json.dia_do_ciclo),
    inicial: indice(json.inicial),
    pistas,
  };
}
```

- [ ] **Passo 4: implementar a geração de um caso**

`gerador/gerar-caso.js`:

```js
// Gera um caso de uma dificuldade: sorteia solução e pistas e só aceita o que o jogador perfeito resolve
// sem chute, na dificuldade pedida.
import { TOTAL, mascara } from '../nucleo/grade.js';
import { candidatas } from '../nucleo/pistas.js';
import { criarAleatorio, semente } from '../nucleo/aleatorio.js';
import { escolherCenario, montarPersonagens } from './montar.js';
import { simular } from './simular.js';

export const DIFICULDADES = ['facil', 'medio', 'dificil'];
export const NIVEL = { facil: 1, medio: 2, dificil: 3 };

// Peso de cada tipo de pista no sorteio. Pistas "fortes" (vizinhos, direção) pesam mais no fácil;
// pistas "fracas" (paridade, comparação, maioria) pesam mais no difícil.
export const PESOS = {
  facil: { vizinhos: 4, direcao: 3, contagem: 3, entre: 2, profissao: 2, conexao: 1, maioria: 0, paridade: 0, comparacao: 0 },
  medio: { vizinhos: 3, direcao: 2, contagem: 2, entre: 2, profissao: 2, conexao: 2, maioria: 1, paridade: 1, comparacao: 1 },
  dificil: { vizinhos: 2, direcao: 1, contagem: 1, entre: 2, profissao: 2, conexao: 2, maioria: 2, paridade: 2, comparacao: 3 },
};

function sortearPistas(todas, pesos, rng) {
  const porTipo = {};
  for (const p of todas) (porTipo[p.tipo] ??= []).push(p);
  const restantes = {};
  for (const tipo of Object.keys(pesos)) restantes[tipo] = rng.embaralhar(porTipo[tipo] ?? []);
  const pistas = [];
  for (let i = 0; i < TOTAL; i++) {
    const disponiveis = {};
    for (const [tipo, peso] of Object.entries(pesos)) if (peso > 0 && restantes[tipo].length) disponiveis[tipo] = peso;
    pistas.push(restantes[rng.ponderado(disponiveis)].pop());
  }
  return pistas;
}

export function gerarCaso({ dia, dificuldade, cenarios, maxTentativas = 500 }) {
  if (!NIVEL[dificuldade]) throw new Error(`Dificuldade inválida: ${dificuldade}`);
  const rng = criarAleatorio(semente(`flagra:${dia}:${dificuldade}`));
  const cenario = escolherCenario(cenarios, dia, dificuldade);
  for (let t = 0; t < maxTentativas; t++) {
    const personagens = montarPersonagens(cenario, rng);
    const culpados = rng.embaralhar([...Array(TOTAL).keys()]).slice(0, 6 + rng.inteiro(7));
    const solucao = mascara(culpados);
    const inicial = rng.inteiro(TOTAL);
    const pistas = sortearPistas(candidatas(solucao, personagens), PESOS[dificuldade], rng);
    const r = simular({ solucao, inicial, pistas });
    if (r.resolvido && r.dificuldade === NIVEL[dificuldade]) {
      return {
        dia, dificuldade, cenario: cenario.id, titulo: rng.escolher(cenario.travessuras),
        personagens, solucao, inicial, pistas, tentativas: t + 1,
      };
    }
  }
  throw new Error(`Não consegui gerar o caso "${dificuldade}" do dia ${dia} em ${maxTentativas} tentativas.`);
}
```

- [ ] **Passo 5: rodar e ver passar**

Rodar: `npm test`
Esperado: todos os testes passando. Os três testes de geração podem levar de segundos a alguns minutos.

**Se o caso difícil esbarrar no limite de tentativas:** não mude o critério de dificuldade. Ajuste primeiro `PESOS.dificil` (mais `comparacao`, `paridade` e `maioria`; menos `vizinhos` e `direcao`) e, se ainda falhar, suba `maxTentativas` para 2000. Anote o ajuste e as taxas de sucesso no commit e no registro de testes (tarefa 11).

- [ ] **Passo 6: commit**

```bash
git add nucleo/caso.js gerador/gerar-caso.js testes/caso.test.js
git commit -m "Gera casos válidos por dificuldade e define o formato do arquivo" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 10: linha de comando de geração e validação

**Arquivos:**
- Criar: `gerador/gerar.js`
- Criar: `gerador/validar.js`
- Teste: `testes/cli.test.js`

**Interfaces:**
- Consome: `validarCenario` (tarefa 8); `gerarCaso`, `DIFICULDADES`, `NIVEL` (tarefa 9); `serializar`, `desserializar` (tarefa 9); `compilar`, `chavePista` (tarefas 3 e 5); `simular` (tarefa 7).
- Produz:
  - `npm run gerar -- [--dias 365] [--inicio 0] [--saida site/casos] [--cenarios cenarios]`
  - `npm run validar -- [--pasta site/casos]`
  - `gerador/gerar.js` exporta `carregarCenarios(pasta) → cenario[]` e `nomeDoArquivo(dia, dificuldade) → string`
  - `gerador/validar.js` exporta `problemasDoCaso(json) → string[]`

- [ ] **Passo 1: escrever o teste que falha**

`testes/cli.test.js`:

```js
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
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npm test`
Esperado: FALHA em `testes/cli.test.js` (módulos `gerador/gerar.js` e `gerador/validar.js` não encontrados).

- [ ] **Passo 3: implementar o comando de geração**

`gerador/gerar.js`:

```js
// Uso: npm run gerar -- [--dias 365] [--inicio 0] [--saida site/casos] [--cenarios cenarios]
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { serializar } from '../nucleo/caso.js';
import { validarCenario } from './montar.js';
import { DIFICULDADES, gerarCaso } from './gerar-caso.js';

export function nomeDoArquivo(dia, dificuldade) {
  return `${String(dia).padStart(3, '0')}-${dificuldade}.json`;
}

export function carregarCenarios(pasta) {
  const arquivos = readdirSync(pasta).filter((a) => a.endsWith('.json')).sort();
  if (!arquivos.length) throw new Error(`Nenhum cenário encontrado em ${pasta}.`);
  return arquivos.map((arquivo) => {
    let cenario;
    try {
      cenario = JSON.parse(readFileSync(join(pasta, arquivo), 'utf8'));
    } catch (e) {
      throw new Error(`O cenário ${arquivo} não é um JSON válido: ${e.message}`);
    }
    validarCenario(cenario, arquivo);
    return cenario;
  });
}

function principal() {
  const { values } = parseArgs({
    options: {
      dias: { type: 'string', default: '365' },
      inicio: { type: 'string', default: '0' },
      saida: { type: 'string', default: 'site/casos' },
      cenarios: { type: 'string', default: 'cenarios' },
    },
  });
  const dias = Number(values.dias);
  const inicio = Number(values.inicio);
  if (!Number.isInteger(dias) || dias < 1 || !Number.isInteger(inicio) || inicio < 0 || inicio + dias > 1000) {
    throw new Error('Use --dias maior ou igual a 1 e --inicio maior ou igual a 0, com inicio + dias até 1000.');
  }
  const cenarios = carregarCenarios(values.cenarios);
  mkdirSync(values.saida, { recursive: true });
  const t0 = Date.now();
  let total = 0;
  for (let dia = inicio; dia < inicio + dias; dia++) {
    for (const dificuldade of DIFICULDADES) {
      const t = Date.now();
      const caso = gerarCaso({ dia, dificuldade, cenarios });
      const nome = nomeDoArquivo(dia, dificuldade);
      writeFileSync(join(values.saida, nome), `${JSON.stringify(serializar(caso), null, 1)}\n`, 'utf8');
      total++;
      console.log(`${nome}  ${caso.tentativas} tentativa(s)  ${((Date.now() - t) / 1000).toFixed(1)} s`);
    }
  }
  console.log(`${total} casos em ${((Date.now() - t0) / 1000).toFixed(1)} s.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    principal();
  } catch (e) {
    console.error(`Erro: ${e.message}`);
    process.exitCode = 1;
  }
}
```

- [ ] **Passo 4: implementar o comando de validação**

`gerador/validar.js`:

```js
// Uso: npm run validar -- [--pasta site/casos]
// Confere cada arquivo: pistas verdadeiras, sem repetição, solução sem chute e dificuldade declarada.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { TOTAL, posicao } from '../nucleo/grade.js';
import { chavePista, compilar } from '../nucleo/pistas.js';
import { desserializar } from '../nucleo/caso.js';
import { NIVEL } from './gerar-caso.js';
import { simular } from './simular.js';

export function problemasDoCaso(json) {
  const problemas = [];
  let caso;
  try {
    caso = desserializar(json);
  } catch (e) {
    return [e.message];
  }
  if (caso.personagens.filter(Boolean).length !== TOTAL) problemas.push('não tem 20 personagens');
  if (caso.pistas.filter(Boolean).length !== TOTAL) return [...problemas, 'não tem 20 pistas'];
  if (new Set(caso.personagens.map((p) => p?.nome)).size !== TOTAL) problemas.push('tem nomes repetidos');
  caso.pistas.forEach((p, i) => {
    try {
      if (!compilar(p)(caso.solucao)) problemas.push(`pista de ${posicao(i)} é falsa`);
    } catch (e) {
      problemas.push(`pista de ${posicao(i)} é inválida: ${e.message}`);
    }
  });
  if (new Set(caso.pistas.map(chavePista)).size !== TOTAL) problemas.push('tem pistas repetidas');
  if (!problemas.length) {
    const r = simular(caso);
    if (!r.resolvido) problemas.push('não se resolve sem chute');
    else if (r.dificuldade !== NIVEL[caso.dificuldade]) {
      problemas.push(`dificuldade medida ${r.dificuldade}, declarada "${caso.dificuldade}"`);
    }
  }
  return problemas;
}

function principal() {
  const { values } = parseArgs({ options: { pasta: { type: 'string', default: 'site/casos' } } });
  const arquivos = readdirSync(values.pasta).filter((a) => a.endsWith('.json')).sort();
  if (!arquivos.length) throw new Error(`Nenhum caso encontrado em ${values.pasta}.`);
  let comProblema = 0;
  for (const arquivo of arquivos) {
    let problemas;
    try {
      problemas = problemasDoCaso(JSON.parse(readFileSync(join(values.pasta, arquivo), 'utf8')));
    } catch (e) {
      problemas = [`não é um JSON válido: ${e.message}`];
    }
    if (problemas.length) {
      comProblema++;
      console.log(`${arquivo}: ${problemas.join('; ')}`);
    }
  }
  if (comProblema) {
    console.log(`${arquivos.length} casos conferidos, ${comProblema} com problema.`);
    process.exitCode = 1;
  } else {
    console.log(`${arquivos.length} casos conferidos, nenhum problema.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    principal();
  } catch (e) {
    console.error(`Erro: ${e.message}`);
    process.exitCode = 1;
  }
}
```

- [ ] **Passo 5: rodar e ver passar**

Rodar: `npm test`
Esperado: todos os testes passando.

- [ ] **Passo 6: commit**

```bash
git add gerador/gerar.js gerador/validar.js testes/cli.test.js
git commit -m "Cria os comandos de geração e validação dos casos" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 11: medição, registro de testes e documentação

**Arquivos:**
- Modificar: `.gitignore` (ignorar a pasta de medição)
- Modificar: `documentos/08-Registro-de-Testes.md`
- Modificar: `documentos/05-Arquitetura.md` (frase da solução embaralhada)
- Modificar: `README.md` (status e estrutura)
- Modificar: `CHANGELOG.md`

**Interfaces:**
- Consome: os comandos da tarefa 10.
- Produz: o registro da primeira execução, com tempos medidos.

- [ ] **Passo 1: ignorar a pasta de medição**

Acrescentar ao final do `.gitignore`:

```
# Saída de medições locais do gerador
medicao/
```

- [ ] **Passo 2: medir uma semana de casos**

Rodar:

```bash
npm run gerar -- --dias 7 --saida medicao
npm run validar -- --pasta medicao
```

Esperado: 21 arquivos em `medicao/`, e o validador termina com "21 casos conferidos, nenhum problema." Anote, da saída do gerador, o tempo total e o maior tempo de um caso, e a média de tentativas por dificuldade.

**Critério:** média de até 10 s por caso (o ciclo de 365 dias, com 1.095 casos, leva no máximo umas 3 horas, uma única vez). Se passar disso, ajuste `PESOS` e `maxTentativas` em `gerador/gerar-caso.js` como descrito na tarefa 9, rode `npm test` e meça de novo. Se ainda assim não atingir o critério, pare e leve os números para decisão: não mude as regras de dificuldade por conta própria.

- [ ] **Passo 3: registrar a execução**

Em `documentos/08-Registro-de-Testes.md`, substituir o bloco de exemplo `### Execução: AAAA-MM-DD — versão X.Y.Z` (e sua tabela) por uma execução real, com a data do dia, versão `0.3.0` e resultados preenchidos:

```markdown
### Execução: AAAA-MM-DD — versão 0.3.0

| Caso de teste | Resultado | Observação |
|---|---|---|
| CT-01 Geometria da grade | Passou | `testes/grade.test.js` |
| CT-02 Pistas verdadeiras | Passou | 50 soluções em `testes/pistas-candidatas.test.js`; 21 casos no validador |
| CT-03 Solução única e sem chute | Passou | 21 casos no validador |
| CT-04 Classificação de dificuldade | Passou | 21 casos no validador |
| CT-05 Recusa de chute | Passou | `testes/verificador.test.js` |
| CT-06 Reprodutibilidade | Passou | `testes/caso.test.js` |
| CT-07 Desempenho do verificador | Pendente | Medido no navegador, no Plano 2 |
| CT-08 a CT-11 | Pendente | Dependem do site (Plano 2) |

Medição do gerador (7 dias, 21 casos): tempo total X s; média Y s por caso; maior Z s; tentativas médias: fácil A, médio B, difícil C.
```

Troque `AAAA-MM-DD`, X, Y, Z, A, B e C pelos valores reais. Se algum resultado não passou, escreva "Falhou" e o motivo.

O CT-02, o CT-03 e o CT-04 pedem 1.000 casos na especificação. Aqui eles cobrem 21 casos gerados mais os testes automatizados. A contagem completa é feita no Plano 2, quando o ciclo inteiro for gerado e validado; anote isso na observação.

- [ ] **Passo 4: alinhar a arquitetura com o que foi implementado**

Em `documentos/05-Arquitetura.md`, trocar a frase:

```
**Solução embaralhada:** a solução é gravada codificada (por exemplo, com uma operação XOR com o dia do ciclo, em base64).
```

por:

```
**Solução embaralhada:** a solução é gravada codificada (XOR com uma chave derivada do dia do ciclo, escrita em base 36; ver `nucleo/caso.js`).
```

- [ ] **Passo 5: atualizar o README**

Em `README.md`:
- trocar a linha de status por `` `STATUS` Núcleo e gerador prontos; próximo passo é o site (Plano 2) ``;
- na seção "Estrutura do repositório", trocar o bloco por:

```
documentos/       especificação do jogo e planos de implementação
nucleo/           lógica compartilhada: grade, pistas, verificador e formato do caso
gerador/          comandos que geram e validam os casos
cenarios/         cenários em JSON: nomes, profissões e travessuras
testes/           testes automatizados (npm test)
site/             o jogo: HTML, CSS e JavaScript puro, com os casos       (Plano 2)
```

- na seção "Próximos passos", marcar o item 3 como concluído (`3. ~~Construir o núcleo e o gerador, com testes.~~ Concluído.`);
- acrescentar, antes de "Histórico de versões":

```markdown
## Como rodar

Requer Node.js 24 ou mais recente. Não há dependências para instalar.

```
npm test                                  # todos os testes
npm run gerar -- --dias 7 --saida medicao # gera 7 dias de casos
npm run validar -- --pasta medicao        # confere os casos gerados
```
```

- [ ] **Passo 6: atualizar o CHANGELOG**

Acrescentar no topo de `CHANGELOG.md`, logo abaixo do título:

```markdown
## [0.3.0] - AAAA-MM-DD

### Adicionado
- Núcleo do jogo: grade, nove tipos de pista, verificador lógico e formato do caso.
- Gerador de casos por dificuldade, com jogador perfeito que garante solução única sem chute.
- Comandos `npm run gerar` e `npm run validar`.
- Três cenários iniciais: firma, condomínio e escola.
```

(com a data real no lugar de `AAAA-MM-DD`).

- [ ] **Passo 7: rodar tudo uma última vez**

Rodar: `npm test`
Esperado: todos os testes passando.

- [ ] **Passo 8: commit e envio da branch**

```bash
git add .gitignore documentos/08-Registro-de-Testes.md documentos/05-Arquitetura.md README.md CHANGELOG.md
git commit -m "Registra a primeira execução e documenta o gerador" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -u origin nucleo-e-gerador
```

Depois, abrir o pull request de `nucleo-e-gerador` para `main` pelo site do GitHub e integrar após a revisão.
