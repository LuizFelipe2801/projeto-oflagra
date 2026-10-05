# Padrão técnico

Decisões que valem para todo site entregue. Cada uma veio de um problema real.

## Arquitetura padrão

Site estático, sem etapa de build: HTML, CSS e JavaScript puro, com o catálogo em JSON.

```
site/
  index.html            home, com destaques
  catalogo.html         catálogo completo
  css/style.css         base e paleta em variáveis CSS
  css/efeitos.css       animações, todas desligáveis
  js/base.js            comum: card, preço, link de WhatsApp, carregar dados
  js/app.js             home
  js/catalogo.js        filtros, busca, carregar mais
  js/efeitos.js         JS mínimo dos efeitos
  dados/produtos.json   fonte de verdade: o cliente edita aqui
  dados/produtos.js     cópia gerada, faz o site abrir por duplo clique
```

### Por que sem React e sem build

| Motivo | Consequência |
|---|---|
| O cliente final usa Android de entrada no 4G | Menos JavaScript significa site que abre antes de a pessoa desistir |
| O dono edita um JSON e o catálogo muda | Com build, toda troca de preço exigiria deploy |
| Dez sites em HTML puro funcionam por anos | Dez projetos com dependências precisam de manutenção que ninguém paga |

**Regra de decisão:** o projeto precisa de estado compartilhado entre telas, login ou dados que mudam sozinhos? Se não, HTML puro. Painel administrativo, loja com carrinho e dashboard justificam framework.

Bibliotecas de componentes animados (reactbits.dev, 21st.dev) servem como **catálogo de ideias**: veja o efeito e reimplemente em CSS e `IntersectionObserver`.

## Regras de implementação

**Imagem antes de animação.** Fotos no dobro do tamanho em que são exibidas, nunca mais que isso, em WebP com JPEG de reserva. Os originais em alta ficam fora da pasta `site/`. No primeiro projeto, a página caiu de 2,9 MB para 1,02 MB só com isso, enquanto todos os efeitos visuais somavam 29 KB.

**`[hidden]` sempre forçado.** Classe com `display` vence o atributo `hidden` do navegador:

```css
[hidden] { display: none !important; }
```

**Busca ignora acento.** Use `normalize('NFD').replace(/[̀-ͯ]/g, '')`, sempre com o escape `\uXXXX`, nunca com o caractere literal.

**Efeito de ponteiro só onde há ponteiro.** Envolva em `@media (hover: hover) and (pointer: fine)`.

**Animar posição, não opacidade.** Elemento que começa com `opacity: 0` some para quem liga "reduzir movimento".

**Alvos de toque nascem com 44 px.** Logo, links do menu e chips de filtro já começam com `min-height: 44px`.

**Prévia no WhatsApp precisa de URL absoluta.** `og:image` com caminho relativo não mostra a prévia. Até haver domínio, deixe um comentário `PUBLICAR:` no `<head>` marcando o que trocar.

**Nome de arquivo aparece no Google Imagens.** Foto de produto com personagem licenciado não pode levar o nome do personagem.

**Preloader curto e só na primeira visita.** No máximo cerca de 1 segundo, uma vez por sessão.

## Geração de material por script

| Script | Função |
|---|---|
| `capturar.mjs` | Prints da página inteira via Chrome DevTools Protocol; mede rolagem horizontal |
| `gerar-pdf.mjs` | Gera o PDF da proposta a partir de HTML |
| `gerar_video.py` | Vídeo 1080×1920 deslizando os prints numa moldura de celular |

Capture sempre no formato que o cliente final usa: prints com 412 px de largura, não em tela larga. Para o vídeo, deslize prints em vez de gravar a tela: sai estável, sem cursor nem notificação, e pode ser refeito quando o catálogo mudar.

## Armadilhas do ambiente (Windows)

- Caminho do Windows dentro de string Python vira escape (`\U`). Use barras normais ou string `r''`.
- O Python nativo não entende o `/tmp` do Git Bash. Converta com `cygpath -m`.
- Arquivos com CRLF quebram busca multilinha. Normalize para `\n` antes de comparar.
- `R` é um alias do PowerShell (`Invoke-History`). Não dê esse nome a uma função auxiliar.

## Publicidade em áreas reguladas

Antes de escrever texto para saúde ou alimentação, confira as regras vigentes do conselho:

- **Odontologia e medicina (CFO e CFM):** em geral é vedado antes-e-depois, promessa de resultado, preço e promoção. O nome do responsável técnico e o registro no conselho são obrigatórios.
- **Psicologia (CFP):** sem promessa de cura e sem caso clínico identificável.
- **Alimentação (Anvisa):** alegações como "detox" ou "fortalece a imunidade" exigem base.

Se o texto promete resultado, mostra preço ou compara com concorrente, pare e confira antes de publicar. Registre por escrito que o cliente aprovou os textos.
