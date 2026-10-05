# Plano de testes

## Testes automatizados (Node, `node --test`)

|Caso de teste | CT-01 Geometria da grade |
|:---|:---|
| Requisitos associados | RF-002 |
| Objetivo | Garantir que vizinhos, linhas, colunas, "entre", borda e conexão estão corretos |
| Passos | Conferir os vizinhos de um canto (3), de uma borda (5) e do miolo (8); "entre" em linha e em coluna; conexão com e sem diagonal |
| Critérios de êxito | Todos os resultados batem com a tabela de definições de [04-Regras-do-Jogo](04-Regras-do-Jogo.md#definições) |

|Caso de teste | CT-02 Pistas verdadeiras |
|:---|:---|
| Requisitos associados | RF-014 |
| Objetivo | Garantir que toda pista gerada é verdadeira para a solução |
| Passos | Gerar 1.000 casos e avaliar cada pista contra a solução |
| Critérios de êxito | Nenhuma pista falsa |

|Caso de teste | CT-03 Solução única e sem chute |
|:---|:---|
| Requisitos associados | RF-014 |
| Objetivo | Garantir que todo caso gerado se resolve até o fim por dedução, partindo do personagem inicial |
| Passos | Simular o jogador perfeito em 1.000 casos |
| Critérios de êxito | Todos chegam ao fim, e o resultado é igual à solução gravada |

|Caso de teste | CT-04 Classificação de dificuldade |
|:---|:---|
| Requisitos associados | RF-015 |
| Objetivo | Garantir que cada caso está na dificuldade declarada |
| Passos | Recalcular a dificuldade de 300 casos de cada nível |
| Critérios de êxito | 100% batem com o arquivo |

|Caso de teste | CT-05 Recusa de chute |
|:---|:---|
| Requisitos associados | RF-005 |
| Objetivo | Garantir que o verificador recusa marcação não dedutível |
| Passos | Em casos montados à mão, tentar marcar personagens não dedutíveis no início |
| Critérios de êxito | Todas recusadas, sem contar erro |

|Caso de teste | CT-06 Reprodutibilidade |
|:---|:---|
| Requisitos associados | RF-013 |
| Objetivo | Garantir que o mesmo dia do ciclo gera o mesmo caso |
| Passos | Rodar o gerador duas vezes para o ciclo completo |
| Critérios de êxito | Arquivos idênticos |

|Caso de teste | CT-07 Desempenho do verificador |
|:---|:---|
| Requisitos associados | RNF-003 |
| Objetivo | Garantir resposta rápida em aparelho fraco |
| Passos | Medir o tempo da verificação no pior momento de 100 casos difíceis, com a CPU limitada a 4× mais lenta no Chrome |
| Critérios de êxito | Abaixo de 100 ms em todos |

## Testes manuais e de interface

|Caso de teste | CT-08 Partida completa no celular |
|:---|:---|
| Requisitos associados | RF-003 a RF-009 |
| Objetivo | Garantir que a partida inteira funciona com uma mão |
| Passos | Jogar um caso de cada dificuldade em 390 px, usando dica e errando de propósito |
| Critérios de êxito | Recusa, erro, dica e resultado se comportam como nas regras |

|Caso de teste | CT-09 Resultado compartilhado |
|:---|:---|
| Requisitos associados | RF-009 |
| Objetivo | Garantir que o texto chega certo no WhatsApp e não revela a solução |
| Passos | Copiar o resultado e colar numa conversa |
| Critérios de êxito | Emojis e link aparecem corretamente; nenhuma informação sobre quem é culpado |

|Caso de teste | CT-10 Acessibilidade |
|:---|:---|
| Requisitos associados | RNF-005 a RNF-009 |
| Objetivo | Garantir uso por toque, teclado e leitor de tela |
| Passos | Auditoria visual em 390, 900 e 1440 px; partida só com teclado; leitura com leitor de tela |
| Critérios de êxito | Zero alvos de toque abaixo de 44 px, contraste de pelo menos 4,5:1, culpado e inocente anunciados por texto |

|Caso de teste | CT-11 Teste com pessoas de fora |
|:---|:---|
| Requisitos associados | RF-012 |
| Objetivo | Garantir que as regras se entendem sem explicação |
| Passos | Cinco pessoas que nunca jogaram recebem só o link |
| Critérios de êxito | Pelo menos quatro terminam o caso fácil sem ajuda |
