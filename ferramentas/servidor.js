// Uso: npm run site — serve a pasta site/ em http://localhost:8000 (só para desenvolvimento).
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../site/', import.meta.url));
const PORTA = Number(process.env.PORTA ?? 8000);
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

createServer((req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let arquivo = join(RAIZ, normalize(caminho === '/' ? '/index.html' : caminho));
  if (!arquivo.startsWith(RAIZ)) arquivo = join(RAIZ, 'index.html');
  try {
    if (statSync(arquivo).isDirectory()) arquivo = join(arquivo, 'index.html');
    statSync(arquivo);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Não encontrado');
    return;
  }
  res.writeHead(200, { 'Content-Type': TIPOS[extname(arquivo)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
  createReadStream(arquivo).pipe(res);
}).listen(PORTA, () => console.log(`Flagra em http://localhost:${PORTA}`));
