# Cenários e conteúdo

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

## Banco de cenários

| Cenário | Exemplo de travessura | Profissões |
|---|---|---|
| A firma | Quem comeu o bolo do chefe? | copeira, estagiário, contador, RH, TI, vendedora |
| O condomínio | Quem deixou o portão da garagem aberto? | síndico, porteiro, faxineira, motoboy, aposentada, estudante |
| A escola | Quem colou chiclete na cadeira da professora? | professora, merendeira, inspetor, diretora, aluno |
| A feira | Quem trocou as placas de preço? | feirante, verdureiro, pasteleiro, peixeiro, cliente |
| O churrasco | Quem queimou a picanha? | tio, cunhada, primo, vizinho, sogra |
| A pelada | Quem sumiu com a bola? | goleiro, zagueiro, juiz, torcedor, roupeiro |
| O salão | Quem trocou a cor da tinta? | cabeleireira, manicure, recepcionista, cliente |
| A república | Quem deixou a louça na pia de novo? | caloura, veterano, intercambista, dona da casa, estudante |
| O grupo da família | Quem mandou o áudio de cinco minutos? | avó, tio, prima, sobrinho, cunhado |
| A festa junina | Quem comeu a pamonha da quermesse? | sanfoneiro, noiva da quadrilha, padre, quituteira, criança |
| A academia | Quem largou os pesos no chão? | personal, recepcionista, aluno, nutricionista, faxineiro |
| O ônibus | Quem esqueceu de dar o sinal? | motorista, cobradora, estudante, trabalhador, aposentado |
| A biblioteca | Quem dobrou a página do livro? | bibliotecária, leitor, estagiária, pesquisador, criança |
| O casamento | Quem pegou o buquê antes da hora? | madrinha, padrinho, garçom, fotógrafa, convidada |
| O acampamento | Quem deixou a barraca aberta para os mosquitos? | monitor, escoteira, cozinheiro, guia, campista |
| O bloco de carnaval | Quem perdeu a fantasia do amigo? | folião, porta-estandarte, ambulante, baterista, fiscal |
| A padaria | Quem comeu o último pão de queijo? | padeiro, caixa, confeiteira, entregador, freguês |
| O pet shop | Quem soltou o papagaio da gaiola? | tosadora, veterinário, atendente, banhista, tutor |
| A redação do jornal | Quem publicou a manchete com erro? | repórter, editora, fotógrafo, revisora, estagiário |
| A excursão da escola | Quem trocou o lanche dos colegas? | professor, motorista, guia, aluna, monitora |

São 20 cenários de partida. Meta para o lançamento: **12 escritos por completo** (nomes, profissões e pelo menos 3 travessuras cada), o bastante para não repetir na mesma semana em nenhuma dificuldade. Os demais entram aos poucos.

Todo cenário novo segue o guia de texto abaixo e é revisado uma vez, quando é criado.

## Guia de texto

- **Leve e sem crueldade.** Travessuras de dia a dia, nada de crime, violência, doença ou humilhação.
- **Sem estereótipo.** Profissão e nome nunca indicam culpa, e nenhum texto associa culpa a origem, gênero, idade ou classe social.
- **Nomes fictícios e comuns.** Nunca nomes de pessoas públicas ou reais conhecidas.
- **Sem marcas.** Nada de nomes de empresas, times ou produtos.
- **Pistas curtas.** Uma frase, em primeira pessoa quando é o personagem falando: "Tenho 2 culpados entre os vizinhos."
- **Linguagem do dia a dia.** "Ao lado" em vez de "adjacente", "ao redor" em vez de "na vizinhança".

## Arte

Primeira versão sem ilustração de personagem: só nome, profissão e um ícone simples por profissão. Ilustrações próprias podem entrar depois, se o jogo pegar. Nenhuma imagem do jogo de inspiração é usada.
