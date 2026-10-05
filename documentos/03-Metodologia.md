# Metodologia

## Etapas

| Etapa | Objetivo | Termina quando |
|---|---|---|
| 1. Especificação | Esta documentação revisada e aprovada | Todas as seções marcadas como "proposta" forem aprovadas |
| 2. Gerador e verificador | Gerar casos válidos e classificados por dificuldade, pela linha de comando | Gerar 30 dias de casos que passem em todos os testes |
| 3. Protótipo jogável | Site estático com o caso do dia | Pessoas de fora conseguirem terminar um caso sem explicação |
| 4. Publicação e validação | Publicar e medir | Quatro semanas de dados de retorno |
| 5. Decisão | Continuar como portfólio ou virar negócio | Metas da validação comparadas com o resultado |

## Validação

> Proposta, a revisar. As metas são hipóteses iniciais, não referências de mercado.

| Métrica | Como medir | Meta inicial |
|---|---|---|
| Volta no dia seguinte | Fração de quem jogou num dia e jogou no seguinte | 30% |
| Volta na semana | Fração de quem jogou num dia e jogou de novo em até 7 dias | 15% |
| Termina o caso | Fração de casos iniciados que chegam ao fim | 60% |
| Compartilha | Fração de casos terminados em que o resultado foi copiado | 10% |

**Como medir sem identificar ninguém:** a sequência de dias é calculada no próprio navegador. O site envia apenas eventos anônimos, como "caso concluído, médio, 2 erros" ou "sequência atual: 3 dias", para uma ferramenta de estatística sem cookies (por exemplo, GoatCounter ou Plausible). Nenhum identificador do jogador sai do aparelho.

**Primeira divulgação:** grupos de WhatsApp de amigos e família, o status do WhatsApp e o Instagram de TI.

## Do portfólio ao negócio

Só se as metas de retorno forem atingidas. Fontes de receita possíveis, nessa ordem:

1. Apoiador do dia, discreto e fora da área de jogo ("o caso de hoje é oferecido por…").
2. Assinatura opcional com o arquivo de casos antigos e as estatísticas detalhadas.
3. Licenciamento de casos para jornais, revistas e escolas.

**Nunca:** dica paga, recompensa aleatória, prêmio em dinheiro ou venda de dados. Isso contraria a proposta do jogo e, no caso da recompensa aleatória, também o ECA Digital (Lei nº 15.211/2025).

## Processo de trabalho

- Uma branch por funcionalidade, integrada na `main` por pull request, mesmo trabalhando sozinho, para manter o histórico legível.
- Mensagens de commit no imperativo, em português.
- Toda alteração no gerador ou no verificador acompanha teste.
- Os casos de cada semana são gerados, revisados e publicados com pelo menos 7 dias de antecedência.

## Ferramentas

| Ferramenta | Uso |
|---|---|
| Node.js | Gerador de casos e testes |
| HTML, CSS e JavaScript puro | Site do jogo, sem framework e sem etapa de build |
| Git e GitHub | Versionamento e revisão |
| GitHub Pages ou Netlify | Publicação do site estático |
| GoatCounter ou Plausible | Estatística anônima, sem cookies |
