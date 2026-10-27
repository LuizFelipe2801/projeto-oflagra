// Uso: npm run sincronizar — copia nucleo/ para site/js/nucleo/ (o site não tem etapa de build).
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ORIGEM = fileURLToPath(new URL('../nucleo/', import.meta.url));
export const DESTINO = fileURLToPath(new URL('../site/js/nucleo/', import.meta.url));

export function sincronizar() {
  mkdirSync(DESTINO, { recursive: true });
  const arquivos = readdirSync(ORIGEM).filter((a) => a.endsWith('.js'));
  for (const a of arquivos) copyFileSync(join(ORIGEM, a), join(DESTINO, a));
  return arquivos;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`${sincronizar().length} arquivos copiados para site/js/nucleo/.`);
}
