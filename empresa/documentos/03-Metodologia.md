# Metodologia

## Processo

```
Lead → contato → proposta → cliente → entrega → relatório de resultado
```

### Prospecção

1. Escolher um corredor comercial do território (ver [01-Contexto](01-Contexto.md#público-alvo)), não um bairro inteiro.
2. Buscar `<segmento> perto de <corredor>` no Google Maps e abrir a ficha de cada negócio. A lista do Maps não mostra o site com fiabilidade.
3. Pontuar cada lead de 0 a 10:

| Critério | Pontos |
|---|---|
| Não tem site, ou o site é quebrado ou não funciona no celular | +3 |
| Google Meu Negócio ativo com avaliações | +2 |
| Instagram ativo (postou nos últimos 30 dias) | +2 |
| Ticket médio que comporta o investimento | +1 |
| Dono atende pessoalmente | +1 |
| Concorrentes diretos já têm site bom | +1 |

4. Abordar só quem tem nota 7 ou mais. Meta por corredor: 20 leads pesquisados, 6 a 8 qualificados.

### Abordagem

- Levar diagnóstico pronto, nunca pedir reunião em branco.
- Duas mensagens: texto curto primeiro e, logo depois, um vídeo do esboço do site do próprio negócio.
- Sem PDF e sem preço no primeiro contato. O preço entra só depois de o cliente demonstrar interesse.
- Cadência de follow-up: D+3, D+10 e D+30. Depois disso, o lead é arquivado com o motivo registrado.

### Proposta

PDF no formato de demonstração, com print real do produto em toda página: capa com a promessa em uma frase, visão geral, uma página por entrega, uma página de diferencial verdadeiro, preço com comparação antes do número, o que está e o que não está incluído, e validade de 30 dias.

### Entrega

1. Briefing e coleta da linha de base (conversas por semana, vendas por mês, visualizações no Google).
2. Primeira versão.
3. Verificações do [Plano de qualidade](07-Plano-de-Qualidade.md).
4. Textos aprovados pelo cliente por escrito.
5. Publicação e Google Meu Negócio apontando para o site.

### Pós-entrega

| Marco | Ação |
|---|---|
| D+7 | Checagem e ajustes finos |
| D+30 | Primeiro relatório de métricas |
| D+90 | Relatório de resultado e conversa sobre manutenção ou expansão |

A indicação de novos clientes só é proposta depois do relatório de D+30, com o cliente satisfeito. O cliente **apresenta** o conhecido; nunca repassa lista de contatos.

## Status de lead

| Status | Significado |
|---|---|
| `novo` | Pesquisado, ainda não abordado |
| `contatado` | Recebeu a primeira mensagem |
| `reuniao` | Conversa marcada ou feita |
| `proposta` | Proposta enviada |
| `fechado` | Virou cliente |
| `perdido` | Recusou ou não se encaixa |
| `arquivado` | Parado, com motivo: `sem-resposta`, `nao-abordado` ou `perdido`. Pode ter data de reativação |

## Ferramentas

| Ferramenta | Uso | Por quê |
|---|---|---|
| Obsidian | Gestão de leads, propostas e clientes | Arquivos locais em Markdown. Dados de clientes ficam fora da nuvem e fora do Git. |
| Git e GitHub | Versionamento desta documentação e de cada site | Histórico de toda alteração e backup |
| Chrome headless | Prints, PDF de proposta e auditoria visual | Material gerado por script, refeito em segundos quando o site muda |
| Python e ffmpeg | Vídeo de apresentação | Vídeo montado a partir dos prints, sem gravação de tela |
| Gerenciador de senhas | Acessos de domínio e hospedagem | Senha nunca vai para nota, chat ou repositório |

## Organização dos repositórios

- **Este repositório:** documentação da empresa, modelos e materiais de divulgação.
- **Um repositório por cliente:** o código do site e a documentação técnica dele.
- **Fora do Git:** dados pessoais de clientes, preços negociados e acessos.
