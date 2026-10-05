# Serviços

## Perfis de cliente

Perfis fictícios, montados a partir dos padrões vistos na prospecção. Não representam pessoas reais.

|Perfil | Dona de loja de roupas |
|:---|:---|
| Situação | Vende pelo Instagram e pelo WhatsApp. Posta as peças no feed e responde preço uma a uma. |
| Necessidades | Catálogo com filtro por tamanho e preço; pedido indo direto para o WhatsApp. |
| Objeção comum | "O Instagram já resolve." |

|Perfil | Dono de oficina mecânica |
|:---|:---|
| Situação | Clientela de indicação. Aparece no Maps, mas a ficha aponta para o Instagram. |
| Necessidades | Aparecer na busca "oficina perto de mim", mostrar serviços e avaliações, receber pedidos de orçamento. |
| Objeção comum | "Não tenho tempo de cuidar de site." |

|Perfil | Dona de salão de beleza |
|:---|:---|
| Situação | Agenda pelo WhatsApp, portfólio de trabalhos espalhado no feed. |
| Necessidades | Página de serviços, galeria organizada, botão de agendar. |
| Objeção comum | "O Sebrae faz mais barato." |

## Histórias de cliente

|EU COMO... | QUERO/PRECISO ... | PARA ... |
|---|---|---|
| Dona de loja | Mostrar o catálogo com filtro de tamanho | Parar de responder "tem no M?" peça por peça |
| Dona de loja | Atualizar preço e foto sem pedir ajuda | Manter o site certo sem custo extra |
| Dono de oficina | Aparecer na busca local do Google | Receber cliente que não me conhece |
| Dona de salão | Um botão que abre o WhatsApp com a mensagem pronta | Agendar sem atrito |
| Qualquer cliente | Saber se o site trouxe resultado | Decidir se vale manter a mensalidade |

## O que é entregue

| Entrega | Descrição |
|---|---|
| Site | One-page ou institucional, com catálogo quando fizer sentido. Rápido no celular, HTTPS, botão de WhatsApp. |
| Google Meu Negócio | Perfil criado ou reivindicado na conta do cliente: categorias, descrição, fotos, área de atendimento. |
| Vídeo de apresentação | 20 a 60 segundos, vertical (1080×1920), mostrando o site no celular. Serve para o cliente divulgar. |
| Documentação para o cliente | PDF com o que foi entregue, como pedir alteração e como editar o que for autoatendível. |
| Documentação técnica | README no repositório do site: estrutura, como rodar, publicação e domínio. |
| Relatório de resultado | Linha de base antes da publicação e acompanhamento em 30, 60 e 90 dias. |
| Manutenção mensal (opcional) | Hospedagem, ajustes, atualização de catálogo e suporte, com o que está coberto listado item a item. |

## Requisitos de toda entrega

### Requisitos funcionais

|ID    | Descrição | Prioridade |
|------|-----------|------------|
|RF-001| O site deve ter um botão que abre o WhatsApp do comércio com uma mensagem pronta | ALTA |
|RF-002| O catálogo, quando existir, deve permitir busca sem diferenciar acentos | ALTA |
|RF-003| O catálogo deve permitir filtro por categoria e, quando houver, por tamanho | ALTA |
|RF-004| Os dados do catálogo devem ficar em um arquivo que o cliente consiga editar | ALTA |
|RF-005| O site deve funcionar aberto direto do arquivo (duplo clique), para a demonstração ao cliente | MÉDIA |
|RF-006| O link compartilhado no WhatsApp deve mostrar prévia com imagem | MÉDIA |

### Requisitos não funcionais

|ID     | Descrição | Prioridade |
|-------|-----------|------------|
|RNF-001| Página inteira abaixo de cerca de 1,2 MB | ALTA |
|RNF-002| Nenhuma rolagem horizontal em 390, 900 e 1440 px de largura | ALTA |
|RNF-003| Alvos de toque com pelo menos 44 px | ALTA |
|RNF-004| Contraste de texto de pelo menos 4,5:1, medido nos pixels quando o fundo for gradiente ou imagem | ALTA |
|RNF-005| Conteúdo visível com "reduzir movimento" ligado | ALTA |
|RNF-006| Título e descrição com cidade e segmento, para busca local | MÉDIA |
|RNF-007| Nenhum depoimento fictício publicado | ALTA |
|RNF-008| Textos de áreas reguladas (saúde, alimentação) conferidos com as regras do conselho antes de publicar | ALTA |

## Não está incluído

- Loja virtual com carrinho, pagamento e login (projeto à parte, com outro escopo).
- Gestão de redes sociais e criação de posts.
- Anúncios pagos.
- Fotografia profissional dos produtos.
