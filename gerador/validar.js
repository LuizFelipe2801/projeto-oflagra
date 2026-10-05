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
