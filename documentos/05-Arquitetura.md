# Arquitetura

## Visão geral

```
                gerado com antecedência                        no navegador do jogador
┌────────────┐   ┌────────────┐   ┌──────────────────┐        ┌───────────────────────┐
│ cenarios/  │──▶│  gerador   │──▶│ casos/034        │──fetch─▶│ site (HTML/CSS/JS)    │
│ (JSON)     │   │  (Node)    │   │   -facil.json    │        │  ├─ interface          │
└────────────┘   └─────┬──────┘   │   -medio.json    │        │  ├─ estado e progresso │
                       │ usa      │   -dificil.json  │        │  └─ verificador ◀──┐   │
                 ┌─────▼──────┐   └──────────────────┘        └────────────────────┼──┘
                 │ verificador │◀─────── o mesmo módulo, usado nos dois lados ─────┘
                 └────────────┘
```

**O ponto central é o verificador ser um único módulo**, usado pelo gerador (para garantir solução única e medir dificuldade) e pelo site (para aplicar a regra "sem chute"). Se os dois lados tivessem lógicas separadas, um caso aprovado na geração poderia travar no navegador.

## Componentes

### `nucleo/` — lógica compartilhada (JavaScript puro, sem dependências)

| Arquivo | Responsabilidade |
|---|---|
| `grade.js` | Posições, vizinhos, linhas, colunas, "entre", conexão |
| `pistas.js` | Cada tipo de pista como uma função `(solucao) → verdadeiro/falso`, mais o texto da pista |
| `verificador.js` | Dado um conjunto de pistas e de marcações conhecidas, diz quais personagens já são dedutíveis e com qual valor |
| `deducao.js` | O menor conjunto de pistas reveladas que resolve alguém: usado pelo gerador para medir dificuldade e pelo site para dar a dica |
| `caso.js` | Formato do arquivo: serialização e embaralhamento da solução |

**Como o verificador decide:** um personagem é dedutível quando **todas** as soluções compatíveis com as pistas reveladas concordam sobre ele. As soluções compatíveis são enumeradas percorrendo todas as combinações dos personagens ainda não conhecidos e descartando as que violam alguma pista. Com 20 personagens, no pior caso são 2²⁰ (cerca de 1 milhão) de combinações, o que leva perto de 70 ms; cada personagem revelado corta esse número pela metade.

### `gerador/` — linha de comando (Node.js)

```
node gerador/gerar.js --dias 365
```

Para cada dia do ciclo e cada dificuldade:

1. Escolhe o cenário do dia por rodízio (cada dificuldade começa num ponto diferente da lista) e sorteia os culpados (entre 6 e 12, para não ficar óbvio).
2. Sorteia o personagem inicial.
3. Lista todas as pistas verdadeiras para a solução (as candidatas).
4. **Construção guiada:** simula um jogador perfeito a partir do personagem inicial. A pista de cada personagem só é sorteada quando ele é revelado. A cada passo, o jogador resolve o que for dedutível com o menor número de pistas e revela as pistas desses personagens.
5. Se um passo trava, ou exige mais pistas do que a dificuldade permite, sorteia-se de novo a pista de um personagem revelado no último lote (até 40 trocas por passo). Se ainda assim travar, a tentativa é abandonada e outra solução é sorteada. Chegando ao fim, o caso tem **solução única e não exige chute**.
6. Mede a dificuldade (abaixo) e guarda o caso só se ela bater com a pedida; o caso final é conferido de novo pela simulação completa.
7. Grava `casos/<dia do ciclo>-<dificuldade>.json`, por exemplo `casos/034-medio.json`.

> O sorteio cego das 20 pistas de uma vez, testado primeiro, acertava em 0,1% a 0,5% das tentativas, e o difícil falhava na maioria dos dias. A construção guiada gerou 180 casos seguidos sem falha.

A semente do sorteio vem do dia do ciclo e da dificuldade, então rodar o gerador de novo produz exatamente os mesmos casos, **desde que os cenários e a versão do gerador sejam os mesmos**. Acrescentar um cenário muda o rodízio de todos os dias, e mudar pesos ou regras de sorteio muda os casos. Um ciclo publicado deve ser gerado e guardado de uma vez.

### Classificação de dificuldade

Durante a simulação, cada dedução é feita com o **menor conjunto de pistas reveladas** que basta para ela. A dificuldade do caso é o maior desses conjuntos ao longo da partida:

| Maior conjunto necessário | Dificuldade |
|---|---|
| 1 pista | Fácil |
| 2 pistas | Médio |
| 3 ou mais | Difícil |

### `site/` — o jogo

```
site/
  index.html          tela única: dificuldade, grade, painel de marcação, pistas, regras, resultado
  css/estilo.css      variáveis de cor, modo escuro e "reduzir movimento"
  js/config.js        data de lançamento, tamanho do ciclo, endereço e fuso
  js/calendario.js    data de hoje em Brasília, número do caso e nome do arquivo
  js/partida.js       marcação sem chute, erros, dicas em dois níveis e desempenho por posição
  js/estado.js        progresso do caso, histórico, sequência e estatísticas (localStorage)
  js/resultado.js     monta o texto com emojis
  js/interface.js     tudo que toca no DOM
  js/app.js           liga calendário, caso, partida, estado e interface
  js/nucleo/          cópia de nucleo/ (npm run sincronizar; um teste garante que é idêntica)
  casos/              o ciclo gerado
```

