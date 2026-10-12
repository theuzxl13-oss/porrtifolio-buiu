# Cardoso Baterias — site portfólio

Site institucional/vitrine da Cardoso Baterias, separado da loja virtual. Ele apresenta a empresa,
mostra trabalhos realizados e leva o visitante ao WhatsApp ou a uma das lojas físicas.

É um site estático, feito só com HTML, CSS e JavaScript. Não tem servidor, banco de dados nem etapa de build.

```
index.html                       página (estrutura e SEO)
css/estilo.css                   visual
js/conteudo.js                   ← TODO O CONTEÚDO EDITÁVEL
js/app.js                        monta o site a partir do conteúdo
assets/img/                      logos, ícone, imagem de compartilhamento
assets/fotos/                    fotos dos trabalhos (você coloca aqui)
assets/marcas/                   imagens de marcas AUTORIZADAS (opcional)
ferramentas/logo-fundo-escuro.html   gera a logo para fundo escuro
```

## 1. Como publicar no GitHub Pages

1. Envie estes arquivos para o repositório no GitHub, na branch que você vai publicar (ex.: `main`).
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
4. Em **Branch**, selecione a branch (ex.: `main`) e a pasta **`/ (root)`**. Clique em **Save**.
5. Depois de 1 ou 2 minutos, o site fica disponível em
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Todos os caminhos são relativos, então o site funciona nesse subcaminho sem ajustes. O arquivo `.nojekyll`
faz o GitHub publicar os arquivos como estão.

**Se o endereço final for diferente** de `https://theuzxl13-oss.github.io/porrtifolio-buiu/` (outro
usuário, outro repositório ou domínio próprio), troque esse endereço nas linhas `og:url` e `og:image`
do `index.html`. Elas controlam a prévia que aparece quando o link é compartilhado no WhatsApp ou no Facebook.

### Ver no seu computador antes de publicar
Você pode abrir o `index.html` direto no navegador. Para simular o GitHub Pages, rode na pasta acima
do projeto `python3 -m http.server 8000` e acesse `http://localhost:8000/porrtifolio-buiu/`.

## 2. Como editar o conteúdo

Edite **somente** o `js/conteudo.js`. Ele tem comentários explicando cada bloco: empresa, logo, WhatsApp,
topo, sobre, serviços, marcas, portfólio, lojas, depoimentos, perguntas frequentes e contato.

- Mantenha as aspas `"..."` e as vírgulas. Se o site ficar em branco depois de uma edição,
  provavelmente faltou uma vírgula ou uma aspa.
- **Dados “[a confirmar]”** não aparecem no site. No lugar deles, o site mostra uma alternativa, como
  “Consulte pelo WhatsApp”. Quando tiver o dado real, é só substituir o texto.
- **Modo revisão:** abra o site com `?revisao=1` no fim do endereço
  (ex.: `.../porrtifolio-buiu/?revisao=1`). Os campos pendentes aparecem em vermelho e um painel lista
  todos eles.
- **Notas do Google:** atualize `nota` e `avaliacoes` de cada loja e a data em `google.dataConsulta`.
  A média geral e o total de avaliações são calculados automaticamente.
- **Loja virtual:** preencha `empresa.lojaVirtual` com o link. Com o campo vazio, o botão fica escondido.
- **Mensagens do WhatsApp:** cada serviço tem a sua `mensagem`. O site codifica o texto para URL sozinho.
- **Título e descrição no Google:** ficam no começo do `index.html`, nas tags `<title>` e
  `<meta name="description">`, porque o Google e o WhatsApp leem essas tags sem executar JavaScript.

### Depois de qualquer alteração: atualize a versão
No `index.html`, aumente o número em `?v=1.7.0` (ex.: para `?v=1.7.1`) **em todas as linhas**
(`estilo.css`, `conteudo.js`, `app.js` e ícones). Assim, quem já visitou o site não continua vendo a
versão antiga guardada em cache.

## 3. Como trocar as fotos

1. Coloque a foto em `assets/fotos/`. Use nomes simples, sem espaços nem acentos
   (ex.: `instalacao-01.jpg`). Antes de enviar, reduza a foto para cerca de 1600 px de largura
   (até ~300 KB).
2. No `js/conteudo.js`, em `portfolio.itens`, preencha:
   - foto simples: `foto: "assets/fotos/instalacao-01.jpg"` e uma descrição em `alt`;
   - antes e depois: `antes: "assets/fotos/troca-antes.jpg"` e `depois: "assets/fotos/troca-depois.jpg"`.
