// Progresso e histórico no navegador. Toda leitura e gravação é protegida: sem armazenamento, o jogo segue sem salvar.
import { diasEntre } from './calendario.js';

function ler(armazenamento, chave) {
  try {
    const bruto = armazenamento.getItem(chave);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

function gravar(armazenamento, chave, valor) {
  try {
    armazenamento.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function criarEstado(armazenamento = globalThis.localStorage) {
  let disponivel = false;
  try {
    armazenamento.setItem('teste', '1');
    armazenamento.removeItem('teste');
    disponivel = true;
  } catch {
    disponivel = false;
  }
  const chave = (numero, dificuldade) => `progresso:${numero}:${dificuldade}`;
  return {
    disponivel,
    carregarProgresso(numero, dificuldade) {
      const p = ler(armazenamento, chave(numero, dificuldade));
      return p && p.numero === numero && p.dificuldade === dificuldade ? p : null;
    },
    salvarProgresso(numero, dificuldade, dados) {
      return gravar(armazenamento, chave(numero, dificuldade), { ...dados, numero, dificuldade });
    },
    apagarProgresso(numero, dificuldade) {
      try { armazenamento.removeItem(chave(numero, dificuldade)); } catch { /* sem armazenamento */ }
    },
    carregarHistorico() {
      return ler(armazenamento, 'historico') ?? {};
    },
    registrarConclusao(data, numero, dificuldade, { erros, dicas }) {
      const h = this.carregarHistorico();
      h[data] = { ...(h[data] ?? {}), [dificuldade]: { numero, erros, dicas } };
      gravar(armazenamento, 'historico', h);
      return h;
    },
    lerPreferencia(nome) {
      return ler(armazenamento, `pref:${nome}`);
    },
    gravarPreferencia(nome, valor) {
      return gravar(armazenamento, `pref:${nome}`, valor);
    },
  };
}

/** Dias seguidos com pelo menos uma conclusão, terminando hoje ou ontem. */
export function sequencia(historico, hoje) {
  const datas = Object.keys(historico).filter((d) => Object.keys(historico[d]).length).sort();
  if (!datas.length) return 0;
  let fim = datas.at(-1);
  if (diasEntre(fim, hoje) > 1) return 0;
  let n = 1;
  for (let k = datas.length - 2; k >= 0; k--) {
    if (diasEntre(datas[k], fim) !== 1) break;
    fim = datas[k];
    n++;
  }
  return n;
}

export function estatisticas(historico) {
  const r = { facil: { jogos: 0, semErro: 0 }, medio: { jogos: 0, semErro: 0 }, dificil: { jogos: 0, semErro: 0 } };
  for (const dia of Object.values(historico)) {
    for (const [dif, c] of Object.entries(dia)) {
      if (!r[dif]) continue;
      r[dif].jogos++;
      if (c.erros === 0) r[dif].semErro++;
    }
  }
  return r;
}
