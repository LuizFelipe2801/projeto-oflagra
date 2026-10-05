# Plano de qualidade

Verificações feitas em toda entrega antes de publicar. Cada caso de verificação está ligado a um requisito de [02-Servicos](02-Servicos.md#requisitos-de-toda-entrega).

|Caso de verificação | CV-01 Rolagem horizontal |
|:---|:---|
| Requisitos associados | RNF-002 |
| Objetivo | Garantir que nenhuma página role para o lado |
| Passos | Rodar `capturar.mjs` em 390, 900 e 1440 px |
| Critério de êxito | O script reporta "overflow horizontal: nenhum" nas três larguras |

|Caso de verificação | CV-02 Alvos de toque |
|:---|:---|
| Requisitos associados | RNF-003 |
| Objetivo | Garantir que todo elemento clicável seja fácil de tocar no celular |
| Passos | Auditoria visual em 390 px |
| Critério de êxito | Zero elementos clicáveis com menos de 44 px |

|Caso de verificação | CV-03 Contraste |
|:---|:---|
| Requisitos associados | RNF-004 |
| Objetivo | Garantir texto legível sobre qualquer fundo |
| Passos | Medir nos pixels, nas três larguras, sobretudo onde o fundo é gradiente ou imagem |
| Critério de êxito | Todo texto com pelo menos 4,5:1 (3:1 para texto grande) |

|Caso de verificação | CV-04 Peso da página |
|:---|:---|
| Requisitos associados | RNF-001 |
| Objetivo | Garantir carregamento rápido no 4G |
| Passos | Medir a transferência total da home e do catálogo no celular |
| Critério de êxito | Abaixo de cerca de 1,2 MB por página |

|Caso de verificação | CV-05 Movimento reduzido |
|:---|:---|
| Requisitos associados | RNF-005 |
| Objetivo | Garantir que nenhum conteúdo dependa de animação para aparecer |
| Passos | Abrir o site com "reduzir movimento" ligado e rolar até o fim |
| Critério de êxito | Todas as seções visíveis |

|Caso de verificação | CV-06 WhatsApp |
|:---|:---|
| Requisitos associados | RF-001, RF-006 |
| Objetivo | Garantir que o contato funciona e que o link compartilhado tem prévia |
| Passos | Tocar em todo botão de WhatsApp num celular real; colar o link do site numa conversa |
| Critério de êxito | Abre a conversa certa com a mensagem pronta; a prévia mostra imagem e título |

|Caso de verificação | CV-07 Catálogo |
|:---|:---|
| Requisitos associados | RF-002, RF-003, RF-004, RF-005 |
| Objetivo | Garantir que busca, filtros e edição funcionam |
| Passos | Buscar um produto com e sem acento; combinar filtros; editar o JSON; abrir o site por duplo clique e por servidor |
| Critério de êxito | Os resultados batem nos dois modos e a alteração no JSON aparece |

|Caso de verificação | CV-08 Conteúdo |
|:---|:---|
| Requisitos associados | RNF-006, RNF-007, RNF-008 |
| Objetivo | Garantir que nada falso ou irregular vá ao ar |
| Passos | Conferir título e descrição; procurar marcadores `.validar` e comentários `PUBLICAR:`; conferir depoimentos e textos de área regulada |
| Critério de êxito | Nenhum marcador restante, nenhum depoimento fictício, textos aprovados por escrito |

|Caso de verificação | CV-09 Console |
|:---|:---|
| Requisitos associados | Todos |
| Objetivo | Garantir que não há erro de JavaScript |
| Passos | Abrir o console do navegador em todas as páginas |
| Critério de êxito | Zero erros |
