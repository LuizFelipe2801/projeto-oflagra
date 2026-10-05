# Flagra

`TIPO` Jogo diário de dedução lógica, no navegador

`STATUS` Em especificação

`ENDEREÇO` oflagra.com.br (domínio ainda não registrado)

`INÍCIO` 2026-10-05

Todo dia, três casos novos (fácil, médio e difícil). Vinte personagens numa grade, uma travessura do dia a dia ("quem comeu o bolo da firma?") e um punhado de pistas. Todo mundo fala a verdade. O jogador deduz quem é culpado e quem é inocente, sem chutar, e compartilha o resultado no WhatsApp.

Inspirado na mecânica do jogo finlandês *Clues by Sam*, com cenários, personagens, textos e humor brasileiros, todos originais.

## Responsável

* Luiz — produto e desenvolvimento

## Documentação

<ol>
<li><a href="documentos/01-Contexto.md">Contexto</a>: problema, objetivos, justificativa e público</li>
<li><a href="documentos/02-Especificacao.md">Especificação</a>: perfis de jogador, histórias e requisitos</li>
<li><a href="documentos/03-Metodologia.md">Metodologia</a>: etapas, validação, processo e ferramentas</li>
<li><a href="documentos/04-Regras-do-Jogo.md">Regras do jogo</a>: grade, jogadas, pistas e resultado</li>
<li><a href="documentos/05-Arquitetura.md">Arquitetura</a>: gerador, verificador, site e formato dos dados</li>
<li><a href="documentos/06-Cenarios-e-Conteudo.md">Cenários e conteúdo</a>: como um cenário é montado e o tom dos textos</li>
<li><a href="documentos/07-Plano-de-Testes.md">Plano de testes</a></li>
<li><a href="documentos/08-Registro-de-Testes.md">Registro de testes</a></li>
<li><a href="documentos/09-Referencias.md">Referências</a></li>
</ol>

## Estado das decisões

| Decidido | Proposto, a revisar |
|---|---|
| Mecânica de dedução sem chute, inspirada em *Clues by Sam* | Detalhes da arquitetura (doc 05) |
| Um cenário diferente por dia, como "pele" sobre a mesma lógica | Formato dos cenários e guia de texto (doc 06) |
| Tom de travessura do dia a dia | Metas de validação (doc 03) |
| O jogador escolhe a dificuldade: três casos por dia | Plano de testes (doc 07) |
| Casos gerados com antecedência, site estático, sem servidor | |
| Sem login na primeira versão | |
| Começa como portfólio publicado; vira negócio se a retenção for boa | |
| Nome: Flagra, no endereço oflagra.com.br | |

## Histórico de versões

Ver [CHANGELOG.md](CHANGELOG.md).
