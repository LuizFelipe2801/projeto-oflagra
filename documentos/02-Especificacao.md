# Especificação

## Perfis de jogador

Perfis fictícios, usados para orientar decisões.

|Perfil | Jogadora de passatempo |
|:---|:---|
| Situação | Joga o Termo todo dia no ônibus, a caminho do trabalho. |
| Necessidades | Um desafio que termine em até 15 minutos, no celular, com uma mão só. |
| Frustração | Jogo que exige cadastro, que pede para baixar aplicativo ou que tem anúncio no meio da jogada. |

|Perfil | Tio do grupo da família |
|:---|:---|
| Situação | Recebe o resultado dos sobrinhos no WhatsApp e clica para ver o que é. |
| Necessidades | Entender as regras em um minuto, sem tutorial longo. |
| Frustração | Letra pequena, botão pequeno, regra que só faz sentido para quem já joga. |

|Perfil | Estudante de concurso |
|:---|:---|
| Situação | Treina raciocínio lógico e gosta de desafio. |
| Necessidades | O caso difícil, que exige combinar várias pistas. |
| Frustração | Enigma que só se resolve no chute. |

## Histórias de usuário

|EU COMO... | QUERO/PRECISO ... | PARA ... |
|---|---|---|
| Jogadora | Abrir o link e jogar sem cadastro | Começar em segundos |
| Jogadora | Escolher fácil, médio ou difícil | Jogar no nível do meu dia |
| Jogadora | Ser impedida de marcar quando ainda não dá para ter certeza | Nunca resolver no chute |
| Jogadora | Pedir uma dica quando travar | Não desistir do caso |
| Jogadora | Compartilhar o resultado sem estragar a solução | Comparar com os amigos |
| Jogadora | Ver minha sequência de dias | Ter motivo para voltar amanhã |
| Tio do grupo | Entender as regras numa tela | Jogar já na primeira vez |
| Estudante | Ter um caso difícil de verdade | Treinar dedução |
| Desenvolvedor | Gerar semanas de casos com um comando | Não depender de trabalho diário |
| Desenvolvedor | Saber que todo caso publicado tem solução única | Não publicar caso quebrado |

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
|RF-013| Gerar casos com um comando, para um intervalo de datas | ALTA |
|RF-014| Recusar, na geração, casos sem solução única ou que exijam chute | ALTA |
|RF-015| Classificar cada caso gerado como fácil, médio ou difícil por critério objetivo | ALTA |
|RF-016| Permitir arquivo de casos antigos | BAIXA |

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
