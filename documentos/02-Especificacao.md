# Especificação

## Perfis de jogador

Perfis fictícios, usados para orientar decisões. Não representam pessoas reais.

|Perfil | Adolescente |
|:---|:---|
| Situação | Tem 15 anos, joga no celular no recreio e manda tudo para o grupo da turma. |
| Necessidades | Algo rápido, com cara de jogo, para provocar os amigos. |
| Frustração | Jogo infantil demais ou cheio de anúncio. |

|Perfil | Universitária |
|:---|:---|
| Situação | Estuda para o Enem e concursos e gosta de questões de lógica. |
| Necessidades | O caso difícil, que exige combinar várias pistas. |
| Frustração | Enigma que só se resolve no chute. |

|Perfil | Profissional no intervalo |
|:---|:---|
| Situação | Trabalha em escritório e joga Termo no almoço. |
| Necessidades | Terminar em até 15 minutos, com uma mão só. |
| Frustração | Cadastro obrigatório ou pedido para baixar aplicativo. |

|Perfil | Mãe que joga com o filho |
|:---|:---|
| Situação | Joga o caso fácil junto com o filho de 10 anos, à noite. |
| Necessidades | Regras simples de explicar e nada impróprio para criança. |
| Frustração | Texto com violência ou crime. |

|Perfil | Aposentado |
|:---|:---|
| Situação | Tem 68 anos e faz palavras cruzadas todo dia para manter a cabeça ativa. |
| Necessidades | Letra grande, botões grandes e nenhum relógio correndo. |
| Frustração | Pressa, letra pequena e regra que só faz sentido para quem já joga. |

|Perfil | Tio do grupo da família |
|:---|:---|
| Situação | Recebe o resultado dos sobrinhos no WhatsApp e clica para ver o que é. |
| Necessidades | Entender as regras em um minuto, sem tutorial longo. |
| Frustração | Ter que instalar alguma coisa para jogar. |

|Perfil | Professora de matemática |
|:---|:---|
| Situação | Dá aula para o ensino médio e procura atividades de raciocínio lógico. |
| Necessidades | Um caso que dê para resolver em grupo, projetado no quadro. |
| Frustração | Ter que criar conta ou expor dados dos alunos. |

|Perfil | Ex-apostador |
|:---|:---|
| Situação | Parou de apostar e quer algo para o tempo livre no celular. |
| Necessidades | Um desafio diário que termina, sem dinheiro e sem recompensa sorteada. |
| Frustração | Mecânicas que lembram cassino, como roleta, prêmio ou "quase ganhou". |

|Perfil | Pessoa cega |
|:---|:---|
| Situação | Usa o celular com leitor de tela todos os dias. |
| Necessidades | Grade e pistas lidas em ordem clara, com o estado de cada personagem anunciado. |
| Frustração | Jogo que só funciona olhando cores. |

## Histórias de usuário

|EU COMO... | QUERO/PRECISO ... | PARA ... |
|---|---|---|
| Jogador | Abrir o link e jogar sem cadastro | Começar em segundos |
| Jogador | Escolher fácil, médio ou difícil | Jogar no nível do meu dia |
| Jogador | Ser impedido de marcar quando ainda não dá para ter certeza | Nunca resolver no chute |
| Jogador | Pedir uma dica quando travar | Não desistir do caso |
| Jogador | Continuar de onde parei se fechar o navegador | Não perder o progresso |
| Jogador | Compartilhar o resultado sem estragar a solução | Comparar com os amigos |
| Jogador | Ver minha sequência de dias e minhas estatísticas | Ter motivo para voltar amanhã |
| Adolescente | Mandar o resultado para o grupo da turma com um toque | Provocar quem errou mais |
| Universitária | Ter um caso difícil de verdade | Treinar dedução para provas |
| Profissional no intervalo | Terminar o caso em até 15 minutos | Caber no almoço |
| Mãe que joga com o filho | Textos leves e sem violência | Jogar junto com a criança |
| Aposentado | Letra e botões grandes, sem tempo correndo | Jogar com calma e conforto |
| Tio do grupo da família | Entender as regras numa tela | Jogar já na primeira vez |
| Professora de matemática | Abrir o caso do dia no projetor sem criar conta | Usar em sala de aula |
| Ex-apostador | Um jogo sem dinheiro, sem prêmio e sem sorteio | Ocupar o tempo sem recair |
| Pessoa cega | Ouvir a grade, as pistas e o resultado pelo leitor de tela | Jogar como qualquer pessoa |
| Desenvolvedor | Gerar um ano de casos com um comando, uma única vez | Não ter trabalho diário nem semanal |
| Desenvolvedor | Saber que todo caso publicado tem solução única | Não publicar caso quebrado |
| Desenvolvedor | Criar um cenário novo editando um arquivo | Variar o jogo sem mexer no código |

