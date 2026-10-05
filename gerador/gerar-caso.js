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
