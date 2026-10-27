# Projeto Oflagra

`TIPO` Jogo diário de dedução lógica, no navegador

`STATUS` Protótipo jogável pronto em homologação (Plano 2); próximo passo é publicar e testar com pessoas de fora

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
documentos/       especificação do jogo e planos de implementação
nucleo/           lógica compartilhada: grade, pistas, verificador e formato do caso
gerador/          comandos que geram e validam os casos
cenarios/         cenários em JSON: nomes, profissões e travessuras
testes/           testes automatizados (npm test)
site/             o jogo: HTML, CSS e JavaScript puro, mais site/casos/ com o ciclo
ferramentas/      servidor local e cópia do núcleo para o site
.github/          testes em todo push e publicação do site no GitHub Pages
```

## Decisões

**Tomadas**

- Mecânica de dedução sem chute, inspirada em *Clues by Sam*.
- Um cenário diferente por dia, como "pele" sobre a mesma lógica.
- Tom de travessura do dia a dia.
- O jogador escolhe a dificuldade: três casos por dia.
- Casos gerados com antecedência e site estático, sem servidor.
- Casos gerados em lote, num ciclo de 365 dias que recomeça sozinho: nenhuma tarefa diária.
- Sem login na primeira versão.
- Começa como portfólio publicado; vira negócio se a retenção for boa.
- Nome: Flagra, no endereço oflagra.com.br.
- Público amplo: de adolescentes a idosos, sem limitar a um perfil.
- Arquitetura com um verificador único, usado pelo gerador e pelo site ([05](documentos/05-Arquitetura.md)).
- Banco de 20 cenários, com meta de 12 completos no lançamento ([06](documentos/06-Cenarios-e-Conteudo.md)).
- Metas de validação como hipóteses iniciais ([03](documentos/03-Metodologia.md#validação)).
- Plano de testes com 11 casos ([07](documentos/07-Plano-de-Testes.md)).
- Profissões escritas em forma neutra ("da copa", "do RH"), para não brigar com o gênero do nome sorteado ([06](documentos/06-Cenarios-e-Conteudo.md)).
- Data de lançamento 2026-10-27: o caso #1 é desse dia ([05](documentos/05-Arquitetura.md#horário-e-numeração)).
- Publicação pelo GitHub Pages a cada push na `main` ([05](documentos/05-Arquitetura.md#publicação-dos-casos)).

## Próximos passos

1. ~~Revisar e aprovar a especificação.~~ Concluído em 2026-10-05.
2. ~~Escrever o plano de implementação.~~ Concluído (Plano 1).
3. ~~Construir o núcleo e o gerador, com testes.~~ Concluído.
4. ~~Construir o site.~~ Concluído (Plano 2).
5. Publicar o protótipo (aprovar a `hml` na `main` e ligar o GitHub Pages) e testar com cinco pessoas de fora (CT-11).
6. Registrar o domínio e ligar a estatística anônima.

## Como rodar

Requer Node.js 24 ou mais recente. Não há dependências para instalar.

```
npm test                                  # todos os testes
npm run gerar -- --dias 7 --saida medicao # gera 7 dias de casos
npm run validar -- --pasta medicao        # confere os casos gerados
npm run sincronizar                       # copia nucleo/ para site/js/nucleo/
npm run site                              # abre o jogo em http://localhost:8000
```

O site é estático: qualquer servidor de arquivos serve a pasta `site/`. A publicação oficial sai do GitHub Pages pelo workflow `.github/workflows/publicar.yml`, que roda os testes e o validador antes de publicar.

## Branches

| Branch | Papel |
|---|---|
| `main` | Produção: só o que foi aprovado na homologação |
| `hml` | Homologação: onde cada entrega é testada antes de ir para a `main` |
| outras | Uma por funcionalidade, integrada primeiro na `hml` |

## Histórico de versões

Ver [CHANGELOG.md](CHANGELOG.md).