3. Para adicionar trabalhos, copie uma linha `{ ... },` e altere os dados. As categorias são
   `instalacoes`, `testes`, `loja` e `frota`.
4. Enquanto um campo estiver vazio (`""`), aparece o marcador **“Foto ilustrativa — substituir”**.

Foto de fundo do topo (opcional): `hero.imagem: "assets/fotos/hero.jpg"`.

> Use apenas fotos próprias ou autorizadas. Não use fotos do Google Maps nem de terceiros.

### Logo
A logo oficial está em `assets/img/logo.png` (fundo transparente) e `assets/img/logo-fundo-escuro.png`
(letras brancas, para o cabeçalho e o rodapé). As duas foram geradas a partir de `assets/img/logo-original.png`.
A imagem enviada é pequena (140×59 px). Se tiver o arquivo em resolução maior (ideal: 600 px de largura ou mais):
1. Abra `ferramentas/logo-fundo-escuro.html` no navegador, escolha o PNG e baixe `logo-fundo-escuro.png`.
2. Substitua `assets/img/logo.png` (original) e `assets/img/logo-fundo-escuro.png` pelos arquivos novos.
3. Aumente o `?v=` no `index.html`.

### Marcas (Moura, Heliar, Bosch, Zetta, Pioneiro)
As marcas aparecem em cartões só com o nome, sem logotipos. Se um fabricante autorizar o uso da logo, salve
a imagem em `assets/marcas/`, preencha `imagem` e mude `imagemAutorizada` para `true`.

## Visual
Segue a referência de estilo do n8n:
- **Fundo e superfícies:** fundo violeta quase preto (#0e0918), cartões #1a1624 e painéis #1b1728, com um degrau de cor entre eles e sem sombras externas.
- **Fonte:** DM Sans, a substituta da geomanist. Títulos em peso 300, com altura de linha 0,88; textos em #d1cece.
- **Degradês:** o laranja→vermelho (“Ember”) aparece só nos botões principais; o azul→violeta (“Electric Current”) sublinha os links e marca o foco do teclado.
- **Cartões de destaque:** contorno interno branco a 10% com um fio laranja.
- **Brilhos de fundo:** um brilho quente quase imperceptível nas seções e um brilho rosado no rodapé.
- **Imagem principal:** um raio laranja-vermelho com brilho no topo.

As cores ficam no começo de `css/estilo.css`.

## 4. O que já está pronto
- 10 seções: topo com nota no Google, sobre, serviços, marcas, portfólio com filtros, lightbox e
  antes/depois, lojas, depoimentos, perguntas frequentes, contato e rodapé.
- Botão flutuante do WhatsApp, que se esconde quando outro botão grande de WhatsApp ou o rodapé está
  na tela, para não ficar por cima.
- SEO: title, description, Open Graph com imagem 1200×630 e dados estruturados schema.org
  (`AutoPartsStore` por unidade) gerados apenas com dados confirmados.
  As notas do Google **não** entram nos dados estruturados, porque o Google não aceita avaliações
  publicadas pela própria empresa.
- Acessibilidade: link “Pular para o conteúdo”, navegação por teclado (menu, filtros, lightbox com
  Esc e setas, antes/depois com setas), textos alternativos e contraste alto.

## 5. O que falta enviar
**Fotos** (próprias ou autorizadas):
- instalações, testes de bateria/alternador, loja (fachada, estoque) e frota/utilitários;
- pares de **antes e depois**;
- (opcional) foto para o fundo do topo;
- a **logo em resolução maior** (a atual tem só 140×59 px).

**Dados “[a confirmar]”** em `js/conteudo.js`:
- endereço completo e CEP das 3 lojas (Cipó: só há o trecho “R. Benedito Jandiro Soares / R. Manoel dos Santos”);
- cidade e UF da unidade Cipó;
- telefone e WhatsApp da unidade Cipó;
- se o número (11) 96260-4092 do Jardim Ângela também é WhatsApp;
- horários completos de funcionamento das 3 lojas (hoje o site mostra só o que o Google exibia em 05/10/2026);
- área atendida, CNPJ, Instagram/Facebook, e-mail e ano de fundação (opcionais);
- link da loja virtual;
- (opcional) link exato de cada loja no Google Maps (`linkMaps`). Sem ele, “Como chegar” faz uma busca pelo nome.
