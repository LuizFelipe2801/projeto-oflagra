// Gera um caso de uma dificuldade por construção guiada: a pista de cada personagem só é sorteada quando
// ele é revelado na simulação do jogador perfeito. Se um passo trava (ou exige mais pistas do que a
// dificuldade permite), sorteia-se de novo a pista de um personagem revelado no último lote, em vez de
// descartar o caso inteiro. O caso final é conferido de novo por simular().
import { CHEIA, TOTAL, mascara } from '../nucleo/grade.js';
import { candidatas, compilar } from '../nucleo/pistas.js';
import { criarAleatorio, semente } from '../nucleo/aleatorio.js';
import { escolherCenario, montarPersonagens } from './montar.js';
import { passo, simular } from './simular.js';

export const DIFICULDADES = ['facil', 'medio', 'dificil'];
export const NIVEL = { facil: 1, medio: 2, dificil: 3 };

// Peso de cada tipo de pista no sorteio. Pistas "fortes" (vizinhos, direção) pesam mais no fácil;
// pistas "fracas" (paridade, comparação, maioria) pesam mais no difícil.
export const PESOS = {
  facil: { vizinhos: 4, direcao: 3, contagem: 3, entre: 2, profissao: 2, conexao: 1, maioria: 0, paridade: 0, comparacao: 0 },
  medio: { vizinhos: 3, direcao: 2, contagem: 2, entre: 2, profissao: 2, conexao: 2, maioria: 1, paridade: 1, comparacao: 1 },
  dificil: { vizinhos: 2, direcao: 1, contagem: 1, entre: 2, profissao: 2, conexao: 2, maioria: 2, paridade: 2, comparacao: 3 },
};

// Quantas vezes um passo travado pode trocar a pista de um revelado antes de abandonar a tentativa.
const TROCAS_POR_PASSO = 40;

/** Sorteador de pistas sem repetição, ponderado por tipo. Devolve null quando não há mais pistas. */
function criarSorteio(todas, pesos, rng) {
  const restantes = {};
  for (const tipo of Object.keys(pesos)) restantes[tipo] = [];
  for (const p of todas) if (restantes[p.tipo]) restantes[p.tipo].push(p);
  for (const tipo of Object.keys(restantes)) restantes[tipo] = rng.embaralhar(restantes[tipo]);
  return () => {
    const disponiveis = {};
    for (const [tipo, peso] of Object.entries(pesos)) if (peso > 0 && restantes[tipo].length) disponiveis[tipo] = peso;
    if (!Object.keys(disponiveis).length) return null;
    return restantes[rng.ponderado(disponiveis)].pop();
  };
}

/** Uma tentativa de construção guiada. Devolve as 20 pistas ou null se não conseguir. */
function construir({ solucao, inicial, alvo, sortear, rng }) {
  const pistas = new Array(TOTAL);
  const bitInicial = (1 << inicial) >>> 0;
  const conhecidos = { mascara: bitInicial, culpados: (solucao & bitInicial) >>> 0 };
  const reveladas = [inicial];
  let lote = [inicial];
  let maior = 0;

  pistas[inicial] = sortear();
  if (!pistas[inicial]) return null;

  while (conhecidos.mascara !== CHEIA) {
    let resultado = passo(reveladas.map((i) => pistas[i]), conhecidos);
    let trocas = 0;
    while (!resultado.novos || resultado.k > alvo) {
      if (trocas++ >= TROCAS_POR_PASSO) return null;
      const quem = lote[rng.inteiro(lote.length)];
      const nova = sortear();
      if (!nova) return null;
      pistas[quem] = nova;
      resultado = passo(reveladas.map((i) => pistas[i]), conhecidos);
    }
    maior = Math.max(maior, resultado.k);
    lote = [];
    for (let i = 0; i < TOTAL; i++) {
      if (resultado.novos & (1 << i)) {
        lote.push(i);
        reveladas.push(i);
        pistas[i] = sortear();
        if (!pistas[i]) return null;
      }
    }
    conhecidos.mascara = (conhecidos.mascara | resultado.novos) >>> 0;
    conhecidos.culpados = (solucao & conhecidos.mascara) >>> 0;
  }
  return maior === alvo ? pistas : null;
}

export function gerarCaso({ dia, dificuldade, cenarios, maxTentativas = 200 }) {
  if (!NIVEL[dificuldade]) throw new Error(`Dificuldade inválida: ${dificuldade}`);
  const alvo = NIVEL[dificuldade];
  const rng = criarAleatorio(semente(`flagra:${dia}:${dificuldade}`));
  const cenario = escolherCenario(cenarios, dia, dificuldade);
  for (let t = 0; t < maxTentativas; t++) {
    const personagens = montarPersonagens(cenario, rng);
    const culpados = rng.embaralhar([...Array(TOTAL).keys()]).slice(0, 6 + rng.inteiro(7));
    const solucao = mascara(culpados);
    const inicial = rng.inteiro(TOTAL);
    const sortear = criarSorteio(candidatas(solucao, personagens), PESOS[dificuldade], rng);
    const pistas = construir({ solucao, inicial, alvo, sortear, rng });
    if (!pistas) continue;
    const r = simular({ solucao, inicial, pistas });
    if (r.resolvido && r.dificuldade === alvo && pistas.every((p) => compilar(p)(solucao))) {
      return {
        dia, dificuldade, cenario: cenario.id, cenarioNome: cenario.nome, titulo: rng.escolher(cenario.travessuras),
        personagens, solucao, inicial, pistas, tentativas: t + 1,
      };
    }
  }
  throw new Error(`Não consegui gerar o caso "${dificuldade}" do dia ${dia} em ${maxTentativas} tentativas.`);
}
