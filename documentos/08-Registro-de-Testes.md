# Registro de testes

Resultados da execução do [Plano de testes](07-Plano-de-Testes.md).

[Use a estrutura abaixo para cada execução]

---

### Execução: 2026-10-05 — versão 0.3.0

| Caso de teste | Resultado | Observação |
|---|---|---|
| CT-01 Geometria da grade | Passou | `testes/grade.test.js` |
| CT-02 Pistas verdadeiras | Parcial | Critério reduzido: 50 soluções em `testes/pistas-candidatas.test.js` e 21 casos no validador (o plano pede 1.000; protocolo completo no Plano 2) |
| CT-03 Solução única e sem chute | Parcial | Critério reduzido: 21 casos no validador e 180 na medição (o plano pede 1.000; protocolo completo no Plano 2) |
| CT-04 Classificação de dificuldade | Parcial | Critério reduzido: 21 casos no validador e o teste dos dias 1 a 6 (o plano pede 300 por nível; protocolo completo no Plano 2) |
| CT-05 Recusa de chute | Passou | `testes/verificador.test.js` |
| CT-06 Reprodutibilidade | Parcial | Um caso por nível (dia 0) comparado no mesmo processo, mais uma checagem do dia 4 difícil em dois processos com o mesmo hash; o ciclo completo gerado duas vezes fica para o Plano 2 |
| CT-07 Desempenho do verificador | Pendente | Medido no navegador, no Plano 2 |
| CT-08 a CT-11 | Pendente | Dependem do site (Plano 2) |

Medição do gerador com `npm run gerar -- --dias 7` (21 casos): tempo total 20,6 s; média 1,0 s por caso; maior 4,5 s. Tentativas: fácil 1 em todos os dias; médio de 1 a 4; difícil de 3 a 21.

Medição complementar (dias 0 a 59, 180 casos): nenhuma falha, média de 0,7 s por caso, maior 7,9 s, no máximo 31 tentativas. Estimativa para o ciclo de 365 dias: cerca de 13 minutos.

A especificação pede 1.000 casos nos CT-02 a CT-04; a contagem completa fica para o Plano 2, quando o ciclo inteiro for gerado e validado.

Observação de conteúdo: as profissões são sorteadas sem considerar o gênero do nome (por exemplo, "Theo (professora)"). A correção é nos cenários, no Plano 2.

---

### Execução: 2026-10-27 — versão 0.4.0

| Caso de teste | Resultado | Observação |
|---|---|---|
| CT-01 Geometria da grade | Passou | `testes/grade.test.js` |
| CT-02 Pistas verdadeiras | Passou | Ciclo completo: 1.095 casos conferidos pelo validador, nenhuma pista falsa |
| CT-03 Solução única e sem chute | Passou | Ciclo completo: 1.095 casos resolvidos pelo jogador perfeito |
| CT-04 Classificação de dificuldade | Passou | Ciclo completo: 365 casos por nível, todos na dificuldade declarada |
| CT-05 Recusa de chute | Passou | `testes/verificador.test.js` e `testes/partida.test.js` (recusa sem contar erro) |
| CT-06 Reprodutibilidade | Parcial | Um caso por nível comparado no mesmo processo (`testes/caso.test.js`); o ciclo gerado duas vezes fica para a publicação |
| CT-07 Desempenho do verificador | Passou no Node | Ver medição abaixo; a medição em Android de entrada fica para a publicação |
| CT-08 Partida completa no celular | Passou (automatizado) | Chrome headless em 390 px: caso fácil #1 jogado até o fim pela solução, 86 recusas, 0 erros, 0 erros de console |
| CT-09 Resultado compartilhado | Parcial | Texto gerado bate com o formato das regras (`testes/resultado.test.js`); colar no WhatsApp fica para a publicação |
| CT-10 Acessibilidade | Parcial | Grade com `role="grid"`, setas no teclado, estado anunciado por texto e símbolo, alvos de 48 px, modo escuro e `prefers-reduced-motion`; leitor de tela ainda não testado |
| CT-11 Teste com pessoas de fora | Pendente | Depende da publicação |

Medição do CT-07 (Node 24, 100 casos difíceis, no pior momento, que é o início, com 1 pista e 19 desconhecidos): verificação da jogada em até 36 ms; cálculo da dica em até 63 ms. Em aparelho 4× mais lento, a jogada fica perto de 150 ms: acima do limite de RNF-003. A alternativa prevista em [05-Arquitetura](05-Arquitetura.md#tratamento-de-erros) (manter a lista de soluções e filtrar a cada jogada) já é o que `partida.js` faz depois da primeira revelação; a medição real em Android de entrada decide se é preciso otimizar o início.

Geração do ciclo completo (`npm run gerar -- --dias 365 --saida site/casos`): 1.095 casos em 1.139 s (19 min), sem falha. Validação (`npm run validar -- --pasta site/casos`): 1.095 casos conferidos, nenhum problema.

[Inclua a saída dos testes automatizados e prints ou gravações dos testes manuais]