Os módulos `calendario`, `partida`, `estado` e `resultado` não tocam no DOM e são testados no Node. A cópia de `nucleo/` é feita por `npm run sincronizar`; o teste `testes/site-nucleo.test.js` falha se ela estiver desatualizada.

**Dica em dois níveis:** o site chama `deducao.passo` com as pistas reveladas. O primeiro pedido realça as pistas do menor conjunto que resolve alguém; o segundo realça o primeiro personagem desse conjunto e marca a posição dele como "com dica" no resultado. A cada acerto, a dica volta ao nível 1.

## Formato de um caso

```json
{
  "versao": 1,
  "dia_do_ciclo": 34,
  "dificuldade": "medio",
  "cenario": "firma",
  "titulo": "Quem comeu o bolo do chefe?",
  "personagens": [
    { "pos": "A1", "nome": "Dona Cida", "profissao": "copeira" }
  ],
  "inicial": "C3",
  "pistas": { "A1": { "tipo": "vizinhos", "params": { "n": 2 }, "texto": "Tenho exatamente 2 culpados entre os vizinhos." } },
  "solucao": "<embaralhada>"
}
```

**Solução embaralhada:** a solução é gravada codificada (XOR com uma chave derivada do dia do ciclo, escrita em base 36; ver `nucleo/caso.js`). Isso não é segurança; serve só para que ninguém veja a resposta sem querer ao abrir o arquivo. Para um passatempo sem prêmio, é suficiente.

## Publicação dos casos

1. Os cenários são escritos à mão, uma vez.
2. Um comando gera o **ciclo** inteiro: 365 dias, com três casos por dia (1.095 arquivos).
3. Os arquivos vão para `site/casos/` e são publicados junto com o site. O workflow `.github/workflows/publicar.yml` roda os testes e o validador e publica `site/` no GitHub Pages a cada push na `main`.
4. O navegador calcula qual caso abrir:

```
dias desde o lançamento = hoje (horário de Brasília) − data de lançamento
dia do ciclo            = dias desde o lançamento mod 365
arquivo                 = casos/<dia do ciclo>-<dificuldade>.json
```

5. **Quando o ciclo termina, ele recomeça sozinho.** Depois de um ano, um caso só volta para quem jogou há um ano, o que não atrapalha um passatempo. O tamanho do ciclo é configurável; 182 dias (seis meses) também é aceitável.

**O que fica exposto:** como todos os arquivos estão no site, um curioso consegue abrir o caso de amanhã. Num passatempo sem prêmio, isso não estraga o jogo de ninguém.

**Evolução, se o jogo pegar:** uma rotina agendada do GitHub (GitHub Actions) passa a gerar e publicar só os casos do dia, de madrugada. Continua sem trabalho manual, e o caso de amanhã deixa de existir antes da hora.

## Horário e numeração

- O caso do dia vale de 00h00 a 23h59 no horário de Brasília (`America/Sao_Paulo`), seja qual for o fuso do aparelho.
- O número do caso conta os dias desde a data de lançamento e **não volta para 1** quando o ciclo recomeça: o caso #400 usa o conteúdo do dia 35 do ciclo.
- Data de lançamento: **2026-10-27** (`DATA_LANCAMENTO` em `site/js/config.js`); esse dia é o caso #1 e usa o dia 0 do ciclo.
- A data é calculada uma vez por carga da página: quem começa às 23h59 termina o mesmo caso; o caso novo aparece ao recarregar.

## Dados guardados no navegador

| Chave | Conteúdo |
|---|---|
| `progresso:<número>:<dificuldade>` | Personagens revelados, erros e dicas do caso em andamento (apagado ao terminar) |
| `historico` | Por data: dificuldades concluídas, com número do caso, erros e dicas |
| `pref:dificuldade`, `pref:regras-vistas` | Última dificuldade escolhida e se as regras já foram mostradas |

Nada disso sai do aparelho, a não ser os eventos anônimos de estatística descritos em [03-Metodologia](03-Metodologia.md#validação). Toda leitura e gravação no `localStorage` é protegida, para que o jogo funcione mesmo em janela anônima ou com o armazenamento bloqueado.

## Tratamento de erros

| Situação | Comportamento |
|---|---|
| Arquivo do caso do dia não encontrado | Mensagem "o caso de hoje ainda não chegou; volte em alguns minutos" e oferta do caso de ontem |
| Arquivo com versão desconhecida | Mesma mensagem; o erro vai para o console |
| `localStorage` indisponível | O jogo funciona, sem salvar progresso nem sequência |
| Verificador lento (aparelho fraco) | O limite de RNF-003 é testado em aparelho de entrada; se passar disso, as soluções compatíveis passam a ser calculadas uma vez e atualizadas a cada jogada, em vez de recalculadas do zero |
