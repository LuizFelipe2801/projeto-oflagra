// Liga calendário, caso do dia, partida, estado e interface.
import { DIFICULDADES, NOME_DA_DIFICULDADE } from './config.js';
import { arquivoDoCaso, dataAnterior, dataDeHoje, numeroDoCaso } from './calendario.js';
import { desserializar } from './nucleo/caso.js';
import { posicao } from './nucleo/grade.js';
import { texto as textoDaPista } from './nucleo/pistas.js';
import { criarPartida, desempenho, marcar, pedirDica, revelado, salvar, terminada } from './partida.js';
import { criarEstado, estatisticas, sequencia } from './estado.js';
import { textoDoResultado } from './resultado.js';
import {
  abrirDialogo, abrirPainel, atualizarGrade, atualizarPistas, atualizarPlacar, avisar, destacar, elementos,
  fecharPainel, focarCracha, marcarDificuldade, montarGrade, sacudir,
} from './interface.js';

const el = elementos();
const estado = criarEstado();
const hoje = dataDeHoje();
let data = hoje;
let numero = numeroDoCaso(data);
let dificuldade = DIFICULDADES.includes(estado.lerPreferencia('dificuldade')) ? estado.lerPreferencia('dificuldade') : 'facil';
let partida = null;
let selecionado = -1;

/** Ponto para ligar uma estatística anônima (GoatCounter ou Plausible) mais tarde. */
function evento(nome, dados = {}) {
  void nome;
  void dados;
}

function concluidasHoje() {
  const h = estado.carregarHistorico()[data] ?? {};
  return Object.fromEntries(DIFICULDADES.map((d) => [d, Boolean(h[d])]));
}

function salvarProgresso() {
  estado.salvarProgresso(numero, dificuldade, salvar(partida));
}

async function carregarCaso() {
  el.erroDeCarga.hidden = true;
  el.jogo.hidden = true;
  el.titulo.textContent = 'Carregando o caso de hoje…';
  el.cenario.textContent = '';
  el.numero.textContent = `#${numero}`;
  marcarDificuldade(el, dificuldade, concluidasHoje());
  try {
    const resposta = await fetch(arquivoDoCaso(numero, dificuldade), { cache: 'no-cache' });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const caso = desserializar(await resposta.json());
    caso.numero = numero;
    iniciarPartida(caso);
  } catch (e) {
    console.error('Não consegui carregar o caso:', e);
    el.titulo.textContent = 'O caso de hoje ainda não chegou';
    el.erroTexto.textContent = 'Volte em alguns minutos. Enquanto isso, dá para jogar o caso de ontem.';
    el.erroDeCarga.hidden = false;
    el.botaoOntem.hidden = numero <= 1;
  }
}

function iniciarPartida(caso) {
  partida = criarPartida(caso, estado.carregarProgresso(numero, dificuldade));
  selecionado = -1;
  el.cenario.textContent = `${caso.cenarioNome ?? ''} · ${NOME_DA_DIFICULDADE[caso.dificuldade]}`;
  el.titulo.textContent = caso.titulo;
  el.jogo.hidden = false;
  fecharPainel(el);
  avisar(el, '', '');
  el.dicaTexto.textContent = '';
  montarGrade(el.grade, partida, tocarPersonagem);
  atualizarPistas(el.listaDePistas, partida, tocarPista);
  atualizarPlacar(el, partida);
  el.botaoResultado.hidden = !terminada(partida);
  el.botaoDica.disabled = terminada(partida);
  if (partida.reveladas.length === 1) {
    const i = caso.inicial;
    avisar(el, 'acerto', `${caso.personagens[i].nome} (${posicao(i)}) já está revelado e deu a primeira pista.`);
  }
  evento('caso_aberto', { dificuldade });
}

function tocarPersonagem(i) {
  if (revelado(partida, i)) {
    const nome = partida.caso.personagens[i].nome;
    avisar(el, '', `${nome} já foi revelado. A pista dele está na lista abaixo.`);
    destacar(el.grade, el.listaDePistas, { personagens: [i], pistas: [i] });
    return;
  }
  selecionado = i;
  atualizarGrade(el.grade, partida, { selecionado });
  abrirPainel(el, partida, i);
  el.botaoCulpado.focus({ preventScroll: true });
}

function tocarPista(i) {
  destacar(el.grade, el.listaDePistas, { personagens: [i], pistas: [i] });
  focarCracha(el.grade, i);
}

function marcarSelecionado(ehCulpado) {
  if (selecionado < 0) return;
  const i = selecionado;
  const nome = partida.caso.personagens[i].nome;
  const r = marcar(partida, i, ehCulpado);
  destacar(el.grade, el.listaDePistas);
  el.dicaTexto.textContent = '';
  if (r === 'recusada') {
    sacudir(el.grade, i, 'recusada');
    avisar(el, 'recusada', `Ainda não dá para ter certeza sobre ${nome}. Releia as pistas ou peça uma dica.`);
    return;
  }
  if (r === 'erro') {
    sacudir(el.grade, i, 'errou');
    atualizarPlacar(el, partida);
    salvarProgresso();
    avisar(el, 'erro', `Errou: ${nome} não é ${ehCulpado ? 'culpado' : 'inocente'}. Tente de novo.`);
    return;
  }
  selecionado = -1;
  fecharPainel(el);
  atualizarGrade(el.grade, partida, { recem: i });
  atualizarPistas(el.listaDePistas, partida, tocarPista);
  atualizarPlacar(el, partida);
  const fala = textoDaPista(partida.caso.pistas[i], partida.caso.personagens, i);
  avisar(el, 'acerto', `${nome} é ${ehCulpado ? 'culpado' : 'inocente'} e diz: “${fala}”`);
  focarCracha(el.grade, i);
  if (terminada(partida)) encerrar();
  else salvarProgresso();
}

