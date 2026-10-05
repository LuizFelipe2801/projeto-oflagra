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
