/* =====================================================================
   CARDOSO BATERIAS — CONTEÚDO DO SITE
   ---------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para mudar textos,
   lojas, serviços, fotos, depoimentos e perguntas frequentes.

   Regras rápidas:
   • Mantenha as aspas "..." e as vírgulas no fim de cada linha.
   • Tudo que estiver como "[a confirmar]" NÃO aparece no site
     (o site mostra uma alternativa, como "fale pelo WhatsApp").
     Quando tiver o dado real, é só substituir o texto.
   • Para ver no site o que ainda falta confirmar, abra o endereço
     com ?revisao=1 no final (ex.: .../index.html?revisao=1).
   • Fotos: coloque o arquivo em assets/fotos/ e escreva o caminho,
     ex.: "assets/fotos/instalacao-01.jpg". Deixe "" para usar o
     marcador "Foto ilustrativa — substituir".
   • Depois de editar, aumente o número de versão (?v=...) no
     index.html para os visitantes não verem a versão antiga em cache.
   ===================================================================== */

window.CONTEUDO = {

  /* ------------------------- EMPRESA ------------------------- */
  empresa: {
    nome: "Cardoso Baterias",
    cnpj: "[a confirmar]",
    anoFundacao: "[a confirmar]",
    // Link da loja virtual. Deixe "" para esconder o botão.
    lojaVirtual: "",
    instagram: "[a confirmar]",   // ex.: "https://instagram.com/cardosobaterias"
    facebook: "[a confirmar]",
    email: "[a confirmar]",
    // Área atendida (bairros/cidades). Enquanto estiver "[a confirmar]",
    // o site mostra apenas as regiões das unidades.
    areaAtendida: "[a confirmar]"
  },

  /* --------------------------- LOGO --------------------------- */
  // Logo oficial. O arquivo original enviado está em assets/img/logo-original.png.
  // Para trocar por uma versão em melhor resolução, gere a de fundo escuro com
  // ferramentas/logo-fundo-escuro.html e substitua os arquivos abaixo.
  logo: {
    fundoClaro: "assets/img/logo.png",
    fundoEscuro: "assets/img/logo-fundo-escuro.png",
    alt: "Cardoso Baterias"
  },

  /* ------------------------- WHATSAPP ------------------------- */
  whatsapp: {
    numero: "5511962986718",          // só números: 55 + DDD + número
    exibicao: "(11) 96298-6718",
    mensagemPadrao: "Olá! Vim pelo site da Cardoso Baterias e gostaria de um orçamento. Meu veículo é [marca/modelo/ano]."
  },

  /* ------------------ FONTE DAS AVALIAÇÕES ------------------- */
  google: {
    dataConsulta: "05/10/2026",
    // Link usado no selo de avaliação do topo (busca no Google Maps).
    buscaMaps: "Cardoso Baterias"
  },

  /* ---------------------- FAIXA QUE ROLA NO TOPO ---------------------- */
  // A nota do Google e o total de avaliações entram automaticamente.
  faixa: [
    "Especialistas em baterias e geradores",
    "Entrega rápida e instalação",
    "Instalação na hora",
    "Teste de bateria e alternador",
    "Moura · Heliar · Bosch · Zetta · Pioneiro",
    "Embu-Guaçu · Cipó · Jardim Ângela"
  ],

  /* --------------------------- TOPO --------------------------- */
  hero: {
    selo: "Especialistas em baterias e geradores",
    titulo: "Bateria nova,",
    tituloDestaque: "instalação na hora.",
    texto: "Entrega rápida e instalação, com teste de bateria e alternador. Lojas em Embu-Guaçu, Jd. Ângela e Cipó.",
    botao: "Pedir orçamento no WhatsApp",
    imagem: "",  // foto de fundo opcional, ex.: "assets/fotos/hero.jpg"
    // Ilustração do raio. Se o arquivo não existir, o site usa o raio desenhado em código.
    // Para usar uma imagem, salve em assets/img/ e escreva o caminho, ex.: "assets/img/raio-transparente.webp".
    imagemRaio: "assets/img/raio-transparente.webp",
    imagemRaioCelular: "assets/img/raio-transparente-520.webp"   // versão menor, carregada em telas pequenas
  },

  /* --------------------------- SOBRE -------------------------- */
  sobre: {
    titulo: "Quem somos",
    // Vídeo de destaque (opcional). Preencha UM: "video" (arquivo em assets/videos/),
    // "youtube" (link do vídeo) ou "instagram" (link do Reel). "capa" é a imagem antes do play.
    video: { titulo: "", video: "", youtube: "", instagram: "", capa: "" },
    paragrafos: [
      "A Cardoso Baterias é especialista em baterias e geradores, com lojas em Embu-Guaçu, no Jardim Ângela e no Cipó. Fazemos entrega rápida e instalação.",
      "Antes de trocar, a gente testa: a bateria e o alternador são verificados para indicar a solução certa para o seu veículo — sem empurrar peça desnecessária. Trabalhamos com marcas reconhecidas e fazemos a instalação na hora."
    ],
    diferenciais: [
      { icone: "teste",      titulo: "Teste de bateria e alternador", texto: "Diagnóstico antes da troca para saber se o problema é mesmo a bateria." },
      { icone: "ferramenta", titulo: "Instalação na hora",            texto: "Você sai com a bateria nova instalada e o carro funcionando." },
      { icone: "entrega",    titulo: "Entrega rápida",                texto: "Levamos a bateria até você. Consulte o horário de entregas da sua unidade." },
      { icone: "loja",       titulo: "Várias unidades",               texto: "Três lojas para você escolher a mais perto: Embu-Guaçu, Cipó e Jardim Ângela." }
    ]
  },

  /* ------------------------- SERVIÇOS ------------------------- */
  // "mensagem" é o texto que já vai preenchido no WhatsApp.
  servicos: [
    {
      icone: "bateria",
      titulo: "Troca de bateria",
      texto: "Bateria nova com a amperagem certa para o seu veículo.",
      mensagem: "Olá! Vim pelo site da Cardoso Baterias e gostaria de um orçamento para TROCA DE BATERIA. Meu veículo é [marca/modelo/ano]."
    },
    {
      icone: "ferramenta",
      titulo: "Instalação",
      texto: "Instalação feita na hora, com cuidado com a parte elétrica do carro.",
      mensagem: "Olá! Vim pelo site da Cardoso Baterias e gostaria de agendar uma INSTALAÇÃO DE BATERIA. Meu veículo é [marca/modelo/ano]."
    },
    {
      icone: "teste",
      titulo: "Teste de bateria e alternador",
      texto: "Descubra se o problema é a bateria, o alternador ou outro ponto antes de gastar.",
      mensagem: "Olá! Vim pelo site da Cardoso Baterias e gostaria de agendar um TESTE DE BATERIA E ALTERNADOR. Meu veículo é [marca/modelo/ano]."
    },
    {
      icone: "entrega",
      titulo: "Entrega rápida",
      texto: "Entregamos a bateria e fazemos a instalação. Consulte o horário de entregas da unidade mais perto.",
      mensagem: "Olá! Vim pelo site da Cardoso Baterias e gostaria de pedir uma ENTREGA DE BATERIA. Meu veículo é [marca/modelo/ano] e estou no bairro [bairro]."
    },
    {
      icone: "gerador",
      titulo: "Baterias e geradores",
      texto: "Também somos especialistas em geradores. Fale com a gente para saber mais.",
      mensagem: "Olá! Vim pelo site da Cardoso Baterias e gostaria de informações sobre GERADORES."
    },
    {
      icone: "conversa",
      titulo: "Atendimento e orientação",
      texto: "Tire dúvidas sobre a bateria ideal, sinais de desgaste e cuidados.",
      mensagem: "Olá! Vim pelo site da Cardoso Baterias e gostaria de uma orientação sobre a bateria do meu carro. Meu veículo é [marca/modelo/ano]."
    }
  ],

  /* -------------------------- MARCAS -------------------------- */
  // NÃO coloque logotipos ou fotos oficiais sem autorização do fabricante.
  // Quando tiver a autorização: salve a imagem em assets/marcas/, preencha
  // "imagem" e mude "imagemAutorizada" para true.
  marcas: {
    titulo: "Marcas que trabalhamos",
    texto: "Trabalhamos com marcas reconhecidas no mercado. Consulte a disponibilidade para o seu veículo.",
    lista: [
      { nome: "Moura",    imagem: "", imagemAutorizada: false },
      { nome: "Heliar",   imagem: "", imagemAutorizada: false },
      { nome: "Bosch",    imagem: "", imagemAutorizada: false },
      { nome: "Zetta",    imagem: "", imagemAutorizada: false },
      { nome: "Pioneiro", imagem: "", imagemAutorizada: false }
    ],
    aviso: "As marcas citadas pertencem aos seus respectivos fabricantes."
  },

  /* ------------------- PORTFÓLIO / TRABALHOS ------------------- */
  // categoria: use um dos "id" de categorias.
  // Foto simples: preencha "foto".
  // Antes e depois: preencha "antes" e "depois" (deixe "foto" vazio).
  // Deixe vazio ("") para mostrar o marcador "Foto ilustrativa — substituir".
  // Vídeo: use tipo: "video" e preencha "video" (arquivo .mp4 em assets/videos/),
  // "youtube" ou "instagram" (link), e opcionalmente "capa" (imagem) e vertical: true.
  portfolio: {
    titulo: "Trabalhos realizados",
    texto: "Alguns dos serviços feitos nas nossas lojas.",
    categorias: [
      { id: "instalacoes", nome: "Instalações" },
      { id: "testes",      nome: "Testes" },
      { id: "loja",        nome: "Loja" },
      { id: "frota",       nome: "Frota/utilitários" }
    ],
    itens: [
      { categoria: "instalacoes", titulo: "Troca de bateria — antes e depois", descricao: "Bateria antiga substituída e terminais limpos.", foto: "", antes: "", depois: "", alt: "", tipo: "antesDepois" },
      { categoria: "instalacoes", titulo: "Instalação de bateria em carro de passeio", descricao: "Instalação feita na hora, na loja.", foto: "", alt: "" },
      { categoria: "testes",      titulo: "Teste de bateria", descricao: "Medição da carga e da saúde da bateria.", foto: "", alt: "" },
      { categoria: "testes",      titulo: "Teste do alternador", descricao: "Verificação do sistema de carga com o motor ligado.", foto: "", alt: "" },
      { categoria: "loja",        titulo: "Nossa loja", descricao: "Fachada de uma das unidades.", foto: "", alt: "" },
      { categoria: "loja",        titulo: "Estoque de baterias", descricao: "Baterias de várias marcas e amperagens.", foto: "", alt: "" },
      { categoria: "frota",       titulo: "Bateria de utilitário", descricao: "Troca em veículo de trabalho.", foto: "", alt: "" },
      { categoria: "frota",       titulo: "Utilitário — antes e depois", descricao: "Compartimento da bateria antes e depois do serviço.", foto: "", antes: "", depois: "", alt: "", tipo: "antesDepois" }
    ]
  },

  /* --------------------- SEÇÃO "NOSSAS LOJAS" --------------------- */
  lojasSecao: {
    titulo: "3 lojas para te atender.",
    texto: "Horários podem mudar em feriados. Na dúvida, chame no WhatsApp."
  },

  /* --------------------------- LOJAS --------------------------- */
  // nota/avaliacoes: copie do Google e atualize "google.dataConsulta".
  // whatsapp: só números (55 + DDD + número). Se "[a confirmar]",
  // o botão usa o WhatsApp principal mencionando a unidade.
  // whatsappObs: texto pequeno ao lado do número (ex.: "central").
  // horarios: cada linha da tabela de horários.
  //   • dias: 0=domingo, 1=segunda ... 6=sábado (usado para mostrar "Aberta até 18h").
  //   • abre/fecha: "08:00", "18:30"...   • fechado: true para dias sem expediente.
  //   • texto: horário só para exibir (ex.: feriados, entregas), sem entrar no cálculo.
  //   • destaque: true deixa o horário em laranja (ex.: entregas).
  // enderecoMapa: endereço completo usado no mapa e no "Como chegar".
  lojas: [
    {
      id: "embu-guacu",
      nome: "Cardoso Baterias Embu-Guaçu",
      apelido: "Embu-Guaçu",
      endereco: "Rua Emília Pires, 450",
      bairro: "",
      cidade: "Embu-Guaçu",
      uf: "SP",
      cep: "[a confirmar]",
      telefone: "(11) 96298-6718",
      whatsapp: "5511962986718",
      whatsappExibicao: "(11) 96298-6718",
      whatsappObs: "",
      horarios: [
        { rotulo: "Segunda a sexta", dias: [1, 2, 3, 4, 5], abre: "08:00", fecha: "18:00" },
        { rotulo: "Sábado", dias: [6], abre: "08:00", fecha: "15:00" },
        { rotulo: "Domingo", dias: [0], fechado: true },
        { rotulo: "Feriados", texto: "09h às 13h" },
        { rotulo: "Entregas", texto: "09h às 17h", destaque: true }
      ],
      nota: 4.9,
      avaliacoes: 214,
      trechoAvaliacao: "Baterias e pneus \"remold\". Ótimo atendimento, bons preços!",
      enderecoMapa: "Rua Emília Pires, 450 - Embu-Guaçu - SP",
      buscaMaps: "Cardoso Baterias Embu-Guaçu",
      linkMaps: ""                     // opcional: link exato da loja no Google Maps
    },
    {
      id: "cipo",
      nome: "Cardoso Baterias Cipó",
      apelido: "Cipó",
      endereco: "Rua Benedito Jandiro Soares, 216",
      bairro: "Cipó",
      cidade: "Embu-Guaçu",
      uf: "SP",
      cep: "[a confirmar]",
      telefone: "[a confirmar]",
      whatsapp: "5511962986718",
      whatsappExibicao: "(11) 96298-6718",
      whatsappObs: "central",
      horarios: [
        { rotulo: "Segunda a sexta", dias: [1, 2, 3, 4, 5], abre: "08:30", fecha: "18:00" },
        { rotulo: "Sábado", dias: [6], abre: "08:30", fecha: "16:00" },
        { rotulo: "Domingo", dias: [0], fechado: true }
      ],
      nota: 5.0,
      avaliacoes: 16,
      trechoAvaliacao: "Já trocamos baterias dos nossos carros.",
      enderecoMapa: "Rua Benedito Jandiro Soares, 216 - Cipó, Embu-Guaçu - SP",
      buscaMaps: "Cardoso Baterias Cipó",
      linkMaps: ""
    },
    {
      id: "jardim-angela",
      nome: "Cardoso Baterias Jardim Ângela",
      apelido: "Jardim Ângela",
      endereco: "Av. Comendador Sant'Anna, 11",
      bairro: "Capão Redondo",
      cidade: "São Paulo",
      uf: "SP",
      cep: "[a confirmar]",            // o Google Maps indica 05866-000
      telefone: "(11) 96260-4092",
      whatsapp: "5511962604092",
      whatsappExibicao: "(11) 96260-4092",
      whatsappObs: "",
      horarios: [
        { rotulo: "Segunda a sexta", dias: [1, 2, 3, 4, 5], abre: "08:00", fecha: "18:00" },
        { rotulo: "Sábado", dias: [6], abre: "08:00", fecha: "16:00" },
        { rotulo: "Domingo", dias: [0], fechado: true },
        { rotulo: "Entregas", texto: "09h às 17h", destaque: true }
      ],
      nota: 4.9,
      avaliacoes: 94,
      trechoAvaliacao: "Troquei minha bateria no início do mês, fui muito bem atendido.",
      enderecoMapa: "Av. Comendador Sant'Anna, 11 - Capão Redondo, São Paulo - SP",
      buscaMaps: "Cardoso Baterias Jardim Ângela São Paulo SP",
      linkMaps: ""
    }
  ],

  /* ------------------------ DEPOIMENTOS ------------------------ */
  // Trechos reais de avaliações públicas no Google.
  // "loja" deve ser o "id" de uma das lojas acima.
  depoimentos: [
    { texto: "Baterias e pneus \"remold\". Ótimo atendimento, bons preços!", loja: "embu-guacu", nota: "" },
    { texto: "Troquei minha bateria no início do mês, fui muito bem atendido.", loja: "jardim-angela", nota: "" },
    { texto: "Já trocamos baterias dos nossos carros.", loja: "cipo", nota: "" }
  ],

  /* --------------------- PERGUNTAS FREQUENTES --------------------- */
  faq: [
    {
      pergunta: "Vocês instalam a bateria na hora?",
      resposta: "Sim. Você compra e a gente já faz a instalação na loja."
    },
    {
      pergunta: "Como sei se o problema é a bateria ou o alternador?",
      resposta: "Fazemos o teste da bateria e do alternador na loja. Assim você só troca o que realmente precisa."
    },
    {
      pergunta: "Quais marcas de bateria vocês trabalham?",
      resposta: "Moura, Heliar, Bosch, Zetta e Pioneiro. A disponibilidade varia conforme o modelo do veículo — consulte pelo WhatsApp."
    },
    {
      pergunta: "Vocês fazem entrega?",
      resposta: "Sim, fazemos entrega rápida e instalação. As entregas saem das unidades de Embu-Guaçu e Jardim Ângela, das 9h às 17h. Chame no WhatsApp com o seu endereço."
    },
    {
      pergunta: "Vocês trabalham com geradores?",
      resposta: "Sim, somos especialistas em baterias e geradores. Fale com a gente pelo WhatsApp para saber mais."
    },
    {
      pergunta: "Quanto custa uma bateria nova?",
      resposta: "Depende do veículo e da bateria indicada. Mande a marca, o modelo e o ano do carro pelo WhatsApp e receba o orçamento."
    },
    {
      pergunta: "Qual unidade fica mais perto de mim?",
      resposta: "Temos lojas em Embu-Guaçu, no Cipó e no Jardim Ângela (São Paulo - SP). Use o botão “Como chegar” de cada unidade para traçar a rota."
    }
  ],

  /* -------------------------- CONTATO -------------------------- */
  contato: {
    titulo: "Fale com a gente",
    texto: "Entre em contato e solicite seu orçamento. Mande a marca, o modelo e o ano do seu veículo pelo WhatsApp."
  }
};
