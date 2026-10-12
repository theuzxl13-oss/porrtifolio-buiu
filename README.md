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

## Painel de administração (recomendado)
O site tem um painel em **`/admin`**: https://theuzxl13-oss.github.io/porrtifolio-buiu/admin/

Pelo painel você muda **tudo**: textos do topo, quem somos, serviços, galeria (com envio de fotos e antes e depois), lojas (endereço, horários, WhatsApp, avaliações), marcas, depoimentos, perguntas frequentes, contato e logo. As fotos são reduzidas automaticamente antes do envio.

**Primeiro acesso (uma vez só): criar a chave de acesso do GitHub**
1. No GitHub, clique na sua foto → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Dê um nome (ex.: “Painel do site”) e escolha a validade (ex.: 1 ano).
3. Em **Repository access**, marque **Only select repositories** e escolha `porrtifolio-buiu`.
4. Em **Permissions → Repository permissions → Contents**, escolha **Read and write**.
5. Clique em **Generate token**, copie a chave, abra o painel → **Configurações**, cole e clique em **Salvar e testar conexão**.

**Uso do dia a dia:** altere os campos → **Prévia** (opcional) → **Salvar e publicar**. Em cerca de 1 minuto o site atualiza.

- A chave fica guardada só no navegador onde você colou. Não compartilhe; se vazar, apague-a no GitHub e gere outra.
- O painel grava na branch configurada em **Configurações**, que é a mesma publicada no GitHub Pages. Se um dia o site passar a ser publicado da `main`, troque lá.
- O painel não aparece no Google (está marcado para não ser indexado).

## 2. Como editar o conteúdo

Sem o painel, edite **somente** o `js/conteudo.js`. Ele tem comentários explicando cada bloco: empresa, logo, WhatsApp,
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

### Lojas: endereço, horários e mapa
Em `lojas`, cada loja tem `endereco`, `bairro`, `cidade`, `uf` e `enderecoMapa` (o endereço completo que vai para o mapa e para o botão “Como chegar”).
- **Horários:** ficam numa lista, uma linha por tipo de dia. `dias` vai de 0 = domingo a 6 = sábado; `abre`/`fecha` usam o formato `"08:30"`.
- **Status:** o site calcula sozinho, no horário de São Paulo, se a loja está “Aberta até 18h” ou “Fechada · abre às…”.
- **Linhas só informativas** (feriados, entregas): use `texto`. `destaque: true` deixa o horário em laranja.

### Raio do topo em imagem
Salve a imagem (de preferência `.webp`, com até ~300 KB) em `assets/img/` e preencha `hero.imagemRaio`, por exemplo `"assets/img/raio.webp"`. O fundo escuro da imagem se funde ao fundo do site. Com o campo vazio, o site usa o raio desenhado em código.

### Depois de qualquer alteração: atualize a versão
No `index.html`, aumente o número em `?v=1.11.0` (ex.: para `?v=1.11.1`) **em todas as linhas**
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

## Vídeo "Conheça a Cardoso"
A seção logo abaixo do topo mostra `assets/video/cardoso-site.mp4` (40s, 1280×720, cerca de 5 MB) com a capa
`assets/video/cardoso-site-capa.jpg`. O vídeo toca sem som quando aparece na tela, pausa quando sai, e o botão
"Ativar som" recomeça do início com som.

**Para trocar o vídeo:** substitua os dois arquivos mantendo os mesmos nomes e aumente o `?v=` no `index.html`.
Prefira MP4 (H.264) leve, de até uns 6 MB, para o site continuar rápido no celular.

**Para refazer o vídeo:** o código das animações fica em `video/cardoso/` (`modelo-site.html` é o vídeo do site e
`modelo.html` é o vídeo em pé de 25s para as redes sociais). Depois de editar, rode `python3 montar.py` e abra
`cardoso-site-video.html` no Google Chrome do computador. O botão "Baixar MP4" grava o vídeo com som.

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
- CEP das 3 lojas;
- telefone fixo da unidade Cipó (hoje ela usa o WhatsApp central);
- área atendida, CNPJ, Instagram/Facebook, e-mail e ano de fundação (opcionais);
- link da loja virtual;
- (opcional) link exato de cada loja no Google Maps (`linkMaps`). Sem ele, “Como chegar” faz uma busca pelo nome.
