import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DESTINO, ORIGEM } from '../ferramentas/sincronizar.js';

test('site/js/nucleo é cópia idêntica de nucleo (rode npm run sincronizar)', () => {
  const arquivos = readdirSync(ORIGEM).filter((a) => a.endsWith('.js'));
  const diferentes = arquivos.filter((a) =>
    !existsSync(join(DESTINO, a)) || readFileSync(join(ORIGEM, a), 'utf8') !== readFileSync(join(DESTINO, a), 'utf8'));
  assert.deepEqual(diferentes, []);
});
