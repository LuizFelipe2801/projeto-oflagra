# Projeto Oflagra

`TIPO` Jogo diário de dedução lógica, no navegador

`STATUS` Em especificação

`ENDEREÇO` oflagra.com.br (domínio ainda não registrado)

`INÍCIO` 2026-10-05

Todo dia, três casos novos (fácil, médio e difícil). Vinte personagens numa grade, uma travessura do dia a dia ("quem comeu o bolo da firma?") e um punhado de pistas. Todo mundo fala a verdade. O jogador descobre quem é culpado e quem é inocente, sem chutar, e compartilha o resultado no WhatsApp.

```
Flagra #34 · Médio
A firma: quem comeu o bolo?
🟩🟩🟩🟨
🟩🟥🟩🟩
🟩🟩🟩🟩
🟨🟩🟩🟩
🟩🟩🟩🟩
1 erro, 2 dicas
oflagra.com.br
```

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

## Estrutura do repositório

```
documentos/       especificação do jogo (esta é a fonte da verdade)
nucleo/           lógica compartilhada: grade, pistas e verificador      (a criar)
gerador/          linha de comando que gera os casos                      (a criar)
cenarios/         cenários em JSON: nomes, profissões e travessuras       (a criar)
site/             o jogo: HTML, CSS e JavaScript puro, com os casos       (a criar)
```

## Decisões

**Tomadas**

- Mecânica de dedução sem chute, inspirada em *Clues by Sam*.
- Um cenário diferente por dia, como "pele" sobre a mesma lógica.
- Tom de travessura do dia a dia.
- O jogador escolhe a dificuldade: três casos por dia.
- Casos gerados com antecedência e site estático, sem servidor.
- Sem login na primeira versão.
- Começa como portfólio publicado; vira negócio se a retenção for boa.
- Nome: Flagra, no endereço oflagra.com.br.

**Propostas, a revisar**

- Detalhes da arquitetura ([05](documentos/05-Arquitetura.md)).
- Formato dos cenários e guia de texto ([06](documentos/06-Cenarios-e-Conteudo.md)).
- Metas de validação ([03](documentos/03-Metodologia.md#validação)).
- Plano de testes ([07](documentos/07-Plano-de-Testes.md)).

## Próximos passos

1. Revisar e aprovar as propostas acima.
2. Escrever o plano de implementação.
3. Construir o núcleo e o gerador, com testes.
4. Construir o site e publicar o protótipo.

## Histórico de versões

Ver [CHANGELOG.md](CHANGELOG.md).
