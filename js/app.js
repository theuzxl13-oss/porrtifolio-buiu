/* Cardoso Baterias — montagem do site a partir de js/conteudo.js.
   Para mudar textos, lojas, fotos etc., edite js/conteudo.js (não este arquivo). */
(function () {
  "use strict";

  var C = window.CONTEUDO;
  if (!C) return;

  var PENDENTE = "[a confirmar]";
  var revisao = /[?&]revisao=1\b/.test(location.search);

  /* ---------------------------- utilidades ---------------------------- */
  function ok(v) {
    return v !== undefined && v !== null && String(v).trim() !== "" && String(v).indexOf(PENDENTE) === -1;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function caminho(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function so_digitos(s) { return String(s).replace(/\D/g, ""); }

  function linkWhats(mensagem, numero) {
    var n = ok(numero) ? so_digitos(numero) : so_digitos(C.whatsapp.numero);
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(mensagem || C.whatsapp.mensagemPadrao);
  }
  function linkTel(tel) {
    var d = so_digitos(tel);
    if (d.indexOf("55") !== 0 || d.length <= 11) d = "55" + d;
    return "tel:+" + d;
  }
  function linkMaps(loja) {
    if (ok(loja.linkMaps)) return loja.linkMaps;
    var q = ok(loja.enderecoMapa) ? (loja.nome + ", " + loja.enderecoMapa) : (loja.buscaMaps || loja.nome);
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  }
  function fmtNota(n) {
    return Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  function fmtInt(n) { return Number(n).toLocaleString("pt-BR"); }
  function listaPt(arr) {
    if (arr.length < 2) return arr.join("");
    return arr.slice(0, -1).join(", ") + " e " + arr[arr.length - 1];
  }
  function pend(rotulo) {
    return revisao ? ' <span class="pendente">' + esc(rotulo) + ": [a confirmar]</span>" : "";
  }
  function estrelas(nota) {
    var pct = Math.max(0, Math.min(100, (Number(nota) / 5) * 100));
    return '<span class="estrelas" aria-hidden="true"><span class="estrelas__cheias" style="width:' + pct + '%">★★★★★</span>★★★★★</span>';
  }

  var ICONES = {
    bateria: '<path d="M7 7V5h3v2h4V5h3v2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2zm-1 5v1.6h4V12H6zm8 0v1.6h1.2V15h1.6v-1.4H18V12h-1.2v-1.4h-1.6V12H14z"/>',
    ferramenta: '<path d="M21.7 6.3a5.5 5.5 0 0 1-7.2 6.9l-7.3 7.3a2.1 2.1 0 0 1-3-3l7.3-7.3a5.5 5.5 0 0 1 6.9-7.2l-3.5 3.5.7 2.6 2.6.7 3.5-3.5z"/>',
    teste: '<path d="M12 3a10 10 0 0 0-10 10c0 2.4.8 4.6 2.3 6.3l.3.3h14.8l.3-.3A10 10 0 0 0 12 3zm0 2.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM6.3 7.6a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm11.4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM4.2 12.4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm15.6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-4.2-3.7 1.4 1.4-3.4 4.1a2 2 0 1 1-1.5-1.3l3.5-4.2z"/>',
    relogio: '<path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2.2a7.8 7.8 0 1 0 0 15.6 7.8 7.8 0 0 0 0-15.6zM11 6.5h2v5l3.6 2.1-1 1.7L11 12.6V6.5z"/>',
    loja: '<path d="M3 4h18l1 5a3 3 0 0 1-2 2.8V20H4v-8.2A3 3 0 0 1 2 9l1-5zm3 9v5h5v-5H6zm8 0v7h4v-7h-4z"/>',
    conversa: '<path d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3 5v2h10V8H7zm0 4v2h7v-2H7z"/>',
    camera: '<path d="M9 3h6l1.5 2H20a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.5L9 3zm3 4.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>',
    pino: '<path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
    telefone: '<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/>',
    whats: '<path d="M12 2.2A9.7 9.7 0 0 0 3.6 16.8L2.2 21.8l5.2-1.4A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-3-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8.9-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.6.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.4-.6 1.7-1.2.2-.6.2-1 .1-1.2l-.4-.2z"/>'
  };
  function icone(nome, classe) {
    return '<svg class="' + (classe || "icone") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="currentColor">' + (ICONES[nome] || ICONES.bateria) + "</g></svg>";
  }

  /* ------------------------- dados calculados ------------------------- */
  var lojas = C.lojas || [];
  var totalAval = lojas.reduce(function (s, l) { return s + (Number(l.avaliacoes) || 0); }, 0);
  var mediaPond = totalAval
    ? lojas.reduce(function (s, l) { return s + Number(l.nota) * (Number(l.avaliacoes) || 0); }, 0) / totalAval
    : 0;
  var mediaTxt = fmtNota(Math.round(mediaPond * 10) / 10);
  var dataConsulta = C.google.dataConsulta;
  var lojaPorId = {};
  lojas.forEach(function (l) { lojaPorId[l.id] = l; });

  /* --------------------- textos simples (data-c) --------------------- */
  $$("[data-c]").forEach(function (el) {
    var v = caminho(C, el.getAttribute("data-c"));
    if (ok(v)) el.textContent = v;
    else if (v !== undefined) el.hidden = !revisao;
  });

  /* ------------------------------ logos ------------------------------ */
  $$("[data-logo]").forEach(function (img) {
    var tipo = img.getAttribute("data-logo");
    var src = tipo === "claro" ? C.logo.fundoClaro : C.logo.fundoEscuro;
    if (ok(src)) img.src = src;
    if (ok(C.logo.alt)) img.alt = C.logo.alt;
  });

  /* ------------------------- WhatsApp padrão ------------------------- */
  $$("[data-whats]").forEach(function (a) { a.href = linkWhats(); });
  $("#whats-exibicao").textContent = C.whatsapp.exibicao;

  /* --------------------------- loja virtual --------------------------- */
  if (ok(C.empresa.lojaVirtual)) {
    var li = $("[data-loja-virtual]");
    li.hidden = false;
    $("a", li).href = C.empresa.lojaVirtual;
    $("#rodape-links").insertAdjacentHTML("beforeend",
      '<li><a href="' + esc(C.empresa.lojaVirtual) + '" target="_blank" rel="noopener">Loja virtual</a></li>');
  }
  ["instagram", "facebook"].forEach(function (rede) {
    if (ok(C.empresa[rede])) {
      $("#rodape-links").insertAdjacentHTML("beforeend",
        '<li><a href="' + esc(C.empresa[rede]) + '" target="_blank" rel="noopener">' + (rede === "instagram" ? "Instagram" : "Facebook") + "</a></li>");
    }
  });

  /* ------------------------------- hero ------------------------------- */
  if (ok(C.hero.imagem)) {
    $(".hero__fundo").style.backgroundImage = "linear-gradient(90deg,rgba(11,11,12,.92) 30%,rgba(11,11,12,.55)),url('" + C.hero.imagem + "')";
    $(".hero").classList.add("hero--foto");
  }
  if (ok(C.hero.imagemRaio)) {
    var raio = new Image();
    raio.onload = function () {
      raio.className = "ilustra ilustra--foto";
      raio.alt = "";
      raio.setAttribute("aria-hidden", "true");
      var svg = $(".ilustra--raio");
      if (svg) svg.replaceWith(raio);
    };
    if (ok(C.hero.imagemRaioCelular)) {
      raio.srcset = C.hero.imagemRaioCelular + " 520w, " + C.hero.imagemRaio + " 800w";
      raio.sizes = "(min-width: 900px) 640px, 360px";
    }
    raio.src = C.hero.imagemRaio;
  }
  var linkGoogle = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.google.buscaMaps);
  $$("[data-maps]").forEach(function (a) { a.href = linkGoogle; });
  var nota = $("#nota-google");
  nota.href = linkGoogle;
  nota.innerHTML =
    '<span class="nota-google__g" aria-hidden="true">G</span>' +
    '<span class="nota-google__num">' + mediaTxt + "</span>" + estrelas(mediaPond) +
    '<span class="nota-google__txt"><strong>Nota ' + mediaTxt + " no Google</strong> · " + fmtInt(totalAval) +
    " avaliações em " + lojas.length + " lojas" +
    '<small>Consulta em ' + esc(dataConsulta) + "</small></span>";
  nota.setAttribute("aria-label", "Nota " + mediaTxt + " de 5 no Google, " + totalAval + " avaliações em " + lojas.length + " lojas, consulta em " + dataConsulta + " (abre o Google Maps)");

  /* --------------------------- faixa rolando --------------------------- */
  var itensFaixa = (C.faixa || []).filter(ok).concat(["Nota " + mediaTxt + " no Google · " + fmtInt(totalAval) + " avaliações"]);
  var trecho = itensFaixa.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
  if ($("#faixa")) $("#faixa").innerHTML = '<div class="faixa__grupo">' + trecho + '</div><div class="faixa__grupo">' + trecho + "</div>";

  /* ------------------------------- sobre ------------------------------- */
  $("#sobre-texto").innerHTML = C.sobre.paragrafos.filter(ok).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  $("#diferenciais").innerHTML = C.sobre.diferenciais.map(function (d) {
    return '<li class="diferencial">' + icone(d.icone, "diferencial__icone") +
      "<div><h3>" + esc(d.titulo) + "</h3><p>" + esc(d.texto) + "</p></div></li>";
  }).join("");

  /* ------------------------------ serviços ------------------------------ */
  $("#lista-servicos").innerHTML = C.servicos.map(function (s) {
    return '<li class="servico">' + icone(s.icone, "servico__icone") +
      "<h3>" + esc(s.titulo) + "</h3><p>" + esc(s.texto) + "</p>" +
      '<a class="btn btn--contorno btn--seta" href="' + esc(linkWhats(s.mensagem)) + '" target="_blank" rel="noopener" aria-label="Agendar ' + esc(s.titulo.toLowerCase()) + ' pelo WhatsApp">' +
      "Agendar pelo WhatsApp</a></li>";
  }).join("");

  /* ------------------------------- marcas ------------------------------- */
  $("#lista-marcas").innerHTML = C.marcas.lista.map(function (m) {
    var usaImg = ok(m.imagem) && m.imagemAutorizada === true;
    return '<li class="marca' + (usaImg ? " marca--img" : "") + '">' +
      (usaImg ? '<img src="' + esc(m.imagem) + '" alt="' + esc(m.nome) + '" loading="lazy">'
        : '<span class="marca__inicial" aria-hidden="true">' + esc(m.nome.charAt(0)) + '</span><span class="marca__nome">' + esc(m.nome) + "</span>") +
      "</li>";
  }).join("");

  /* ------------------------------ portfólio ------------------------------ */
  var P = C.portfolio;
  var nomeCat = {};
  P.categorias.forEach(function (c) { nomeCat[c.id] = c.nome; });
  var filtroAtual = "todos";
  var visiveis = [];

  function ehAntesDepois(it) { return it.tipo === "antesDepois" || ok(it.antes) || ok(it.depois); }

  function marcador(rotulo, cat) {
    var ic = cat === "testes" ? "teste" : cat === "loja" ? "loja" : cat === "frota" ? "ferramenta" : "bateria";
    return '<div class="marcador">' + icone(ic, "marcador__icone") +
      '<span class="marcador__txt">Foto ilustrativa — substituir</span>' +
      (rotulo ? '<span class="marcador__rotulo">' + esc(rotulo) + "</span>" : "") + "</div>";
  }
  function midia(src, alt, rotulo, cat, lazy) {
    if (ok(src)) return '<img src="' + esc(src) + '" alt="' + esc(alt || "") + '"' + (lazy ? ' loading="lazy"' : "") + ">";
    return marcador(rotulo, cat);
  }

  function renderFiltros() {
    var cats = [{ id: "todos", nome: "Todos" }].concat(P.categorias);
    $("#filtros").innerHTML = cats.map(function (c) {
      return '<button type="button" class="filtro" data-filtro="' + esc(c.id) + '" aria-pressed="' + (c.id === filtroAtual) + '">' + esc(c.nome) + "</button>";
    }).join("");
  }
  function renderGaleria() {
    visiveis = P.itens.filter(function (it) { return filtroAtual === "todos" || it.categoria === filtroAtual; });
    $("#galeria").innerHTML = visiveis.map(function (it, i) {
      var ad = ehAntesDepois(it);
      var placeholder = ad ? !(ok(it.antes) && ok(it.depois)) : !ok(it.foto);
      var media = ad
        ? '<div class="ad-mini"><div>' + midia(it.antes, "Antes: " + it.titulo, "Antes", it.categoria, true) +
          '</div><div>' + midia(it.depois, "Depois: " + it.titulo, "Depois", it.categoria, true) + "</div></div>"
        : midia(it.foto, it.alt || it.titulo, "", it.categoria, true);
      var label = "Ampliar: " + it.titulo + (ad ? " (antes e depois)" : "") + (placeholder ? " — foto ilustrativa" : "");
      return '<li class="galeria__item">' +
        '<button type="button" class="galeria__btn" data-indice="' + i + '" aria-label="' + esc(label) + '">' +
        '<span class="galeria__midia" aria-hidden="true">' + media + "</span>" +
        '<span class="galeria__info" aria-hidden="true"><span class="galeria__cat">' + esc(nomeCat[it.categoria] || "") +
        (ad ? " · Antes e depois" : "") + "</span><strong>" + esc(it.titulo) + "</strong></span>" +
        "</button></li>";
    }).join("") || '<li class="galeria__vazia">Nenhum trabalho nesta categoria ainda.</li>';
  }
  $("#filtros").addEventListener("click", function (e) {
    var b = e.target.closest("[data-filtro]");
    if (!b) return;
    filtroAtual = b.getAttribute("data-filtro");
    $$(".filtro").forEach(function (f) { f.setAttribute("aria-pressed", String(f === b)); });
    renderGaleria();
  });
  $("#galeria").addEventListener("click", function (e) {
    var b = e.target.closest("[data-indice]");
    if (b) abrirLightbox(Number(b.getAttribute("data-indice")), b);
  });
  renderFiltros();
  renderGaleria();

  /* ------------------------------ lightbox ------------------------------ */
  var dlg = $("#lightbox");
  var atual = 0;
  var origemFoco = null;

  function mostrar(i) {
    atual = (i + visiveis.length) % visiveis.length;
    var it = visiveis[atual];
    var html;
    if (ehAntesDepois(it)) {
      html = '<div class="comparar" style="--pos:50%">' +
        '<div class="comparar__camada">' + midia(it.depois, "Depois: " + it.titulo, "Depois", it.categoria) + "</div>" +
        '<div class="comparar__camada comparar__antes">' + midia(it.antes, "Antes: " + it.titulo, "Antes", it.categoria) + "</div>" +
        '<span class="comparar__rotulo comparar__rotulo--antes" aria-hidden="true">Antes</span>' +
        '<span class="comparar__rotulo comparar__rotulo--depois" aria-hidden="true">Depois</span>' +
        '<span class="comparar__linha" aria-hidden="true"></span>' +
        '<input class="comparar__range" type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois: arraste ou use as setas">' +
        "</div>";
    } else {
      html = midia(it.foto, it.alt || it.titulo, "", it.categoria);
    }
    $("#lightbox-midia").innerHTML = html;
    $("#lightbox-titulo").textContent = it.titulo;
    $("#lightbox-desc").textContent = it.descricao || "";
    $("#lightbox-contador").textContent = (atual + 1) + " de " + visiveis.length + " · " + (nomeCat[it.categoria] || "");
    var multi = visiveis.length > 1;
    $("#lightbox-ant").hidden = !multi;
    $("#lightbox-prox").hidden = !multi;
    var r = $(".comparar__range", dlg);
    if (r) r.addEventListener("input", function () { r.parentNode.style.setProperty("--pos", r.value + "%"); });
  }
  function abrirLightbox(i, origem) {
    origemFoco = origem || null;
    mostrar(i);
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    document.documentElement.classList.add("sem-rolagem");
    $(".lightbox__fechar", dlg).focus();
  }
  function fecharLightbox() {
    if (dlg.open && typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
  }
  dlg.addEventListener("close", function () {
    document.documentElement.classList.remove("sem-rolagem");
    if (origemFoco) origemFoco.focus();
  });
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg || e.target.closest("[data-fechar]")) fecharLightbox();
  });
  $("#lightbox-ant").addEventListener("click", function () { mostrar(atual - 1); });
  $("#lightbox-prox").addEventListener("click", function () { mostrar(atual + 1); });
  dlg.addEventListener("keydown", function (e) {
    if (e.target.classList && e.target.classList.contains("comparar__range")) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); mostrar(atual - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); mostrar(atual + 1); }
  });
  // Deslizar para os lados no celular
  var toqueX = null;
  dlg.addEventListener("touchstart", function (e) {
    toqueX = e.target.closest(".comparar") ? null : e.touches[0].clientX;
  }, { passive: true });
  dlg.addEventListener("touchend", function (e) {
    if (toqueX === null) return;
    var dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    toqueX = null;
  });

  /* -------------------------------- lojas -------------------------------- */
  /* ---- horários e status (calculado no fuso de São Paulo) ---- */
  var NOMES_DIA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  function minutos(h) { var p = String(h).split(":"); return (+p[0]) * 60 + (+(p[1] || 0)); }
  function fmtHora(h) { var p = String(h).split(":"); return p[0] + "h" + (p[1] && p[1] !== "00" ? p[1] : ""); }
  function agoraSP() {
    var partes = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).forEach(function (x) { partes[x.type] = x.value; });
    return { dia: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(partes.weekday), min: (+partes.hour % 24) * 60 + (+partes.minute) };
  }
  function linhaDoDia(l, dia) {
    return (l.horarios || []).filter(function (h) { return h.dias && h.dias.indexOf(dia) !== -1; })[0];
  }
  function statusLoja(l) {
    if (!Array.isArray(l.horarios) || !l.horarios.some(function (h) { return h.dias; })) return null;
    var t = agoraSP(), hoje = linhaDoDia(l, t.dia);
    if (hoje && !hoje.fechado && hoje.abre) {
      if (t.min >= minutos(hoje.abre) && t.min < minutos(hoje.fecha)) return { aberta: true, texto: "Aberta até " + fmtHora(hoje.fecha) };
      if (t.min < minutos(hoje.abre)) return { aberta: false, texto: "Fechada · abre às " + fmtHora(hoje.abre) };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (t.dia + i) % 7, prox = linhaDoDia(l, d);
      if (prox && !prox.fechado && prox.abre) {
        return { aberta: false, texto: "Fechada · abre " + (i === 1 ? "amanhã" : NOMES_DIA[d]) + " às " + fmtHora(prox.abre) };
      }
    }
    return { aberta: false, texto: "Fechada" };
  }
  function valorHorario(h) {
    if (h.fechado) return "Fechado";
    if (h.abre && h.fecha) return fmtHora(h.abre) + " às " + fmtHora(h.fecha);
    return h.texto || "";
  }
  function htmlStatus(l) {
    var st = statusLoja(l);
    if (!st) return "";
    return '<span class="status ' + (st.aberta ? "status--aberta" : "status--fechada") + '"><span class="status__ponto" aria-hidden="true"></span>' + esc(st.texto) + "</span>";
  }
  function atualizarStatus() {
    lojas.forEach(function (l) {
      $$('[data-status="' + l.id + '"]').forEach(function (el) { el.innerHTML = htmlStatus(l); });
    });
  }

  /* ---- textos e links de cada loja ---- */
  function cidadeLoja(l) {
    var partes = [];
    if (ok(l.bairro) && l.bairro !== l.cidade) partes.push(l.bairro);
    if (ok(l.cidade)) partes.push(l.cidade);
    if (ok(l.uf)) partes.push(l.uf);
    return partes.join(" - ");
  }
  function enderecoLoja(l) {
    if (ok(l.endereco)) return esc(l.endereco) + (cidadeLoja(l) ? "<br>" + esc(cidadeLoja(l)) : "");
    return "Consulte pelo WhatsApp" + pend("Endereço");
  }
  function mensagemLoja(l) {
    return "Olá! Vim pelo site da Cardoso Baterias e gostaria de um orçamento na unidade " + l.apelido + ". Meu veículo é [marca/modelo/ano].";
  }
  function linkRota(l) {
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(ok(l.enderecoMapa) ? l.enderecoMapa : (l.buscaMaps || l.nome));
  }
  function linkMapaEmbutido(l) {
    return "https://maps.google.com/maps?q=" + encodeURIComponent(ok(l.enderecoMapa) ? l.enderecoMapa : (l.buscaMaps || l.nome)) + "&z=16&hl=pt-BR&output=embed";
  }

  $("#lojas-resumo").innerHTML = "Nota <strong>" + mediaTxt + "</strong> no Google com <strong>" + fmtInt(totalAval) +
    " avaliações</strong> (consulta em " + esc(dataConsulta) + ").";

  $("#lista-lojas").innerHTML = lojas.map(function (l) {
    var tabela = (Array.isArray(l.horarios) ? l.horarios : []).map(function (h) {
      var cls = h.fechado ? " class=\"horario--fechado\"" : h.destaque ? " class=\"horario--destaque\"" : "";
      return "<div><dt>" + esc(h.rotulo) + "</dt><dd" + cls + ">" + esc(valorHorario(h)) + "</dd></div>";
    }).join("");
    var numWhats = ok(l.whatsappExibicao) ? l.whatsappExibicao : C.whatsapp.exibicao;
    return '<li class="loja" id="loja-' + esc(l.id) + '" data-loja="' + esc(l.id) + '">' +
      '<div class="loja__topo"><p class="loja__marca">' + esc(C.empresa.nome) + '</p><span class="loja__selo">No mapa</span></div>' +
      '<h3 class="loja__nome">' + esc(l.apelido) + "</h3>" +
      '<p class="loja__status" data-status="' + esc(l.id) + '">' + htmlStatus(l) + "</p>" +
      '<a class="loja__nota" href="' + esc(linkMaps(l)) + '" target="_blank" rel="noopener" aria-label="Nota ' + fmtNota(l.nota) + " de 5 no Google com " + l.avaliacoes + ' avaliações (abre o Google Maps)">' +
      '<span class="loja__nota-num">' + fmtNota(l.nota) + "</span>" + estrelas(l.nota) + "<span>" + fmtInt(l.avaliacoes) + " avaliações no Google</span></a>" +
      '<address class="loja__endereco">' + enderecoLoja(l) + "</address>" +
      (tabela ? '<dl class="loja__horarios">' + tabela + "</dl>" : '<p class="loja__endereco">Horários: consulte pelo WhatsApp' + pend("Horários") + "</p>") +
      '<p class="loja__whats">WhatsApp: <a href="' + esc(linkWhats(mensagemLoja(l), l.whatsapp)) + '" target="_blank" rel="noopener">' + esc(numWhats) + "</a>" +
      (ok(l.whatsappObs) ? ' <span class="obs">(' + esc(l.whatsappObs) + ")</span>" : "") + "</p>" +
      (ok(l.trechoAvaliacao) ? '<blockquote class="loja__trecho"><p>“' + esc(l.trechoAvaliacao) + '”</p><footer>Avaliação no Google</footer></blockquote>' : "") +
      '<div class="loja__botoes">' +
      '<a class="btn btn--whats" href="' + esc(linkWhats(mensagemLoja(l), l.whatsapp)) + '" target="_blank" rel="noopener" aria-label="WhatsApp da unidade ' + esc(l.apelido) + '">' + icone("whats", "icone icone--btn") + "WhatsApp</a>" +
      '<a class="btn btn--contorno" href="' + esc(linkRota(l)) + '" target="_blank" rel="noopener" aria-label="Como chegar à unidade ' + esc(l.apelido) + ' (abre o Google Maps)">Como chegar</a>' +
      "</div>" +
      '<button type="button" class="loja__ver-mapa" data-mapa="' + esc(l.id) + '">Ver esta loja no mapa</button>' +
      "</li>";
  }).join("");

  /* ---- mapa com abas ---- */
  var lojaNoMapa = null;
  $("#mapa-abas").innerHTML = lojas.map(function (l, i) {
    return '<button type="button" role="tab" class="mapa__aba" id="aba-' + esc(l.id) + '" data-aba="' + esc(l.id) + '" aria-controls="mapa-area" aria-selected="false" tabindex="-1">' + esc(l.apelido) + "</button>";
  }).join("");
  function mostrarNoMapa(id, focar) {
    var l = lojaPorId[id];
    if (!l) return;
    lojaNoMapa = id;
    $$(".mapa__aba").forEach(function (b) {
      var sel = b.getAttribute("data-aba") === id;
      b.setAttribute("aria-selected", String(sel));
      b.tabIndex = sel ? 0 : -1;
      if (sel && focar) b.focus();
    });
    $$(".loja").forEach(function (c) { c.classList.toggle("loja--ativa", c.getAttribute("data-loja") === id); });
    $("#mapa-area").setAttribute("aria-labelledby", "aba-" + id);
    var iframe = $("#mapa-iframe");
    iframe.title = "Mapa da " + l.nome;
    iframe.src = linkMapaEmbutido(l);
    $("#mapa-cartao").innerHTML =
      "<div><strong>" + esc(ok(l.endereco) ? l.endereco : l.nome) + "</strong>" +
      "<span>" + esc(ok(l.enderecoMapa) ? l.enderecoMapa : cidadeLoja(l)) + "</span></div>" +
      '<a class="mapa__icone" href="' + esc(linkMaps(l)) + '" target="_blank" rel="noopener" aria-label="Abrir ' + esc(l.nome) + ' no Google Maps">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg></a>' +
      '<a class="mapa__icone" href="' + esc(linkRota(l)) + '" target="_blank" rel="noopener" aria-label="Traçar rota até ' + esc(l.nome) + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m21.7 11.3-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg></a>';
  }
  $("#mapa-abas").addEventListener("click", function (e) {
    var b = e.target.closest("[data-aba]");
    if (b) mostrarNoMapa(b.getAttribute("data-aba"));
  });
  $("#mapa-abas").addEventListener("keydown", function (e) {
    var ids = lojas.map(function (l) { return l.id; }), i = ids.indexOf(lojaNoMapa);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      mostrarNoMapa(ids[(i + (e.key === "ArrowRight" ? 1 : ids.length - 1)) % ids.length], true);
    }
  });
  $("#lista-lojas").addEventListener("click", function (e) {
    var b = e.target.closest("[data-mapa]");
    if (!b) return;
    mostrarNoMapa(b.getAttribute("data-mapa"));
    $("#mapa").scrollIntoView({ behavior: "smooth", block: "center" });
    $('[data-aba="' + b.getAttribute("data-mapa") + '"]').focus({ preventScroll: true });
  });
  if (lojas.length) mostrarNoMapa(lojas[0].id);
  setInterval(atualizarStatus, 60000);

  /* ----------------------------- depoimentos ----------------------------- */
  $("#lista-depoimentos").innerHTML = (C.depoimentos || []).filter(function (d) { return ok(d.texto); }).map(function (d) {
    var l = lojaPorId[d.loja];
    return '<li class="depoimento"><blockquote>' +
      '<span class="depoimento__aspas" aria-hidden="true">“</span>' +
      "<p>" + esc(d.texto) + "</p>" +
      "<footer><strong>Avaliação no Google</strong>" +
      (l ? " · " + esc(l.nome) : "") +
      '<br><span class="obs">Consultado em ' + esc(dataConsulta) + "</span></footer>" +
      "</blockquote></li>";
  }).join("");

  /* -------------------------------- FAQ -------------------------------- */
  $("#lista-faq").innerHTML = C.faq.filter(function (f) { return ok(f.pergunta) && ok(f.resposta); }).map(function (f) {
    return '<details class="faq__item"><summary>' + esc(f.pergunta) + "</summary><p>" + esc(f.resposta) + "</p></details>";
  }).join("");

  /* ------------------------------ contato ------------------------------ */
  var apelidos = lojas.map(function (l) {
    return l.apelido + (ok(l.cidade) && l.cidade !== l.apelido ? " (" + l.cidade + ")" : "");
  });
  $("#area-atendida").innerHTML = ok(C.empresa.areaAtendida)
    ? "<strong>Área atendida:</strong> " + esc(C.empresa.areaAtendida)
    : "<strong>Onde estamos:</strong> unidades em " + esc(listaPt(apelidos)) + "." + pend("Área atendida");
  $("#contato-lojas").innerHTML = lojas.map(function (l) {
    var numWhats = ok(l.whatsappExibicao) ? l.whatsappExibicao : C.whatsapp.exibicao;
    return '<li class="contato__loja"><h3>' + esc(l.nome) + "</h3>" +
      '<p data-status="' + esc(l.id) + '">' + htmlStatus(l) + "</p>" +
      '<p><a href="' + esc(linkWhats(mensagemLoja(l), l.whatsapp)) + '" target="_blank" rel="noopener">' + icone("whats") + "WhatsApp " + esc(numWhats) + "</a>" +
      (ok(l.whatsappObs) ? ' <span class="obs">(' + esc(l.whatsappObs) + ")</span>" : "") + "</p>" +
      (ok(l.telefone) ? '<p><a href="' + linkTel(l.telefone) + '">' + icone("telefone") + "Ligar " + esc(l.telefone) + "</a></p>" : "") +
      '<p><a href="' + esc(linkRota(l)) + '" target="_blank" rel="noopener">' + icone("pino") + "Como chegar</a></p></li>";
  }).join("");

  /* ------------------------------- rodapé ------------------------------- */
  $("#rodape-lojas").innerHTML = lojas.map(function (l) {
    return '<li><a href="#loja-' + esc(l.id) + '">' + esc(l.nome) + "</a>" +
      (ok(l.telefone) ? '<br><a href="' + linkTel(l.telefone) + '">' + esc(l.telefone) + "</a>" : "") + "</li>";
  }).join("");
  $("#rodape-nota").textContent = "Notas e avaliações: Google, consulta em " + dataConsulta + ". " + (C.marcas.aviso || "") +
    (ok(C.empresa.cnpj) ? " CNPJ " + C.empresa.cnpj + "." : "");
  $("#ano").textContent = new Date().getFullYear();

  /* ------------------------------ menu mobile ------------------------------ */
  var topo = $("#topo");
  var btnMenu = $(".topo__menu-btn");
  function menu(abrir) {
    topo.classList.toggle("topo--aberto", abrir);
    btnMenu.setAttribute("aria-expanded", String(abrir));
  }
  btnMenu.addEventListener("click", function () { menu(btnMenu.getAttribute("aria-expanded") !== "true"); });
  $("#menu-principal").addEventListener("click", function (e) { if (e.target.closest("a")) menu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && topo.classList.contains("topo--aberto")) { menu(false); btnMenu.focus(); }
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) menu(false); });
  window.addEventListener("scroll", function () { topo.classList.toggle("topo--rolado", window.scrollY > 10); }, { passive: true });

  /* ---------------- botão flutuante: some sobre outros botões de WhatsApp --------------- */
  var fab = $("#whats-flutuante");
  if ("IntersectionObserver" in window) {
    var visiveisAlvos = new Set();
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) visiveisAlvos.add(en.target); else visiveisAlvos.delete(en.target); });
      fab.classList.toggle("whats-flutuante--oculto", visiveisAlvos.size > 0);
    });
    [".hero__acoes", "#contato .btn--primario", ".rodape"].forEach(function (s) { var el = $(s); if (el) io.observe(el); });
  }

  /* ------------------- dados estruturados (schema.org) ------------------- */
  var base = new URL("./", location.href).href.split("#")[0].split("?")[0];
  function abs(p) { try { return new URL(p, base).href; } catch (e) { return p; } }
  var grafo = [{
    "@type": "Organization",
    "@id": base + "#empresa",
    name: C.empresa.nome,
    url: base,
    logo: abs(C.logo.fundoClaro)
  }];
  if (ok(C.empresa.cnpj)) grafo[0].taxID = C.empresa.cnpj;
  lojas.forEach(function (l) {
    var n = {
      "@type": "AutoPartsStore",
      "@id": base + "#loja-" + l.id,
      name: l.nome,
      url: base + "#loja-" + l.id,
      image: abs("assets/img/og-imagem.png"),
      parentOrganization: { "@id": base + "#empresa" },
      brand: { "@type": "Brand", name: C.empresa.nome }
    };
    var telLD = ok(l.telefone) ? l.telefone : l.whatsappExibicao;
    if (ok(telLD)) n.telephone = "+55-" + so_digitos(telLD).replace(/^(\d{2})(\d+)(\d{4})$/, "$1-$2-$3");
    var end = { "@type": "PostalAddress", addressCountry: "BR" };
    if (ok(l.endereco)) end.streetAddress = l.endereco;
    if (ok(l.cidade)) end.addressLocality = l.cidade;
    if (ok(l.uf)) end.addressRegion = l.uf;
    if (ok(l.cep)) end.postalCode = l.cep;
    n.address = end;
    if (ok(l.linkMaps)) n.hasMap = l.linkMaps;
    var DIAS_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var horas = (Array.isArray(l.horarios) ? l.horarios : []).filter(function (h) { return h.dias && h.abre && h.fecha && !h.fechado; });
    if (horas.length) n.openingHoursSpecification = horas.map(function (h) {
      return { "@type": "OpeningHoursSpecification", dayOfWeek: h.dias.map(function (d) { return DIAS_SCHEMA[d]; }), opens: h.abre, closes: h.fecha };
    });
    grafo.push(n);
  });
  var ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": grafo });
  document.head.appendChild(ld);

  /* --------------------------- modo revisão --------------------------- */
  if (revisao) {
    var faltam = [];
    (function varre(o, p) {
      if (typeof o === "string") { if (o.indexOf(PENDENTE) !== -1) faltam.push(p); return; }
      if (o && typeof o === "object") Object.keys(o).forEach(function (k) { varre(o[k], p ? p + "." + k : k); });
    })(C, "");
    var semFoto = P.itens.filter(function (it) { return ehAntesDepois(it) ? !(ok(it.antes) && ok(it.depois)) : !ok(it.foto); }).length;
    var painel = document.createElement("aside");
    painel.className = "painel-revisao";
    painel.setAttribute("aria-label", "Modo revisão");
    painel.innerHTML = "<strong>Modo revisão</strong> — " + faltam.length + " dados “[a confirmar]” e " + semFoto +
      " fotos ilustrativas.<details><summary>Ver lista</summary><ul>" +
      faltam.map(function (f) { return "<li><code>" + esc(f) + "</code></li>"; }).join("") + "</ul></details>";
    document.body.appendChild(painel);
  }
})();
