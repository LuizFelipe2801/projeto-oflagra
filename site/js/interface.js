// Tudo que toca no DOM: grade, painel de marcação, pistas, dicas e diálogos.
import { NUM_COLUNAS, TOTAL, posicao } from './nucleo/grade.js';
import { texto as textoDaPista } from './nucleo/pistas.js';
import { culpado, revelado } from './partida.js';

const $ = (id) => document.getElementById(id);

export function elementos() {
  return {
    numero: $('numero-do-caso'),
    segmentos: [...document.querySelectorAll('.segmentos [data-dificuldade]')],
    cenario: $('cenario-do-caso'),
    titulo: $('titulo-do-caso'),
    erroDeCarga: $('erro-de-carga'),
    erroTexto: $('erro-texto'),
    botaoOntem: $('botao-ontem'),
    jogo: $('jogo'),
    placarErros: $('placar-erros'),
    placarDicas: $('placar-dicas'),
    grade: $('grade'),
    aviso: $('aviso'),
    painel: $('painel'),
    painelNome: $('painel-nome'),
    painelProfissao: $('painel-profissao'),
    botaoCulpado: $('botao-culpado'),
    botaoInocente: $('botao-inocente'),
    botaoFecharPainel: $('botao-fechar-painel'),
    botaoDica: $('botao-dica'),
    dicaTexto: $('dica-texto'),
    listaDePistas: $('lista-de-pistas'),
    botaoResultado: $('botao-resultado'),
    botaoRegras: $('botao-regras'),
    botaoEstatisticas: $('botao-estatisticas'),
    dialogoRegras: $('dialogo-regras'),
    dialogoResultado: $('dialogo-resultado'),
    resultadoResumo: $('resultado-resumo'),
    resultadoTexto: $('resultado-texto'),
    resultadoSequencia: $('resultado-sequencia'),
    resultadoAviso: $('resultado-aviso'),
    botaoCopiar: $('botao-copiar'),
    botaoCompartilhar: $('botao-compartilhar'),
    dialogoEstatisticas: $('dialogo-estatisticas'),
    estatisticasSequencia: $('estatisticas-sequencia'),
    estatisticasCorpo: $('estatisticas-corpo'),
  };
}

function estadoDoPersonagem(p, i) {
  if (!revelado(p, i)) return 'nao-revelado';
  return culpado(p, i) ? 'culpado' : 'inocente';
}

const ROTULO = { 'nao-revelado': 'ainda não revelado', culpado: 'culpado', inocente: 'inocente' };

/** Monta os 20 crachás uma vez; depois só se atualizam. */
export function montarGrade(el, partida, aoTocar) {
  el.innerHTML = '';
  for (let l = 0; l < TOTAL / NUM_COLUNAS; l++) {
    const linha = document.createElement('div');
    linha.setAttribute('role', 'row');
    linha.style.display = 'contents';
    for (let c = 0; c < NUM_COLUNAS; c++) {
      const i = l * NUM_COLUNAS + c;
      const { nome, profissao } = partida.caso.personagens[i];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cracha';
      b.dataset.indice = String(i);
      b.setAttribute('role', 'gridcell');
      b.tabIndex = i === 0 ? 0 : -1;
      b.innerHTML = `<span class="cracha-pos" aria-hidden="true">${posicao(i)}</span>`
        + `<span class="cracha-nome">${nome}</span><span class="cracha-prof">${profissao}</span>`
        + '<span class="cracha-estado"></span><span class="carimbo" aria-hidden="true"></span>';
      b.addEventListener('click', () => aoTocar(i));
      linha.append(b);
    }
    el.append(linha);
  }
  el.addEventListener('keydown', (e) => {
    const atual = e.target.closest('.cracha');
    if (!atual) return;
    const i = Number(atual.dataset.indice);
    const salto = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: NUM_COLUNAS, ArrowUp: -NUM_COLUNAS }[e.key];
    if (salto === undefined) return;
    const j = i + salto;
    if (j < 0 || j >= TOTAL) return;
    if (Math.abs(salto) === 1 && Math.floor(j / NUM_COLUNAS) !== Math.floor(i / NUM_COLUNAS)) return;
    e.preventDefault();
    focarCracha(el, j);
  });
  atualizarGrade(el, partida);
}

