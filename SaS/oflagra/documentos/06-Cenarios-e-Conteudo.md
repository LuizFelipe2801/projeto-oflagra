# Cenários e conteúdo

> Proposta, a revisar.

## O que é um cenário

Um cenário é a "pele" do caso: muda o que se lê, nunca a lógica. A grade, os tipos de pista e as regras são sempre os mesmos.

Cada cenário é um arquivo em `cenarios/`:

```json
{
  "id": "firma",
  "nome": "A firma",
  "travessuras": [
    "Quem comeu o bolo do chefe?",
    "Quem deixou a impressora sem papel?",
    "Quem esqueceu a marmita na geladeira?"
  ],
  "profissoes": ["copeira", "estagiário", "contador", "RH", "TI", "vendedora", "gerente", "recepcionista"],
  "nomes": ["Cida", "Zé", "Bia", "Caio", "Lu", "Rosa", "Tião", "Duda"],
  "culpado": "culpado",
  "inocente": "inocente"
}
```

O gerador sorteia 20 nomes sem repetir e distribui as profissões de forma que cada uma apareça de 2 a 4 vezes, para que as pistas de profissão funcionem.

## Primeiros cenários

| Cenário | Exemplo de travessura | Profissões |
|---|---|---|
| A firma | Quem comeu o bolo do chefe? | copeira, estagiário, contador, RH, TI, vendedora |
| O condomínio | Quem deixou o portão da garagem aberto? | síndico, porteiro, faxineira, motoboy, aposentada, estudante |
| A escola | Quem colou chiclete na cadeira da professora? | professora, merendeira, inspetor, diretora, aluno |
| A feira | Quem trocou as placas de preço? | feirante, verdureiro, pasteleiro, peixeiro, cliente |
| O churrasco | Quem queimou a picanha? | tio, cunhada, primo, vizinho, sogra |
| A pelada | Quem sumiu com a bola? | goleiro, zagueiro, juiz, torcedor, roupeiro |
| O salão | Quem trocou a cor da tinta? | cabeleireira, manicure, recepcionista, cliente |

Meta para o lançamento: **12 cenários**, o bastante para não repetir na mesma semana em nenhuma das três dificuldades.

## Guia de texto

- **Leve e sem crueldade.** Travessuras de dia a dia, nada de crime, violência, doença ou humilhação.
- **Sem estereótipo.** Profissão e nome nunca indicam culpa, e nenhum texto associa culpa a origem, gênero, idade ou classe social.
- **Nomes fictícios e comuns.** Nunca nomes de pessoas públicas ou reais conhecidas.
- **Sem marcas.** Nada de nomes de empresas, times ou produtos.
- **Pistas curtas.** Uma frase, em primeira pessoa quando é o personagem falando: "Tenho 2 culpados entre os vizinhos."
- **Linguagem do dia a dia.** "Ao lado" em vez de "adjacente", "ao redor" em vez de "na vizinhança".

## Arte

Primeira versão sem ilustração de personagem: só nome, profissão e um ícone simples por profissão. Ilustrações próprias podem entrar depois, se o jogo pegar. Nenhuma imagem do jogo de inspiração é usada.
