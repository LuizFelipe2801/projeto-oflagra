# Arquitetura

> A escolha do caminho (casos gerados com antecedência, site estático) está **decidida**. Os detalhes abaixo são **proposta**, a revisar.

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

**Como o verificador decide:** um personagem é dedutível quando **todas** as soluções compatíveis com as pistas reveladas concordam sobre ele. As soluções compatíveis são enumeradas por busca com retrocesso (backtracking), cortando cedo os ramos que já violam alguma pista. Com 20 personagens, no pior caso são 2²⁰ (cerca de 1 milhão) de combinações; o corte cedo reduz isso a uma fração.

### `gerador/` — linha de comando (Node.js)

```
node gerador/gerar.js --dias 365
```

Para cada dia do ciclo e cada dificuldade:

1. Sorteia um cenário e a distribuição de culpados (entre 6 e 12, para não ficar óbvio).
2. Sorteia o personagem inicial.
3. Cria candidatos a pista para cada personagem, todos verdadeiros para a solução.
4. **Simula um jogador perfeito:** a partir da pista inicial, resolve tudo o que for dedutível, revela as pistas desses personagens e repete.
5. Se o jogador simulado travar, troca pistas e tenta de novo. Se chegar ao fim, o caso tem **solução única e não exige chute**.
6. Mede a dificuldade (abaixo) e guarda o caso só se ela bater com a pedida.
7. Grava `casos/<dia do ciclo>-<dificuldade>.json`, por exemplo `casos/034-medio.json`.

A semente do sorteio vem do dia do ciclo e da dificuldade, então rodar o gerador de novo produz exatamente os mesmos casos.

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
  index.html          tela única: escolha da dificuldade, grade, regras
  css/style.css
  js/app.js           liga interface, estado e verificador
  js/estado.js        progresso do caso, sequência e estatísticas (localStorage)
  js/resultado.js     monta o texto com emojis
  js/nucleo/          cópia de nucleo/, sem etapa de build
  casos/              arquivos gerados
```

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

**Solução embaralhada:** a solução é gravada codificada (por exemplo, com uma operação XOR com o dia do ciclo, em base64). Isso não é segurança; serve só para que ninguém veja a resposta sem querer ao abrir o arquivo. Para um passatempo sem prêmio, é suficiente.

## Publicação dos casos

> Decidido: geração em lote. Nenhuma tarefa diária.

1. Os cenários são escritos à mão, uma vez.
2. Um comando gera o **ciclo** inteiro: 365 dias, com três casos por dia (1.095 arquivos).
3. Os arquivos vão para `site/casos/` e são publicados junto com o site.
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

## Dados guardados no navegador

| Chave | Conteúdo |
|---|---|
| `progresso:<data>:<dificuldade>` | Marcações, erros e dicas do caso em andamento |
| `historico` | Por data: dificuldades concluídas, erros e dicas |

Nada disso sai do aparelho, a não ser os eventos anônimos de estatística descritos em [03-Metodologia](03-Metodologia.md#validação). Toda leitura e gravação no `localStorage` é protegida, para que o jogo funcione mesmo em janela anônima ou com o armazenamento bloqueado.

## Tratamento de erros

| Situação | Comportamento |
|---|---|
| Arquivo do caso do dia não encontrado | Mensagem "o caso de hoje ainda não chegou; volte em alguns minutos" e oferta do caso de ontem |
| Arquivo com versão desconhecida | Mesma mensagem; o erro vai para o console |
| `localStorage` indisponível | O jogo funciona, sem salvar progresso nem sequência |
| Verificador lento (aparelho fraco) | O limite de RNF-003 é testado em aparelho de entrada; se passar disso, as soluções compatíveis passam a ser calculadas uma vez e atualizadas a cada jogada, em vez de recalculadas do zero |