export function focarCracha(el, i) {
  for (const b of el.querySelectorAll('.cracha')) b.tabIndex = Number(b.dataset.indice) === i ? 0 : -1;
  el.querySelector(`.cracha[data-indice="${i}"]`)?.focus();
}

export function atualizarGrade(el, partida, { recem = -1, selecionado = -1 } = {}) {
  for (const b of el.querySelectorAll('.cracha')) {
    const i = Number(b.dataset.indice);
    const estado = estadoDoPersonagem(partida, i);
    const { nome, profissao } = partida.caso.personagens[i];
    b.classList.toggle('culpado', estado === 'culpado');
    b.classList.toggle('inocente', estado === 'inocente');
    b.classList.toggle('recem', i === recem);
    b.setAttribute('aria-pressed', i === selecionado ? 'true' : 'false');
    b.setAttribute('aria-label', `${posicao(i)}, ${nome}, ${profissao}, ${ROTULO[estado]}`);
    b.querySelector('.cracha-estado').textContent = estado === 'nao-revelado' ? '' : estado;
    b.querySelector('.carimbo').textContent = estado === 'culpado' ? '✕' : estado === 'inocente' ? '✓' : '';
  }
}

export function sacudir(el, i, classe) {
  const b = el.querySelector(`.cracha[data-indice="${i}"]`);
  if (!b) return;
  b.classList.remove(classe);
  void b.offsetWidth;
  b.classList.add(classe);
}

export function destacar(grade, lista, { personagens = [], pistas = [] } = {}) {
  for (const b of grade.querySelectorAll('.cracha')) b.classList.toggle('destaque', personagens.includes(Number(b.dataset.indice)));
  for (const li of lista.querySelectorAll('.pista')) li.classList.toggle('destaque', pistas.includes(Number(li.dataset.indice)));
}

/** Lista das pistas reveladas, a mais recente no topo. */
export function atualizarPistas(el, partida, aoTocar) {
  el.innerHTML = '';
  const ordem = [...partida.reveladas].reverse();
  ordem.forEach((i, k) => {
    const { nome } = partida.caso.personagens[i];
    const fala = textoDaPista(partida.caso.pistas[i], partida.caso.personagens, i);
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `pista ${culpado(partida, i) ? 'culpado' : 'inocente'}${k === 0 ? ' nova' : ''}`;
    b.dataset.indice = String(i);
    b.innerHTML = `<span class="pista-quem">${nome}</span><span class="pista-pos">${posicao(i)} · ${culpado(partida, i) ? 'culpado' : 'inocente'}</span>`
      + `<span class="pista-fala">${fala}</span>`;
    b.setAttribute('aria-label', `${nome}, ${posicao(i)}, ${culpado(partida, i) ? 'culpado' : 'inocente'}, diz: ${fala}`);
    b.addEventListener('click', () => aoTocar(i));
    li.append(b);
    el.append(li);
  });
}

export function abrirPainel(el, partida, i) {
  const { nome, profissao } = partida.caso.personagens[i];
  el.painelNome.textContent = nome;
  el.painelProfissao.textContent = profissao;
  el.painel.hidden = false;
  el.painel.dataset.indice = String(i);
}

export function fecharPainel(el) {
  el.painel.hidden = true;
  delete el.painel.dataset.indice;
}

export function avisar(el, classe, mensagem) {
  el.aviso.className = `aviso ${classe}`;
  el.aviso.textContent = mensagem;
}

export function atualizarPlacar(el, partida) {
  const e = partida.totalErros;
  const d = partida.totalDicas;
  el.placarErros.textContent = `${e} erro${e === 1 ? '' : 's'}`;
  el.placarDicas.textContent = `${d} dica${d === 1 ? '' : 's'}`;
}

export function marcarDificuldade(el, dificuldade, concluidas) {
  for (const b of el.segmentos) {
    const d = b.dataset.dificuldade;
    b.setAttribute('aria-checked', d === dificuldade ? 'true' : 'false');
    b.querySelector('.segmento-estado').textContent = concluidas[d] ? 'concluído' : '';
  }
}

export function abrirDialogo(d) {
  if (typeof d.showModal === 'function') d.showModal();
  else d.setAttribute('open', '');
}
