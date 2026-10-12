/* Painel de administração — Cardoso Baterias
   Lê js/conteudo.js, mostra formulários para cada seção e, ao salvar, grava as
   mudanças (e as fotos novas) direto no repositório pelo GitHub, usando uma chave
   de acesso pessoal que fica só no navegador de quem administra. */
(function () {
  "use strict";

  /* ------------------------------ utilidades ------------------------------ */
  const $ = (s, c) => (c || document).querySelector(s);
  const el = (tag, attrs, ...filhos) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    filhos.flat().forEach((f) => f != null && e.append(f.nodeType ? f : document.createTextNode(f)));
    return e;
  };
  let contadorId = 0;
  const novoId = () => "c" + (++contadorId);
  const ARQUIVO = "js/conteudo.js";
  const CHAVE_CONFIG = "cardoso-admin-config";
  const CHAVE_PREVIA = "cardoso-previa";
  const PADRAO = { owner: "theuzxl13-oss", repo: "porrtifolio-buiu", branch: "claude/dazzling-johnson-mig8ai", token: "", lembrar: true };

  function lerConfig() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE_CONFIG) || sessionStorage.getItem(CHAVE_CONFIG) || "{}");
      return Object.assign({}, PADRAO, salvo);
    } catch (e) { return Object.assign({}, PADRAO); }
  }
  function gravarConfig(c) {
    const json = JSON.stringify(c);
    try {
      localStorage.removeItem(CHAVE_CONFIG); sessionStorage.removeItem(CHAVE_CONFIG);
      (c.lembrar ? localStorage : sessionStorage).setItem(CHAVE_CONFIG, json);
    } catch (e) { /* armazenamento indisponível: vale só nesta aba */ }
  }

  const utf8ParaBase64 = (txt) => {
    const bytes = new TextEncoder().encode(txt);
    let bin = ""; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  const base64ParaUtf8 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0)));
  const slug = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "foto";

  function avaliarConteudo(texto) {
    const janela = {};
    // eslint-disable-next-line no-new-func
    new Function("window", texto)(janela);
    if (!janela.CONTEUDO || typeof janela.CONTEUDO !== "object") throw new Error("O arquivo não define window.CONTEUDO.");
    return janela.CONTEUDO;
  }
  function gerarArquivo(dados) {
    return "/* =====================================================================\n" +
      "   CARDOSO BATERIAS — CONTEÚDO DO SITE\n" +
      "   Gerado pelo painel /admin em " + new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) + ".\n" +
      "   Pode ser editado pelo painel (recomendado) ou à mão, mantendo aspas e vírgulas.\n" +
      "   Campos com \"[a confirmar]\" ou vazios não aparecem no site.\n" +
      "   O significado de cada campo está no README.md.\n" +
      "   ===================================================================== */\n\n" +
      "window.CONTEUDO = " + JSON.stringify(dados, null, 2) + ";\n";
  }

  /* ------------------------------ estado ------------------------------ */
  let config = lerConfig();
  let dados = null;            // conteúdo em edição
  let shaConteudo = null;      // versão do arquivo no GitHub
  const fotosPendentes = new Map(); // caminho -> { base64, dataUrl }
  let alterado = false;
  let secaoAtual = "inicio";

  function status(texto, tipo) {
    const s = $("#status");
    s.textContent = texto;
    s.className = "barra__status" + (tipo ? " " + tipo : "");
  }
  function aviso(texto, erro) {
    const a = $("#aviso");
    a.textContent = texto; a.hidden = false; a.className = "aviso-fixo" + (erro ? " erro" : "");
    clearTimeout(aviso.t); aviso.t = setTimeout(() => { a.hidden = true; }, erro ? 9000 : 5000);
  }
  function marcarAlterado() {
    alterado = true;
    status("Alterações não publicadas", "alterado");
    atualizarBotaoSalvar();
    try { localStorage.setItem(CHAVE_PREVIA, JSON.stringify(dados)); } catch (e) { /* prévia indisponível */ }
  }
  function atualizarBotaoSalvar() { $("#btn-salvar").disabled = !alterado; }
  window.addEventListener("beforeunload", (e) => { if (alterado) { e.preventDefault(); e.returnValue = ""; } });

  /* ------------------------------ GitHub ------------------------------ */
  async function api(caminho, opcoes) {
    const headers = { Accept: "application/vnd.github+json", Authorization: "Bearer " + config.token, "X-GitHub-Api-Version": "2022-11-28" };
    if (opcoes && opcoes.body) headers["Content-Type"] = "application/json";
    const r = await fetch("https://api.github.com/repos/" + config.owner + "/" + config.repo + caminho, Object.assign({}, opcoes || {}, { headers, cache: "no-store" }));
    if (!r.ok) {
      let msg = "";
      try { msg = (await r.json()).message || ""; } catch (e) { /* sem corpo */ }
      const erro = new Error(explicarErro(r.status, msg));
      erro.status = r.status;
      throw erro;
    }
    return r.json();
  }
  function explicarErro(cod, msg) {
    if (cod === 401) return "A chave de acesso é inválida ou expirou. Gere outra em Configurações.";
    if (cod === 403) return "A chave não tem permissão para gravar neste repositório (precisa de Contents: Read and write).";
    if (cod === 404) return "Repositório, branch ou arquivo não encontrado. Confira as Configurações.";
    if (cod === 409 || cod === 422) return "O arquivo mudou no GitHub enquanto você editava. Recarregue o painel e refaça a alteração.";
    return "Erro " + cod + (msg ? ": " + msg : "");
  }
  const lerArquivoApi = (caminho) => api("/contents/" + caminho.split("/").map(encodeURIComponent).join("/") + "?ref=" + encodeURIComponent(config.branch) + "&t=" + Date.now());
  const gravarArquivoApi = (caminho, base64, mensagem, sha) => api("/contents/" + caminho.split("/").map(encodeURIComponent).join("/"), {
    method: "PUT",
    body: JSON.stringify(Object.assign({ message: mensagem, content: base64, branch: config.branch }, sha ? { sha } : {}))
  });

  /* ------------------------------ carregar ------------------------------ */
  async function carregar() {
    status("Carregando conteúdo…");
    try {
      if (config.token) {
        const arq = await lerArquivoApi(ARQUIVO);
        dados = avaliarConteudo(base64ParaUtf8(arq.content));
        shaConteudo = arq.sha;
        status("Conectado ao GitHub · " + config.repo + " (" + config.branch + ")", "ok");
      } else {
        const r = await fetch("../" + ARQUIVO + "?t=" + Date.now(), { cache: "no-store" });
        if (!r.ok) throw new Error("Não foi possível ler " + ARQUIVO);
        dados = avaliarConteudo(await r.text());
        status("Só leitura: configure a chave de acesso para salvar", "alterado");
      }
    } catch (e) {
      status(e.message, "erro");
      if (!dados) {
        try {
          const r = await fetch("../" + ARQUIVO + "?t=" + Date.now(), { cache: "no-store" });
          dados = avaliarConteudo(await r.text());
        } catch (e2) { $("#editor").textContent = "Não foi possível carregar o conteúdo do site."; return; }
      }
      if (e.status) secaoAtual = "config";
    }
    montarMenu();
    mostrarSecao(secaoAtual);
  }

  /* ------------------------------ salvar ------------------------------ */
  async function salvar() {
    if (!config.token) { aviso("Configure a chave de acesso do GitHub antes de salvar.", true); mostrarSecao("config"); return; }
    const erroValidacao = validar();
    if (erroValidacao) { aviso(erroValidacao, true); return; }
    const btn = $("#btn-salvar");
    btn.disabled = true;
    try {
      let n = 0;
      for (const [caminho, foto] of fotosPendentes) {
        n++;
        status("Enviando foto " + n + " de " + fotosPendentes.size + "…");
        await gravarArquivoApi(caminho, foto.base64, "Painel: envia arquivo " + caminho.split("/").pop());
      }
      status("Publicando conteúdo…");
      const r = await gravarArquivoApi(ARQUIVO, utf8ParaBase64(gerarArquivo(dados)), "Painel: atualiza o conteúdo do site", shaConteudo);
      shaConteudo = r.content.sha;
      // força os visitantes a baixarem o conteúdo novo (versão na URL)
      try {
        const html = await lerArquivoApi("index.html");
        const texto = base64ParaUtf8(html.content);
        const versao = new Date().toISOString().replace(/\D/g, "").slice(0, 12);
        const novo = texto.replace(/js\/conteudo\.js\?v=[^"']*/, "js/conteudo.js?v=" + versao);
        if (novo !== texto) await gravarArquivoApi("index.html", utf8ParaBase64(novo), "Painel: atualiza a versão do conteúdo", html.sha);
      } catch (e) { /* não impede a publicação */ }
      fotosPendentes.clear();
      alterado = false;
      try { localStorage.removeItem(CHAVE_PREVIA); } catch (e) { /* ok */ }
      status("Publicado! O site atualiza em cerca de 1 minuto.", "ok");
      aviso("Publicado! O site atualiza em cerca de 1 minuto.");
      mostrarSecao(secaoAtual);
    } catch (e) {
      status(e.message, "erro");
      aviso(e.message, true);
      btn.disabled = false;
    }
    atualizarBotaoSalvar();
  }
  function validar() {
    const ids = (dados.lojas || []).map((l) => l.id);
    if (ids.some((id) => !id)) return "Toda loja precisa de um identificador (campo “Identificador”).";
    if (new Set(ids).size !== ids.length) return "Duas lojas estão com o mesmo identificador.";
    if (!/^\d{12,13}$/.test(String((dados.whatsapp || {}).numero || ""))) return "O WhatsApp principal deve ter só números, com 55 e DDD (ex.: 5511962986718).";
    return "";
  }

  /* ------------------------------ fotos ------------------------------ */
  async function prepararFoto(arquivo, pasta) {
    const bitmap = await createImageBitmap(arquivo);
    const max = 1600, escala = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    let tipo = "image/webp", ext = "webp";
    let dataUrl = canvas.toDataURL(tipo, 0.82);
    if (!dataUrl.startsWith("data:image/webp")) { tipo = "image/jpeg"; ext = "jpg"; dataUrl = canvas.toDataURL(tipo, 0.85); }
    const caminho = (pasta || "assets/fotos") + "/" + slug(arquivo.name) + "-" + Date.now().toString(36) + "." + ext;
    fotosPendentes.set(caminho, { base64: dataUrl.split(",")[1], dataUrl });
    return caminho;
  }
  function urlPrevia(caminho) {
    if (!caminho) return "";
    if (fotosPendentes.has(caminho)) return fotosPendentes.get(caminho).dataUrl;
    if (/^https?:/.test(caminho)) return caminho;
    return "../" + caminho;
  }

  /* ------------------------------ esquema dos formulários ------------------------------ */
  const ICONES = [["bateria", "Bateria"], ["ferramenta", "Ferramenta"], ["teste", "Medidor (teste)"], ["relogio", "Relógio"], ["loja", "Loja"], ["conversa", "Conversa"], ["entrega", "Caminhão (entrega)"], ["gerador", "Gerador"], ["camera", "Câmera"], ["pino", "Mapa"], ["telefone", "Telefone"], ["whats", "WhatsApp"]];
  const DICA_OCULTAR = "Deixe vazio ou com “[a confirmar]” para não aparecer no site.";

  const SECOES = [
    { id: "inicio", titulo: "Início", especial: "inicio" },
    {
      id: "empresa", titulo: "Empresa e contato", desc: "Dados gerais, WhatsApp principal e redes sociais.",
      grupos: [
        { raiz: "empresa", campos: [
          { k: "nome", rotulo: "Nome da empresa" },
          { k: "lojaVirtual", rotulo: "Link da loja virtual", tipo: "url", dica: "Deixe vazio para esconder o botão “Loja virtual”." },
          { k: "instagram", rotulo: "Instagram (link completo)", tipo: "url", dica: "Ex.: https://instagram.com/cardosobaterias. " + DICA_OCULTAR },
          { k: "facebook", rotulo: "Facebook (link completo)", tipo: "url", dica: DICA_OCULTAR },
          { k: "email", rotulo: "E-mail", dica: DICA_OCULTAR },
          { k: "cnpj", rotulo: "CNPJ", dica: DICA_OCULTAR },
          { k: "areaAtendida", rotulo: "Área atendida", tipo: "textarea", dica: DICA_OCULTAR }
        ] },
        { raiz: "whatsapp", titulo: "WhatsApp principal", campos: [
          { k: "numero", rotulo: "Número (só números, com 55 e DDD)", dica: "Ex.: 5511962986718" },
          { k: "exibicao", rotulo: "Número como aparece no site", dica: "Ex.: (11) 96298-6718" },
          { k: "mensagemPadrao", rotulo: "Mensagem pronta", tipo: "textarea" }
        ] },
        { raiz: "contato", titulo: "Seção “Fale com a gente”", campos: [
          { k: "titulo", rotulo: "Título" },
          { k: "texto", rotulo: "Texto", tipo: "textarea" }
        ] }
      ]
    },
    {
      id: "topo", titulo: "Topo do site", desc: "A primeira parte que o visitante vê.",
      grupos: [
        { raiz: "hero", campos: [
          { k: "selo", rotulo: "Etiqueta acima do título" },
          { k: "titulo", rotulo: "Título — primeira linha" },
          { k: "tituloDestaque", rotulo: "Título — segunda linha" },
          { k: "texto", rotulo: "Texto abaixo do título", tipo: "textarea" },
          { k: "botao", rotulo: "Texto do botão principal" },
          { k: "imagemRaio", rotulo: "Imagem do raio (computador)", tipo: "imagem", pasta: "assets/img" },
          { k: "imagemRaioCelular", rotulo: "Imagem do raio (celular, menor)", tipo: "imagem", pasta: "assets/img", dica: "Opcional. Se vazio, usa a mesma imagem do computador." }
        ] },
        { raiz: "logo", titulo: "Logo", campos: [
          { k: "fundoEscuro", rotulo: "Logo para fundo escuro (letras brancas)", tipo: "imagem", pasta: "assets/img" },
          { k: "fundoClaro", rotulo: "Logo para fundo claro (letras pretas)", tipo: "imagem", pasta: "assets/img" },
          { k: "alt", rotulo: "Texto alternativo da logo" }
        ] }
      ]
    },
    {
      id: "sobre", titulo: "Quem somos",
      grupos: [{ raiz: "sobre", campos: [
        { k: "titulo", rotulo: "Título" },
        { k: "paragrafos", rotulo: "Parágrafos", tipo: "textos", novo: "" },
        { k: "diferenciais", rotulo: "Diferenciais", tipo: "lista", nomeItem: (d) => d.titulo || "Novo diferencial", novo: () => ({ icone: "bateria", titulo: "", texto: "" }), campos: [
          { k: "icone", rotulo: "Ícone", tipo: "select", opcoes: ICONES },
          { k: "titulo", rotulo: "Título" },
          { k: "texto", rotulo: "Texto", tipo: "textarea" }
        ] }
      ] },
      { raiz: "sobre.video", titulo: "Vídeo de destaque (opcional)", campos: [
        { k: "titulo", rotulo: "Título sobre o vídeo", dica: "Ex.: Conheça a Cardoso Baterias" },
        { k: "video", rotulo: "Arquivo de vídeo (MP4, até 25 MB)", tipo: "video" },
        { k: "youtube", rotulo: "Ou link do YouTube", tipo: "url" },
        { k: "instagram", rotulo: "Ou link do Reel do Instagram", tipo: "url" },
        { k: "capa", rotulo: "Imagem de capa (opcional)", tipo: "imagem" },
        { k: "vertical", rotulo: "Vídeo em pé (gravado na vertical)", tipo: "check" }
      ] }]
    },
    {
      id: "servicos", titulo: "Serviços", desc: "Cada serviço tem um botão “Agendar pelo WhatsApp” com a mensagem pronta abaixo.",
      grupos: [{ campos: [
        { k: "servicos", rotulo: "Serviços", tipo: "lista", nomeItem: (s) => s.titulo || "Novo serviço", novo: () => ({ icone: "bateria", titulo: "", texto: "", mensagem: "Olá! Vim pelo site da Cardoso Baterias e gostaria de um orçamento. Meu veículo é [marca/modelo/ano]." }), campos: [
          { k: "icone", rotulo: "Ícone", tipo: "select", opcoes: ICONES },
          { k: "titulo", rotulo: "Título" },
          { k: "texto", rotulo: "Descrição", tipo: "textarea" },
          { k: "mensagem", rotulo: "Mensagem pronta do WhatsApp", tipo: "textarea" }
        ] }
      ] }]
    },
    {
      id: "galeria", titulo: "Galeria de trabalhos", desc: "Envie fotos próprias ou autorizadas. As fotos são reduzidas automaticamente antes de enviar. Itens sem foto mostram “Foto ilustrativa — substituir”.",
      grupos: [{ raiz: "portfolio", campos: [
        { k: "titulo", rotulo: "Título da seção" },
        { k: "texto", rotulo: "Texto da seção", tipo: "textarea" },
        { k: "itens", rotulo: "Trabalhos", tipo: "lista", nomeItem: (i) => (i.titulo || "Novo trabalho") + ((i.tipo === "antesDepois") ? " · antes e depois" : ""), novo: () => ({ categoria: ((dados.portfolio.categorias || [])[0] || {}).id || "", titulo: "", descricao: "", foto: "", alt: "" }), campos: [
          { k: "titulo", rotulo: "Título" },
          { k: "categoria", rotulo: "Categoria", tipo: "select", opcoes: () => (dados.portfolio.categorias || []).map((c) => [c.id, c.nome]) },
          { k: "descricao", rotulo: "Descrição", tipo: "textarea" },
          { k: "tipo", rotulo: "Tipo", tipo: "select", opcoes: [["", "Foto simples"], ["antesDepois", "Antes e depois"], ["video", "Vídeo"]], refaz: true },
          { k: "foto", rotulo: "Foto", tipo: "imagem", mostrarSe: (i) => !i.tipo },
          { k: "video", rotulo: "Arquivo de vídeo (MP4, até 25 MB)", tipo: "video", mostrarSe: (i) => i.tipo === "video", dica: "Vídeos curtos (15–30 s) funcionam melhor. Para vídeos maiores, use o YouTube." },
          { k: "youtube", rotulo: "Ou link do YouTube", tipo: "url", mostrarSe: (i) => i.tipo === "video", dica: "Ex.: https://youtu.be/... ou https://youtube.com/shorts/..." },
          { k: "instagram", rotulo: "Ou link do Reel do Instagram", tipo: "url", mostrarSe: (i) => i.tipo === "video", dica: "Ex.: https://www.instagram.com/reel/..." },
          { k: "capa", rotulo: "Imagem de capa (opcional)", tipo: "imagem", mostrarSe: (i) => i.tipo === "video", dica: "Aparece antes do play. Sem capa, o site usa um quadro do vídeo ou a capa do YouTube." },
          { k: "vertical", rotulo: "Vídeo em pé (gravado na vertical)", tipo: "check", mostrarSe: (i) => i.tipo === "video" },
          { k: "antes", rotulo: "Foto de ANTES", tipo: "imagem", mostrarSe: (i) => i.tipo === "antesDepois" },
          { k: "depois", rotulo: "Foto de DEPOIS", tipo: "imagem", mostrarSe: (i) => i.tipo === "antesDepois" },
          { k: "alt", rotulo: "Descrição da foto para acessibilidade", dica: "O que aparece na foto. Ex.: “Bateria Moura instalada em um Onix”." }
        ] },
        { k: "categorias", rotulo: "Categorias dos filtros", tipo: "lista", nomeItem: (c) => c.nome || "Nova categoria", novo: () => ({ id: "", nome: "" }), campos: [
          { k: "nome", rotulo: "Nome do filtro" },
          { k: "id", rotulo: "Identificador", dica: "Sem espaços nem acentos. Ex.: instalacoes" }
        ] }
      ] }]
    },
    {
      id: "lojas", titulo: "Lojas", desc: "Endereço, horários, WhatsApp e avaliações de cada unidade. O status “Aberta/Fechada” é calculado pelos horários.",
      grupos: [
        { raiz: "lojasSecao", titulo: "Cabeçalho da seção", campos: [
          { k: "titulo", rotulo: "Título" },
          { k: "texto", rotulo: "Texto", tipo: "textarea" }
        ] },
        { titulo: "Unidades", campos: [
          { k: "lojas", rotulo: "Lojas", tipo: "lista", nomeItem: (l) => l.nome || "Nova loja", novo: () => ({ id: "", nome: "Cardoso Baterias ", apelido: "", endereco: "", bairro: "", cidade: "", uf: "SP", cep: "", telefone: "", whatsapp: "", whatsappExibicao: "", whatsappObs: "", horarios: [], nota: 5, avaliacoes: 0, trechoAvaliacao: "", enderecoMapa: "", buscaMaps: "", linkMaps: "" }), campos: [
            { grade: [
              { k: "nome", rotulo: "Nome completo" },
              { k: "apelido", rotulo: "Nome curto", dica: "Aparece em destaque no cartão. Ex.: Cipó" }
            ] },
            { k: "id", rotulo: "Identificador", dica: "Sem espaços nem acentos. Ex.: jardim-angela" },
            { k: "endereco", rotulo: "Endereço (rua e número)" },
            { grade: [
              { k: "bairro", rotulo: "Bairro" },
              { k: "cidade", rotulo: "Cidade" },
              { k: "uf", rotulo: "Estado (UF)" },
              { k: "cep", rotulo: "CEP", dica: DICA_OCULTAR }
            ] },
            { k: "enderecoMapa", rotulo: "Endereço completo para o mapa", dica: "Usado no mapa e no “Como chegar”. Ex.: Rua Emília Pires, 450 - Embu-Guaçu - SP" },
            { k: "linkMaps", rotulo: "Link da loja no Google Maps (opcional)", tipo: "url" },
            { grade: [
              { k: "whatsapp", rotulo: "WhatsApp (só números, com 55)", dica: "Vazio = usa o WhatsApp principal." },
              { k: "whatsappExibicao", rotulo: "WhatsApp como aparece" },
              { k: "whatsappObs", rotulo: "Observação do WhatsApp", dica: "Ex.: central" },
              { k: "telefone", rotulo: "Telefone para ligar", dica: DICA_OCULTAR }
            ] },
            { k: "horarios", rotulo: "Horários", tipo: "lista", nomeItem: (h) => (h.rotulo || "Novo horário") + " — " + (h.fechado ? "Fechado" : h.abre && h.fecha ? h.abre + " às " + h.fecha : (h.texto || "")), novo: () => ({ rotulo: "", dias: [], abre: "08:00", fecha: "18:00" }), campos: [
              { k: "rotulo", rotulo: "Nome da linha", dica: "Ex.: Segunda a sexta, Sábado, Entregas" },
              { k: "dias", rotulo: "Dias (usados no cálculo de Aberta/Fechada)", tipo: "dias", dica: "Deixe sem dias para linhas só informativas, como Feriados e Entregas." },
              { k: "fechado", rotulo: "Fechado nesses dias", tipo: "check" },
              { grade: [
                { k: "abre", rotulo: "Abre às", tipo: "hora" },
                { k: "fecha", rotulo: "Fecha às", tipo: "hora" }
              ] },
              { k: "texto", rotulo: "Ou texto livre (linhas sem dias)", dica: "Ex.: 09h às 13h" },
              { k: "destaque", rotulo: "Destacar em laranja", tipo: "check" }
            ] },
            { grade: [
              { k: "nota", rotulo: "Nota no Google", tipo: "numero", passo: "0.1" },
              { k: "avaliacoes", rotulo: "Nº de avaliações", tipo: "numero", passo: "1" }
            ] },
            { k: "trechoAvaliacao", rotulo: "Trecho de uma avaliação", tipo: "textarea" },
            { k: "buscaMaps", rotulo: "Texto de busca no Google Maps (reserva)" }
          ] }
        ] },
        { raiz: "google", titulo: "Avaliações do Google", campos: [
          { k: "dataConsulta", rotulo: "Data em que as notas foram consultadas", dica: "Ex.: 05/10/2026" },
          { k: "buscaMaps", rotulo: "Busca usada no selo de nota do topo" }
        ] }
      ]
    },
    {
      id: "marcas", titulo: "Marcas",
      grupos: [{ raiz: "marcas", campos: [
        { k: "titulo", rotulo: "Título" },
        { k: "texto", rotulo: "Texto", tipo: "textarea" },
        { k: "lista", rotulo: "Marcas", tipo: "lista", nomeItem: (m) => m.nome || "Nova marca", novo: () => ({ nome: "", imagem: "", imagemAutorizada: false }), campos: [
          { k: "nome", rotulo: "Nome" },
          { k: "imagem", rotulo: "Logo da marca (só com autorização do fabricante)", tipo: "imagem", pasta: "assets/marcas" },
          { k: "imagemAutorizada", rotulo: "Tenho autorização para usar este logo", tipo: "check" }
        ] },
        { k: "aviso", rotulo: "Aviso abaixo das marcas" }
      ] }]
    },
    {
      id: "depoimentos", titulo: "Depoimentos", desc: "Use apenas trechos reais de avaliações públicas.",
      grupos: [{ campos: [
        { k: "depoimentos", rotulo: "Depoimentos", tipo: "lista", nomeItem: (d) => (d.texto || "Novo depoimento").slice(0, 60), novo: () => ({ texto: "", loja: ((dados.lojas || [])[0] || {}).id || "", nota: "" }), campos: [
          { k: "texto", rotulo: "Trecho da avaliação", tipo: "textarea" },
          { k: "loja", rotulo: "Loja", tipo: "select", opcoes: () => (dados.lojas || []).map((l) => [l.id, l.nome]) }
        ] }
      ] }]
    },
    {
      id: "faq", titulo: "Perguntas frequentes",
      grupos: [{ campos: [
        { k: "faq", rotulo: "Perguntas", tipo: "lista", nomeItem: (f) => f.pergunta || "Nova pergunta", novo: () => ({ pergunta: "", resposta: "" }), campos: [
          { k: "pergunta", rotulo: "Pergunta" },
          { k: "resposta", rotulo: "Resposta", tipo: "textarea" }
        ] }
      ] }]
    },
    { id: "config", titulo: "Configurações", especial: "config" }
  ];

  /* ------------------------------ montagem dos campos ------------------------------ */
  function montarCampo(c, obj, aoMudarRotulo) {
    if (c.grade) {
      return el("div", { class: "grade-2" }, c.grade.map((g) => montarCampo(g, obj, aoMudarRotulo)));
    }
    if (c.mostrarSe && !c.mostrarSe(obj)) return null;
    const id = novoId();
    const valor = obj[c.k];
    const mudar = (v) => { obj[c.k] = v; marcarAlterado(); if (aoMudarRotulo) aoMudarRotulo(); };
    const dica = c.dica ? el("span", { class: "dica", id: id + "-dica", text: c.dica }) : null;
    const desc = c.dica ? id + "-dica" : null;
    const tipo = c.tipo || "texto";

    if (tipo === "lista") return montarLista(c, obj);
    if (tipo === "textos") return montarTextos(c, obj);

    if (tipo === "check") {
      const inp = el("input", { type: "checkbox", id, "aria-describedby": desc });
      inp.checked = !!valor;
      inp.addEventListener("change", () => mudar(inp.checked));
      return el("div", { class: "campo" }, el("label", { class: "linha-check", for: id }, inp, c.rotulo), dica);
    }
    if (tipo === "dias") {
      const nomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      const atuais = Array.isArray(valor) ? valor.slice() : [];
      const caixa = el("div", { class: "dias", role: "group", "aria-label": c.rotulo });
      nomes.forEach((n, i) => {
        const inp = el("input", { type: "checkbox" });
        inp.checked = atuais.indexOf(i) !== -1;
        inp.addEventListener("change", () => {
          const set = new Set(Array.isArray(obj[c.k]) ? obj[c.k] : []);
          inp.checked ? set.add(i) : set.delete(i);
          const lista = Array.from(set).sort((a, b) => a - b);
          if (lista.length) mudar(lista); else { delete obj[c.k]; marcarAlterado(); if (aoMudarRotulo) aoMudarRotulo(); }
        });
        caixa.append(el("label", {}, inp, n));
      });
      return el("div", { class: "campo" }, el("span", { class: "rotulo", text: c.rotulo }), caixa, dica);
    }
    if (tipo === "select") {
      const opcoes = typeof c.opcoes === "function" ? c.opcoes() : c.opcoes;
      const sel = el("select", { id, "aria-describedby": desc });
      const temValor = opcoes.some(([v]) => v === (valor || ""));
      if (!temValor && valor) sel.append(el("option", { value: valor, text: valor + " (não encontrado)" }));
      opcoes.forEach(([v, t]) => sel.append(el("option", { value: v, text: t })));
      sel.value = valor || "";
      sel.addEventListener("change", () => {
        if (sel.value) mudar(sel.value); else { delete obj[c.k]; marcarAlterado(); if (aoMudarRotulo) aoMudarRotulo(); }
        if (c.refaz) mostrarSecao(secaoAtual, true);
      });
      return el("div", { class: "campo" }, el("label", { for: id, text: c.rotulo }), sel, dica);
    }
    if (tipo === "imagem") return montarImagem(c, obj, id, dica, desc, mudar);
    if (tipo === "video") return montarVideo(c, obj, id, dica, desc, mudar);

    let inp;
    if (tipo === "textarea") inp = el("textarea", { id, rows: 3, "aria-describedby": desc });
    else if (tipo === "numero") inp = el("input", { type: "number", id, step: c.passo || "any", "aria-describedby": desc });
    else if (tipo === "hora") inp = el("input", { type: "time", id, "aria-describedby": desc });
    else inp = el("input", { type: tipo === "url" ? "url" : "text", id, "aria-describedby": desc });
    inp.value = valor == null ? "" : valor;
    inp.addEventListener("input", () => {
      if (tipo === "numero") { const n = parseFloat(inp.value.replace(",", ".")); mudar(isNaN(n) ? 0 : n); }
      else if (tipo === "hora" && !inp.value) { delete obj[c.k]; marcarAlterado(); if (aoMudarRotulo) aoMudarRotulo(); }
      else mudar(inp.value);
    });
    return el("div", { class: "campo" }, el("label", { for: id, text: c.rotulo }), inp, dica);
  }

  function montarImagem(c, obj, id, dica, desc, mudar) {
    const previa = el("div", { class: "imagem__previa", "aria-hidden": "true" });
    const caminho = el("input", { type: "text", id, placeholder: "assets/fotos/nome-da-foto.webp", "aria-describedby": desc });
    const pendente = el("span", { class: "imagem__pendente" });
    const arquivo = el("input", { type: "file", accept: "image/*", hidden: true });
    const atualizar = () => {
      const v = obj[c.k] || "";
      caminho.value = v;
      const url = urlPrevia(v);
      previa.style.backgroundImage = url ? "url(\"" + url.replace(/"/g, "%22") + "\")" : "";
      previa.textContent = url ? "" : "sem foto";
      pendente.textContent = fotosPendentes.has(v) ? "Nova foto — será enviada ao salvar" : "";
    };
    caminho.addEventListener("change", () => { mudar(caminho.value.trim()); atualizar(); });
    arquivo.addEventListener("change", async () => {
      const f = arquivo.files && arquivo.files[0];
      if (!f) return;
      try {
        pendente.textContent = "Preparando foto…";
        const novo = await prepararFoto(f, c.pasta);
        mudar(novo); atualizar();
      } catch (e) { aviso("Não foi possível ler a imagem: " + e.message, true); atualizar(); }
      arquivo.value = "";
    });
    atualizar();
    return el("div", { class: "campo" },
      el("label", { for: id, text: c.rotulo }),
      el("div", { class: "imagem" }, previa,
        el("div", {}, caminho,
          el("div", { class: "imagem__acoes" },
            el("button", { type: "button", class: "botao botao--fantasma botao--mini", onclick: () => arquivo.click() }, "Enviar foto"),
            el("button", { type: "button", class: "botao botao--perigo botao--mini", onclick: () => { mudar(""); atualizar(); } }, "Remover"),
            arquivo),
          pendente, dica)));
  }

  function montarVideo(c, obj, id, dica, desc, mudar) {
    const caminho = el("input", { type: "text", id, placeholder: "assets/videos/nome-do-video.mp4", "aria-describedby": desc });
    const previa = el("video", { class: "video-previa", controls: true, playsinline: true, preload: "metadata", muted: true });
    const pendente = el("span", { class: "imagem__pendente" });
    const arquivo = el("input", { type: "file", accept: "video/mp4,video/webm,video/quicktime", hidden: true });
    const atualizar = () => {
      const v = obj[c.k] || "";
      caminho.value = v;
      const url = urlPrevia(v);
      previa.hidden = !url;
      if (url && previa.getAttribute("src") !== url) previa.src = url;
      pendente.textContent = fotosPendentes.has(v) ? "Novo vídeo — será enviado ao salvar" : "";
    };
    caminho.addEventListener("change", () => { mudar(caminho.value.trim()); atualizar(); });
    arquivo.addEventListener("change", () => {
      const f = arquivo.files && arquivo.files[0];
      if (!f) return;
      const mb = f.size / 1048576;
      if (mb > 25) { aviso("Vídeo com " + mb.toFixed(0) + " MB: o limite é 25 MB. Corte ou comprima o vídeo, ou publique no YouTube e cole o link.", true); arquivo.value = ""; return; }
      pendente.textContent = "Lendo vídeo…";
      const leitor = new FileReader();
      leitor.onload = () => {
        const dataUrl = String(leitor.result);
        const ext = (f.name.match(/\.(mp4|webm|mov)$/i) || [, "mp4"])[1].toLowerCase();
        const caminhoNovo = "assets/videos/" + slug(f.name) + "-" + Date.now().toString(36) + "." + ext;
        fotosPendentes.set(caminhoNovo, { base64: dataUrl.split(",")[1], dataUrl: URL.createObjectURL(f) });
        mudar(caminhoNovo); atualizar();
        if (mb > 10) aviso("Vídeo com " + mb.toFixed(0) + " MB: vai funcionar, mas pode demorar a carregar no celular. Ideal: até 10 MB.");
      };
      leitor.onerror = () => { aviso("Não foi possível ler o vídeo.", true); atualizar(); };
      leitor.readAsDataURL(f);
      arquivo.value = "";
    });
    atualizar();
    return el("div", { class: "campo" },
      el("label", { for: id, text: c.rotulo }), previa, caminho,
      el("div", { class: "imagem__acoes" },
        el("button", { type: "button", class: "botao botao--fantasma botao--mini", onclick: () => arquivo.click() }, "Enviar vídeo"),
        el("button", { type: "button", class: "botao botao--perigo botao--mini", onclick: () => { mudar(""); atualizar(); } }, "Remover"),
        arquivo),
      pendente, dica);
  }

  function montarTextos(c, obj) {
    if (!Array.isArray(obj[c.k])) obj[c.k] = [];
    const lista = obj[c.k];
    const caixa = el("div", { class: "lista" });
    const desenhar = () => {
      caixa.innerHTML = "";
      lista.forEach((t, i) => {
        const id = novoId();
        const ta = el("textarea", { id, rows: 3 });
        ta.value = t;
        ta.addEventListener("input", () => { lista[i] = ta.value; marcarAlterado(); });
        caixa.append(el("div", { class: "campo" },
          el("label", { for: id, text: c.rotulo.replace(/s$/, "") + " " + (i + 1) }), ta,
          el("div", { class: "imagem__acoes" }, ferramentasItem(lista, i, desenhar))));
      });
    };
    desenhar();
    return el("div", { class: "campo" }, el("span", { class: "rotulo", text: c.rotulo }), caixa,
      el("button", { type: "button", class: "botao botao--fantasma botao--mini lista__adicionar", onclick: () => { lista.push(c.novo || ""); marcarAlterado(); desenhar(); } }, "+ Adicionar"));
  }

  function ferramentasItem(lista, i, redesenhar) {
    const mover = (d) => { const j = i + d; if (j < 0 || j >= lista.length) return; [lista[i], lista[j]] = [lista[j], lista[i]]; marcarAlterado(); redesenhar(j); };
    return [
      el("button", { type: "button", class: "botao botao--fantasma botao--mini", onclick: () => mover(-1), disabled: i === 0, "aria-label": "Mover para cima" }, "↑ Subir"),
      el("button", { type: "button", class: "botao botao--fantasma botao--mini", onclick: () => mover(1), disabled: i === lista.length - 1, "aria-label": "Mover para baixo" }, "↓ Descer"),
      el("button", { type: "button", class: "botao botao--perigo botao--mini", onclick: () => { if (confirm("Remover este item?")) { lista.splice(i, 1); marcarAlterado(); redesenhar(); } } }, "Remover")
    ];
  }

  function montarLista(c, obj) {
    if (!Array.isArray(obj[c.k])) obj[c.k] = [];
    const lista = obj[c.k];
    const caixa = el("div", { class: "lista" });
    const desenhar = (abrir) => {
      caixa.innerHTML = "";
      lista.forEach((item, i) => {
        const titulo = el("span", { class: "item__titulo", text: c.nomeItem(item) });
        const det = el("details", { class: "item" }, el("summary", {}, titulo));
        if (abrir === i) det.open = true;
        let montado = false;
        const montar = () => {
          if (montado) return; montado = true;
          const corpo = el("div", { class: "item__corpo" });
          c.campos.forEach((sub) => { const n = montarCampo(sub, item, () => { titulo.textContent = c.nomeItem(item); }); if (n) corpo.append(n); });
          corpo.append(el("div", { class: "item__ferramentas" }, ferramentasItem(lista, i, desenhar)));
          det.append(corpo);
        };
        det.addEventListener("toggle", () => { if (det.open) montar(); });
        if (det.open) montar();
        caixa.append(det);
      });
    };
    desenhar();
    return el("div", { class: "campo sublista" }, el("span", { class: "rotulo", text: c.rotulo }), caixa,
      el("button", { type: "button", class: "botao botao--fantasma botao--mini lista__adicionar", onclick: () => { lista.push(c.novo()); marcarAlterado(); desenhar(lista.length - 1); } }, "+ Adicionar"));
  }

  /* ------------------------------ seções ------------------------------ */
  function montarMenu() {
    const lista = $("#menu-lista"), sel = $("#menu-select");
    lista.innerHTML = ""; sel.innerHTML = "";
    SECOES.forEach((s) => {
      lista.append(el("li", {}, el("button", { type: "button", "data-secao": s.id, onclick: () => mostrarSecao(s.id) }, s.titulo)));
      sel.append(el("option", { value: s.id, text: s.titulo }));
    });
    sel.onchange = () => mostrarSecao(sel.value);
  }

  function mostrarSecao(id, manterRolagem) {
    secaoAtual = id;
    const s = SECOES.find((x) => x.id === id) || SECOES[0];
    document.querySelectorAll("#menu-lista button").forEach((b) => b.setAttribute("aria-current", String(b.getAttribute("data-secao") === s.id)));
    $("#menu-select").value = s.id;
    const ed = $("#editor");
    const rolagem = window.scrollY;
    ed.innerHTML = "";
    ed.append(el("h1", { text: s.titulo }));
    if (s.desc) ed.append(el("p", { class: "secao-desc", text: s.desc }));
    if (s.especial === "inicio") ed.append(montarInicio());
    else if (s.especial === "config") ed.append(montarConfig());
    else s.grupos.forEach((g) => {
      const alvo = g.raiz ? g.raiz.split(".").reduce((o, k) => (o[k] = (o[k] && typeof o[k] === "object") ? o[k] : {}), dados) : dados;
      const cartao = el("section", { class: "cartao" });
      if (g.titulo) cartao.append(el("h2", { text: g.titulo }));
      g.campos.forEach((c) => { const n = montarCampo(c, alvo); if (n) cartao.append(n); });
      ed.append(cartao);
    });
    if (manterRolagem) window.scrollTo(0, rolagem); else { window.scrollTo(0, 0); ed.focus({ preventScroll: true }); }
  }

  function montarInicio() {
    const conectado = !!config.token;
    return el("div", {},
      el("section", { class: "cartao" },
        el("h2", { text: "Como usar" }),
        el("ol", { class: "passos" },
          el("li", {}, "Escolha uma seção no menu e altere os campos."),
          el("li", {}, "Use “Prévia” para ver o site com as mudanças antes de publicar (fotos novas só aparecem depois de publicar)."),
          el("li", {}, "Clique em “Salvar e publicar”. Em cerca de 1 minuto o site é atualizado.")),
        el("p", { class: "dica", text: "Dica: campos vazios ou com “[a confirmar]” não aparecem no site." })),
      el("section", { class: "cartao" },
        el("h2", { text: conectado ? "Conectado ao GitHub" : "Falta conectar ao GitHub" }),
        el("p", { text: conectado
          ? "Você pode editar e publicar. Repositório: " + config.owner + "/" + config.repo + " · branch " + config.branch + "."
          : "Você está vendo o conteúdo, mas para publicar precisa colar sua chave de acesso em Configurações." }),
        el("button", { type: "button", class: "botao botao--fantasma", onclick: () => mostrarSecao("config") }, conectado ? "Ver configurações" : "Configurar agora")),
      el("section", { class: "cartao" },
        el("h2", { text: "Cópia de segurança" }),
        el("p", { text: "Baixe o conteúdo atual (com as alterações ainda não publicadas) como arquivo. Útil antes de grandes mudanças." }),
        el("button", { type: "button", class: "botao botao--fantasma", onclick: baixarBackup }, "Baixar conteudo.js")));
  }

  function montarConfig() {
    const campo = (rotulo, k, tipo, dica) => {
      const id = novoId();
      const inp = el("input", { type: tipo || "text", id, autocomplete: tipo === "password" ? "off" : null, spellcheck: "false" });
      inp.value = config[k] || "";
      inp.addEventListener("change", () => { config[k] = inp.value.trim(); });
      return el("div", { class: "campo" }, el("label", { for: id, text: rotulo }), inp, dica ? el("span", { class: "dica", text: dica }) : null);
    };
    const lembrarId = novoId();
    const lembrar = el("input", { type: "checkbox", id: lembrarId });
    lembrar.checked = !!config.lembrar;
    lembrar.addEventListener("change", () => { config.lembrar = lembrar.checked; });
    return el("div", {},
      el("section", { class: "cartao" },
        el("h2", { text: "Chave de acesso do GitHub" }),
        el("p", { text: "Ela permite que este painel grave no repositório do site. Fica guardada só neste navegador — nunca compartilhe." }),
        campo("Chave de acesso (token)", "token", "password", "Começa com github_pat_…"),
        el("div", { class: "campo" }, el("label", { class: "linha-check", for: lembrarId }, lembrar, "Lembrar neste navegador"),
          el("span", { class: "dica", text: "Desmarque em computadores compartilhados: a chave some ao fechar a aba." })),
        el("div", { class: "imagem__acoes" },
          el("button", { type: "button", class: "botao botao--primario", onclick: async () => { gravarConfig(config); await testarConexao(); } }, "Salvar e testar conexão"),
          el("button", { type: "button", class: "botao botao--perigo", onclick: () => { config.token = ""; gravarConfig(config); aviso("Chave removida deste navegador."); mostrarSecao("config"); status("Só leitura: configure a chave de acesso para salvar", "alterado"); } }, "Remover chave"))),
      el("section", { class: "cartao" },
        el("h2", { text: "Como criar a chave (uma vez só)" }),
        el("ol", { class: "passos" },
          el("li", {}, "No GitHub, clique na sua foto → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token."),
          el("li", {}, "Dê um nome (ex.: Painel do site) e escolha a validade (ex.: 1 ano)."),
          el("li", {}, "Em Repository access, escolha “Only select repositories” e marque ", el("code", { text: config.repo }), "."),
          el("li", {}, "Em Permissions → Repository permissions → Contents, escolha “Read and write”."),
          el("li", {}, "Clique em Generate token, copie a chave e cole aqui."))),
      el("section", { class: "cartao" },
        el("h2", { text: "Repositório" }),
        el("p", { class: "dica", text: "Só mude se o site trocar de repositório ou de branch publicada no GitHub Pages." }),
        el("div", { class: "grade-2" }, campo("Dono (usuário)", "owner"), campo("Repositório", "repo")),
        campo("Branch publicada no GitHub Pages", "branch")));
  }

  async function testarConexao() {
    if (!config.token) { aviso("Cole a chave de acesso primeiro.", true); return; }
    status("Testando conexão…");
    try {
      const repo = await api("");
      if (!repo.permissions || !repo.permissions.push) throw new Error("A chave não tem permissão de escrita neste repositório.");
      aviso("Conectado! Agora você pode publicar.");
      if (alterado) status("Conectado · há alterações não publicadas", "alterado");
      else await carregar();
    } catch (e) { status(e.message, "erro"); aviso(e.message, true); }
  }

  function baixarBackup() {
    const blob = new Blob([gerarArquivo(dados)], { type: "text/javascript" });
    const a = el("a", { href: URL.createObjectURL(blob), download: "conteudo.js" });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ------------------------------ início ------------------------------ */
  $("#btn-salvar").addEventListener("click", salvar);
  $("#btn-previa").addEventListener("click", () => {
    try { localStorage.setItem(CHAVE_PREVIA, JSON.stringify(dados)); } catch (e) { aviso("O navegador bloqueou a prévia.", true); return; }
    window.open("../?previa=1", "_blank", "noopener");
  });
  // expõe funções internas para testes automatizados
  window.__painel = { gerarArquivo, avaliarConteudo, get dados() { return dados; } };
  carregar();
})();
