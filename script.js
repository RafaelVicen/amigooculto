// ===============================================
// VARIÁVEIS GLOBAIS E CHAVES DE ARMAZENAMENTO
// ===============================================

// Configurações do aplicativo
const CONFIG = {
  MIN_PARTICIPANTES: 4,
  MAX_PARTICIPANTES: 20,
  MAX_NOME_LENGTH: 25,
  MIN_SENHA_LENGTH: 8,
  USERS_STORAGE_KEY: "aes_secret_santa_users_v3", // Atualizado para v3 devido a mudanças
  CHAVE_COMPARTILHADA: "chave_publica_app_v1",
};

// Chave onde os dados de todas as contas (usuário/hash) serão salvos no localStorage
const USERS_STORAGE_KEY = CONFIG.USERS_STORAGE_KEY;
let currentUsername = null;
let bloqueadoSorteio = false;

let participantes = []; // Armazena os objetos {nome, segredo} criptografados
let usuarioAtual = null; // Usado para a revelação no modal

// ===============================================
// 1. FUNÇÕES DE CRIPTOGRAFIA E ACESSO
// ===============================================

// Sanitizar input para prevenir XSS
function sanitizarInput(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// HASH da senha com salt para NUNCA armazenar a senha em texto simples
function gerarSalt() {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

function hashComSalt(senha, salt) {
  return CryptoJS.SHA256(senha + salt).toString();
}

function carregarUtilizadores() {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : {};
}

function salvarUtilizadores(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function salvarSorteioOrganizador(data) {
  if (!currentUsername) return;

  const users = carregarUtilizadores();
  users[currentUsername].drawData = data;
  salvarUtilizadores(users);
}

function trocarTela(telaId) {
  document.getElementById("login-area").classList.add("escondido");
  document.getElementById("register-area").classList.add("escondido");
  document.getElementById("organizer-panel").classList.add("escondido");
  document.getElementById(telaId).classList.remove("escondido");
}

function acessarComoParticipante() {
  document.getElementById("login-area").classList.add("escondido");
  document.getElementById("area-participantes").classList.remove("escondido");

  if (!window.location.hash) {
    document.getElementById("lista-nomes").innerHTML =
      '<p style="text-align:center; color:#d00;">Nenhum link de sorteio encontrado. Cole o link completo do organizador na barra de endereços para carregar.</p>';
    return;
  }

  const dadosDoLink = descodificarDados(window.location.hash);
  if (!dadosDoLink || !dadosDoLink.length) {
    document.getElementById("lista-nomes").innerHTML =
      '<p style="text-align:center; color:#d00;">Link inválido ou corrompido. Peça ao organizador para reenviar.</p>';
    return;
  }

  participantes = dadosDoLink;
  gerarBotoesNomes();
}

function cadastrar() {
  const user = document.getElementById("reg-username").value.trim();
  const pass = document.getElementById("reg-senha").value.trim();
  const erroMsg = document.getElementById("reg-erro");
  erroMsg.innerText = "";
  erroMsg.className = "erro"; // Reset para erro por padrão

  if (user.length < 3) {
    erroMsg.innerText = "Utilizador deve ter no mínimo 3 caracteres.";
    return;
  }
  if (pass.length < CONFIG.MIN_SENHA_LENGTH) {
    erroMsg.innerText = `Senha deve ter no mínimo ${CONFIG.MIN_SENHA_LENGTH} caracteres.`;
    return;
  }
  if (!/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
    erroMsg.innerText =
      "Senha deve conter pelo menos uma MAIÚSCULA e um número.";
    return;
  }

  const users = carregarUtilizadores();
  if (users[user]) {
    erroMsg.innerText = "Utilizador já existe.";
    return;
  }

  const salt = gerarSalt();
  users[user] = {
    passwordHash: hashComSalt(pass, salt),
    salt: salt,
    drawData: null,
  };
  salvarUtilizadores(users);

  // Mostrar mensagem de sucesso
  erroMsg.className = "sucesso";
  erroMsg.innerText = `✅ Conta criada com sucesso para ${user}! Redirecionando para login...`;

  // Limpar campos
  document.getElementById("reg-username").value = "";
  document.getElementById("reg-senha").value = "";

  // Trocar para login após 2 segundos
  setTimeout(() => {
    trocarTela("login-area");
  }, 2000);
}

function fazerLogin() {
  const user = document.getElementById("login-username").value.trim();
  const pass = document.getElementById("login-senha").value.trim();
  const erroMsg = document.getElementById("login-erro");
  erroMsg.innerText = "";

  const users = carregarUtilizadores();

  if (
    !users[user] ||
    users[user].passwordHash !== hashComSalt(pass, users[user].salt)
  ) {
    erroMsg.innerText = "Utilizador ou senha incorretos.";
    return;
  }

  currentUsername = user;
  const userData = users[user];

  participantes = userData.drawData || [];

  if (participantes.length > 0) {
    document.getElementById("output-chaves").classList.remove("escondido");
    document.getElementById("lista-chaves-organizer").innerText =
      JSON.stringify(
        participantes.map((p) => ({ Nome: p.nome, Segredo: p.segredo })),
        null,
        2,
      );
    gerarBotoesNomes();
  }

  trocarTela("organizer-panel");
  document.getElementById("area-participantes").classList.remove("escondido");
}

function fazerLogout() {
  currentUsername = null;
  trocarTela("login-area");
  document.getElementById("area-participantes").classList.add("escondido");
}

// ===============================================
// 4. FUNÇÕES DE SORTEIO E CRIPTOGRAFIA
// (Inalterado)
// ===============================================

function gerarChaveUnica() {
  const array = new Uint8Array(5);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function realizarSorteio(nomes) {
  let tentativas = 0;
  const maxTentativas = 100;

  while (tentativas < maxTentativas) {
    tentativas++;
    let alvos = [...nomes];
    let pairings = {};
    let valido = true;

    // Shuffle usando Fisher-Yates
    for (let i = alvos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alvos[i], alvos[j]] = [alvos[j], alvos[i]];
    }

    // Verificar se ninguém tirou a si mesmo
    for (let i = 0; i < nomes.length; i++) {
      if (nomes[i] === alvos[i]) {
        valido = false;
        break;
      }
      pairings[nomes[i]] = alvos[i];
    }

    if (valido) {
      return nomes.map((nome) => ({
        nome: nome,
        alvo: pairings[nome],
      }));
    }
  }
  return null; // Falhou após maxTentativas
}

function codificarDados(data, chaveCompartilhada = CONFIG.CHAVE_COMPARTILHADA) {
  const jsonString = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(
    jsonString,
    chaveCompartilhada,
  ).toString();
  console.log("Dados codificados:", encrypted.substring(0, 50) + "...");
  return encrypted;
}

function descodificarDados(
  hash,
  chaveCompartilhada = CONFIG.CHAVE_COMPARTILHADA,
) {
  try {
    const dadosEncriptados = hash.substring(1);
    const bytes = CryptoJS.AES.decrypt(dadosEncriptados, chaveCompartilhada);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    return null;
  }
}

// ----------------------------------------------------
// FUNÇÃO INICIAR PROCESSO COM NOVA VALIDAÇÃO
// ----------------------------------------------------
function iniciarProcesso() {
  if (bloqueadoSorteio) return;
  bloqueadoSorteio = true;
  setTimeout(() => {
    bloqueadoSorteio = false;
  }, 1000);

  if (!currentUsername) {
    alert("Erro de segurança: Faça login antes de iniciar o sorteio.");
    fazerLogout();
    return;
  }

  console.log("Usuário logado:", currentUsername);

  const btnSortear = document.querySelector("#organizer-panel button");
  btnSortear.disabled = true;
  btnSortear.innerText = "⏳ Gerando sorteio...";

  setTimeout(() => {
    const inputArea = document.getElementById("nomes-input");
    const nomes = inputArea.value
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const count = nomes.length;

    // 2. VALIDAÇÃO DE NÚMERO DE PARTICIPANTES (4 a 20)
    if (count < CONFIG.MIN_PARTICIPANTES || count > CONFIG.MAX_PARTICIPANTES) {
      alert(
        `O número de participantes deve ser entre ${CONFIG.MIN_PARTICIPANTES} e ${CONFIG.MAX_PARTICIPANTES}.`,
      );
      return;
    }

    // 3. NOVA VALIDAÇÃO: NÚMERO PAR
    if (count % 2 !== 0) {
      alert("O número de participantes deve ser PAR (4, 6, 8, 10, etc.).");
      return;
    }

    // 4. VALIDAÇÃO: Nomes duplicados
    const nomesUnicos = new Set(nomes);
    if (nomesUnicos.size !== nomes.length) {
      alert("Existem nomes duplicados na lista. Remova repetições.");
      return;
    }

    // 5. VALIDAÇÃO: Limite de caracteres (máx 25)
    for (const nome of nomes) {
      if (nome.length > CONFIG.MAX_NOME_LENGTH) {
        alert(
          `Nome "${nome}" ultrapassa ${CONFIG.MAX_NOME_LENGTH} caracteres. Máximo: ${CONFIG.MAX_NOME_LENGTH}.`,
        );
        return;
      }
    }

    const resultadosSorteio = realizarSorteio(nomes);
    if (!resultadosSorteio) {
      alert("Erro ao gerar o sorteio. Tente novamente.");
      return;
    }

    console.log("Sorteio realizado com sucesso:", resultadosSorteio);

    let listaChavesOrganizer = "";
    let novosParticipantesCriptografados = [];
    listaChavesOrganizer +=
      "PARTICIPANTE | CHAVE ÚNICA\n--------------------------------\n";

    resultadosSorteio.forEach((item) => {
      const chave = gerarChaveUnica();

      const alvoCriptografado = CryptoJS.AES.encrypt(
        item.alvo,
        chave,
      ).toString();

      novosParticipantesCriptografados.push({
        nome: item.nome,
        segredo: alvoCriptografado,
      });

      listaChavesOrganizer += `${item.nome}: ${chave}\n`;
    });

    // 1. PERSISTE E INJETA DADOS
    participantes = novosParticipantesCriptografados;
    salvarSorteioOrganizador(participantes);

    // 2. GERA LINK COMPARTILHÁVEL
    const dadosCodificados = codificarDados(participantes);
    const linkCompartilhavel =
      window.location.origin +
      window.location.pathname +
      "#" +
      dadosCodificados;

    // 3. ATUALIZA INTERFACE
    document.getElementById("lista-chaves-organizer").innerText =
      listaChavesOrganizer;
    document.getElementById("output-link").innerText = linkCompartilhavel;
    document.getElementById("link-area").classList.remove("escondido");
    document.getElementById("output-chaves").classList.remove("escondido");

    document.getElementById("area-participantes").classList.remove("escondido");
    gerarBotoesNomes();

    console.log("Interface atualizada. Link:", linkCompartilhavel);
    console.log("Participantes criptografados:", participantes);

    btnSortear.disabled = false;
    btnSortear.innerText = "Sortear e Gerar Chaves";
  }, 500); // Simula delay para UX
}

// ===============================================
// 5. FUNÇÕES DE REVELAÇÃO E INICIALIZAÇÃO
// (Inalterado)
// ===============================================

function gerarBotoesNomes() {
  const containerNomes = document.getElementById("lista-nomes");
  containerNomes.innerHTML = "";

  const participantesOrdenados = [...participantes].sort((a, b) =>
    a.nome.localeCompare(b.nome),
  );

  if (participantesOrdenados.length === 0) {
    containerNomes.innerHTML =
      '<p style="text-align:center; color:#333;">Nenhum sorteio carregado. Use o link do organizador.</p>';
    return;
  }

  participantesOrdenados.forEach((p) => {
    const btn = document.createElement("button");
    btn.textContent = sanitizarInput(p.nome);
    btn.className = "btn-nome";
    btn.onclick = () => abrirModal(p);
    containerNomes.appendChild(btn);
  });
}

const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modal-titulo");
const inputSenha = document.getElementById("input-senha");
const erroMsg = document.getElementById("erro-msg");
const stepSenha = document.getElementById("step-senha");
const stepResultado = document.getElementById("step-resultado");
const nomeAmigo = document.getElementById("nome-amigo-secreto");
const spanClose = document.getElementsByClassName("close")[0];

function abrirModal(participante) {
  usuarioAtual = participante;
  modal.style.display = "block";
  modalTitulo.innerText = "Olá, " + participante.nome;

  stepSenha.classList.remove("escondido");
  stepResultado.classList.add("escondido");
  inputSenha.value = "";
  erroMsg.innerText = "";
}

spanClose.onclick = function () {
  modal.style.display = "none";
  inputSenha.value = "";
  erroMsg.innerText = "";
  inputSenha.style.border = "1px solid #ccc";
  stepSenha.classList.remove("escondido");
  stepResultado.classList.add("escondido");
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    inputSenha.value = "";
    erroMsg.innerText = "";
    inputSenha.style.border = "1px solid #ccc";
    stepSenha.classList.remove("escondido");
    stepResultado.classList.add("escondido");
  }
};

function verificarAmigo() {
  const chaveDigitada = inputSenha.value.trim().toUpperCase();

  if (!chaveDigitada) {
    erroMsg.innerText = "Por favor, insira sua chave secreta.";
    inputSenha.style.border = "2px solid red";
    setTimeout(() => {
      inputSenha.style.border = "1px solid #ccc";
    }, 2000);
    return;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(usuarioAtual.segredo, chaveDigitada);
    const textoRevelado = bytes.toString(CryptoJS.enc.Utf8);

    if (textoRevelado && textoRevelado.length > 0) {
      stepSenha.classList.add("escondido");
      stepResultado.classList.remove("escondido");

      nomeAmigo.innerText = "🥁 Rufem os tambores...";
      setTimeout(() => {
        nomeAmigo.innerText = textoRevelado;
      }, 1000);
    } else {
      throw new Error("Chave incorreta");
    }
  } catch (e) {
    erroMsg.innerText = "Chave secreta incorreta! Tente novamente.";
    inputSenha.style.border = "2px solid red";
    setTimeout(() => {
      inputSenha.style.border = "1px solid #ccc";
    }, 2000);
  }
}

function inicializarAplicacao() {
  if (window.location.hash) {
    const dadosDoLink = descodificarDados(window.location.hash);

    if (dadosDoLink && dadosDoLink.length > 0) {
      participantes = dadosDoLink;
      document
        .getElementById("area-participantes")
        .classList.remove("escondido");
      gerarBotoesNomes();
      document.getElementById("login-area").classList.add("escondido");
      return;
    }

    console.warn("Hash detectado mas dados inválidos ou decodificação falhou.");
    document.getElementById("area-participantes").classList.remove("escondido");
    document.getElementById("login-area").classList.add("escondido");
    document.getElementById("lista-nomes").innerHTML =
      '<p style="text-align:center; color:#d00;">Link inválido ou dados corrompidos. Verifique o link do organizador.</p>';
    return;
  }

  trocarTela("login-area");
}

document.addEventListener("DOMContentLoaded", inicializarAplicacao);