## Requisitos do projeto

### Requisitos funcionais

|ID    | Descrição | Prioridade |
|------|-----------|------------|
|RF-001| Exibir três casos por dia (fácil, médio e difícil), trocando à meia-noite no horário de Brasília | ALTA |
|RF-002| Exibir a grade de 4 colunas por 5 linhas com nome e profissão de cada personagem | ALTA |
|RF-003| Começar o caso com um personagem revelado e a pista dele | ALTA |
|RF-004| Permitir marcar um personagem como culpado ou inocente | ALTA |
|RF-005| Recusar a marcação que ainda não pode ser deduzida, com o aviso "ainda não dá para ter certeza" | ALTA |
|RF-006| Ao acerto, revelar a pista do personagem marcado | ALTA |
|RF-007| Ao erro em marcação dedutível, registrar o erro e manter o personagem sem revelar | ALTA |
|RF-008| Oferecer dica em dois níveis: primeiro a pista a olhar, depois o personagem que já pode ser resolvido | ALTA |
|RF-009| Ao terminar, gerar um resultado em texto com emojis, número do caso, dificuldade e link, sem revelar a solução | ALTA |
|RF-010| Guardar no navegador o progresso do caso em andamento, para continuar depois | ALTA |
|RF-011| Guardar no navegador a sequência de dias e as estatísticas por dificuldade | MÉDIA |
|RF-012| Exibir as regras numa única tela, acessível a qualquer momento | ALTA |
|RF-013| Gerar com um único comando todos os casos de um ciclo (padrão: 365 dias, três casos por dia) | ALTA |
|RF-014| Recusar, na geração, casos sem solução única ou que exijam chute | ALTA |
|RF-015| Classificar cada caso gerado como fácil, médio ou difícil por critério objetivo | ALTA |
|RF-016| Repetir o ciclo de casos automaticamente quando ele terminar, sem gerar nada novo | ALTA |
|RF-017| Permitir arquivo de casos antigos | BAIXA |

### Requisitos não funcionais

|ID     | Descrição | Prioridade |
|-------|-----------|------------|
|RNF-001| Funcionar sem servidor próprio: site estático | ALTA |
|RNF-002| Não exigir cadastro nem coletar dado pessoal | ALTA |
|RNF-003| A verificação de cada jogada deve responder em menos de 100 ms num Android de entrada | ALTA |
|RNF-004| Página inicial abaixo de 300 KB transferidos | ALTA |
|RNF-005| Jogável com uma mão no celular, com alvos de toque de pelo menos 44 px | ALTA |
|RNF-006| Culpado e inocente distinguíveis sem depender de cor (símbolo além da cor) | ALTA |
|RNF-007| Jogável por teclado e com leitor de tela | MÉDIA |
|RNF-008| Contraste de texto de pelo menos 4,5:1 | ALTA |
|RNF-009| Respeitar "reduzir movimento" | MÉDIA |
|RNF-010| A solução não deve estar legível em texto puro no código do site | MÉDIA |
|RNF-011| Nenhuma mecânica de aposta: sem dinheiro, sem recompensa aleatória paga, sem dica paga | ALTA |
|RNF-012| Textos, nomes e arte originais; nada copiado do jogo de inspiração | ALTA |

## Fora do escopo da primeira versão

- Login, conta e sincronização entre aparelhos.
- Ranking global.
- Aplicativo de loja (Android ou iOS).
- Modo infinito ou casos extras pagos.
- Editor de casos pela interface.
