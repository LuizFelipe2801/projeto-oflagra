# Histórico de versões

## [0.4.0] - 2026-10-27

### Adicionado
- Site jogável em `site/`: escolha da dificuldade, grade de 20 personagens, marcação sem chute, dicas em dois níveis, progresso e sequência no navegador, resultado para o WhatsApp, regras e estatísticas.
- Ciclo completo de 365 dias gerado e validado em `site/casos/` (1.095 casos).
- Nove cenários novos: feira, churrasco, pelada, salão, república, grupo da família, festa junina, academia e ônibus (12 no total).
- `nucleo/deducao.js`: o passo de dedução sai do gerador para o núcleo, porque a dica do site precisa dele.
- Comandos `npm run sincronizar` e `npm run site`; workflows de testes e de publicação no GitHub Pages.
- Plano 2 em `documentos/planos/`.

### Alterado
- Profissões dos cenários em forma neutra ("da copa", "do RH") e campo `cenario_nome` no arquivo de caso.

## [0.3.0] - 2026-10-05

### Adicionado
- Núcleo do jogo: grade, nove tipos de pista, verificador lógico e formato do caso.
- Gerador de casos por dificuldade, com construção guiada e jogador perfeito que garante solução única sem chute.
- Comandos `npm run gerar` e `npm run validar`.
- Três cenários iniciais: firma, condomínio e escola.

## [0.2.0] - 2026-10-05

### Alterado
- Especificação aprovada: todas as propostas passam a ser decisões.
- Público ampliado para qualquer idade e perfil.
- Perfis de jogador de 3 para 9 e histórias de usuário de 10 para 19.
- Cenários de 7 para 20, com meta de 12 completos no lançamento.

## [0.1.3] - 2026-10-05

### Alterado
- Publicação dos casos decidida: geração em lote de um ciclo de 365 dias, que recomeça sozinho. Sem tarefa diária nem semanal.
- Arquivos de caso nomeados pelo dia do ciclo, não pela data.

## [0.1.2] - 2026-10-05

### Alterado
- O repositório passa a conter só o Flagra, com a documentação na raiz.
- README com exemplo de resultado, estrutura do repositório, decisões e próximos passos.

### Removido
- Documentação da empresa de sites. Continua no histórico, na tag `arquivo-empresa`.

## [0.1.1] - 2026-10-05

### Alterado
- Nome definido: Flagra, no endereço oflagra.com.br.

## [0.1.0] - 2026-10-05

### Adicionado
- Documentação inicial: contexto, especificação, metodologia, regras do jogo, arquitetura, cenários, plano e registro de testes, referências.
