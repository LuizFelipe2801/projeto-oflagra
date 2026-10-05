# Regras do jogo

## Objetivo

Descobrir quem é culpado e quem é inocente na travessura do dia, usando só lógica.

## A grade

- 20 personagens em 4 colunas (A, B, C e D) e 5 linhas (1 a 5).
- Cada personagem tem nome e profissão, que mudam com o cenário do dia.
- **Todo mundo fala a verdade.**
- Profissão não torna ninguém culpado ou inocente, a não ser que uma pista diga isso.

## Definições

| Termo | Significado |
|---|---|
| Vizinhos | Os até 8 personagens ao redor, **incluindo as diagonais** |
| Acima / abaixo | Na mesma coluna, em qualquer distância |
| À esquerda / à direita | Na mesma linha, em qualquer distância |
| Diretamente acima (abaixo, à esquerda, à direita) | O vizinho imediato naquela direção |
| Entre | Os personagens no meio de dois outros, na mesma linha ou coluna, sem contar os dois |
| Conectados | Uma corrente de personagens ligados por lado (sem diagonal), sem ninguém de outro tipo no meio |
| Borda | Os personagens da linha 1, da linha 5, da coluna A ou da coluna D |

## Como se joga

1. O caso começa com **um personagem revelado** e a pista dele.
2. Toque num personagem e marque **culpado** ou **inocente**.
3. **Sem chute:** se as pistas reveladas ainda não permitem ter certeza sobre aquele personagem, o jogo recusa a marcação e avisa "ainda não dá para ter certeza". Nada é contado.
4. **Acerto:** o personagem é revelado e mostra a pista dele.
5. **Erro:** se a marcação era dedutível e você errou, conta um erro. O personagem continua sem revelar, e você pode tentar de novo.
6. **Dica:** o primeiro pedido aponta uma pista que ajuda; o segundo aponta um personagem que já pode ser resolvido. As dicas aparecem no resultado.
7. O caso termina quando os 20 estão marcados.

## Tipos de pista

| Tipo | Exemplo |
|---|---|
| Contagem nos vizinhos | "A Dona Cida tem exatamente 2 culpados entre os vizinhos." |
| Linha ou coluna | "Há mais inocentes que culpados na linha 3." |
| Direção | "Todos acima do porteiro são inocentes." |
| Entre | "Há exatamente 1 culpado entre o Zé e a Bia." |
| Profissão | "Só um dos motoboys é culpado." |
| Comparação | "O Caio tem mais vizinhos culpados que a Lu." |
| Borda | "Nenhum culpado está na borda." |
| Conexão | "Todos os culpados da coluna B estão conectados." |
| Paridade | "Há um número ímpar de culpados na coluna D." |

Pistas falam de personagens pelo nome ou pela posição, nunca pela solução.

## Dificuldade

O jogador escolhe todo dia entre três casos:

| Dificuldade | Critério |
|---|---|
| Fácil | Toda dedução sai de **uma única pista** revelada |
| Médio | Algumas deduções exigem **combinar duas pistas** |
| Difícil | Algumas deduções exigem **combinar três ou mais pistas** |

O critério é medido pelo verificador durante a geração (ver [05-Arquitetura](05-Arquitetura.md#classificação-de-dificuldade)).

## Resultado

Ao terminar, o jogador pode copiar um texto como este:

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

| Símbolo | Significado |
|---|---|
| 🟩 | Acertou na primeira tentativa |
| 🟨 | Acertou depois de usar dica |
| 🟥 | Errou pelo menos uma vez |

A grade de emojis mostra o **desempenho em cada posição**, nunca quem era culpado.