function darDica() {
  const d = pedirDica(partida);
  if (!d) {
    el.dicaTexto.textContent = 'Releia as pistas: alguém já dá para resolver.';
    return;
  }
  atualizarPlacar(el, partida);
  salvarProgresso();
  const nomes = (lista) => lista.map((i) => `${partida.caso.personagens[i].nome} (${posicao(i)})`).join(' e ');
  if (d.nivel === 1) {
    destacar(el.grade, el.listaDePistas, { personagens: d.pistas, pistas: d.pistas });
    el.dicaTexto.textContent = d.pistas.length === 1
      ? `Olhe a pista de ${nomes(d.pistas)}. Ela resolve alguém. Peça de novo para saber quem.`
      : `Combine as pistas de ${nomes(d.pistas)}. Juntas, resolvem alguém. Peça de novo para saber quem.`;
  } else {
    destacar(el.grade, el.listaDePistas, { personagens: [d.personagem], pistas: d.pistas });
    el.dicaTexto.textContent = `${nomes([d.personagem])} já dá para resolver com as pistas marcadas.`;
    focarCracha(el.grade, d.personagem);
  }
  evento('dica', { nivel: d.nivel });
}

function textoAtual() {
  return textoDoResultado({
    numero, dificuldade, cenarioNome: partida.caso.cenarioNome ?? '', titulo: partida.caso.titulo,
    desempenho: desempenho(partida), erros: partida.totalErros, dicas: partida.totalDicas,
  });
}

function encerrar() {
  estado.apagarProgresso(numero, dificuldade);
  const historico = estado.registrarConclusao(data, numero, dificuldade, { erros: partida.totalErros, dicas: partida.totalDicas });
  marcarDificuldade(el, dificuldade, concluidasHoje());
  el.botaoResultado.hidden = false;
  el.botaoDica.disabled = true;
  evento('caso_concluido', { dificuldade, erros: partida.totalErros, dicas: partida.totalDicas });
  mostrarResultado(historico);
}

function mostrarResultado(historico = estado.carregarHistorico()) {
  const e = partida.totalErros;
  el.resultadoResumo.textContent = e === 0
    ? 'Caso fechado sem nenhum erro. Flagra limpo.'
    : `Caso fechado com ${e} erro${e === 1 ? '' : 's'}. Amanhã tem mais.`;
  el.resultadoTexto.textContent = textoAtual();
  const s = sequencia(historico, hoje);
  el.resultadoSequencia.textContent = s > 1 ? `Sequência: ${s} dias seguidos.` : s === 1 ? 'Primeiro dia da sequência. Volte amanhã.' : '';
  el.resultadoAviso.textContent = '';
  el.botaoCompartilhar.hidden = !navigator.share;
  abrirDialogo(el.dialogoResultado);
}

async function copiar() {
  try {
    await navigator.clipboard.writeText(textoAtual());
    el.resultadoAviso.textContent = 'Copiado. É só colar no WhatsApp.';
    evento('resultado_copiado', { dificuldade });
  } catch {
    el.resultadoAviso.textContent = 'Não deu para copiar sozinho: selecione o texto acima e copie.';
  }
}

async function compartilhar() {
  try {
    await navigator.share({ text: textoAtual() });
    evento('resultado_compartilhado', { dificuldade });
  } catch { /* cancelado */ }
}

function mostrarEstatisticas() {
  const h = estado.carregarHistorico();
  const s = sequencia(h, hoje);
  el.estatisticasSequencia.textContent = s ? `Sequência atual: ${s} dia${s === 1 ? '' : 's'}.` : 'Nenhuma sequência ativa. Termine um caso hoje para começar.';
  const st = estatisticas(h);
  el.estatisticasCorpo.innerHTML = DIFICULDADES.map((d) =>
    `<tr><th scope="row">${NOME_DA_DIFICULDADE[d]}</th><td>${st[d].jogos}</td><td>${st[d].semErro}</td></tr>`).join('');
  abrirDialogo(el.dialogoEstatisticas);
}

function escolherDificuldade(d) {
  if (d === dificuldade) return;
  dificuldade = d;
  estado.gravarPreferencia('dificuldade', d);
  carregarCaso();
}

for (const b of el.segmentos) b.addEventListener('click', () => escolherDificuldade(b.dataset.dificuldade));
el.botaoCulpado.addEventListener('click', () => marcarSelecionado(true));
el.botaoInocente.addEventListener('click', () => marcarSelecionado(false));
el.botaoFecharPainel.addEventListener('click', () => {
  selecionado = -1;
  fecharPainel(el);
  atualizarGrade(el.grade, partida);
});
el.botaoDica.addEventListener('click', darDica);
el.botaoResultado.addEventListener('click', () => mostrarResultado());
el.botaoCopiar.addEventListener('click', copiar);
el.botaoCompartilhar.addEventListener('click', compartilhar);
el.botaoRegras.addEventListener('click', () => abrirDialogo(el.dialogoRegras));
el.botaoEstatisticas.addEventListener('click', mostrarEstatisticas);
el.botaoOntem.addEventListener('click', () => {
  data = dataAnterior(data);
  numero = Math.max(1, numero - 1);
  carregarCaso();
});

if (!estado.lerPreferencia('regras-vistas')) {
  abrirDialogo(el.dialogoRegras);
  el.dialogoRegras.addEventListener('close', () => estado.gravarPreferencia('regras-vistas', true), { once: true });
}

carregarCaso();
