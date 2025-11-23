// ===============================================
// VARIÁVEIS GLOBAIS E CHAVES DE ARMAZENAMENTO
// ===============================================

// Chave onde os dados de todas as contas (usuário/hash) serão salvos no localStorage
const USERS_STORAGE_KEY = "aes_secret_santa_users_v2";
let currentUsername = null; 

let participantes = []; // Armazena os objetos {nome, segredo} criptografados
let usuarioAtual = null; // Usado para a revelação no modal

// ===============================================
// 1. FUNÇÕES DE CRIPTOGRAFIA E ACESSO
// ===============================================

// HASH da senha para NUNCA armazenar a senha em texto simples
function SHA256Hash(string) {
    return CryptoJS.SHA256(string).toString();
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
    document.getElementById('login-area').classList.add('escondido');
    document.getElementById('register-area').classList.add('escondido');
    document.getElementById('organizer-panel').classList.add('escondido');
    document.getElementById(telaId).classList.remove('escondido');
}

function cadastrar() {
    const user = document.getElementById('reg-username').value.trim();
    const pass = document.getElementById('reg-senha').value.trim();
    const erroMsg = document.getElementById('reg-erro');
    erroMsg.innerText = '';

    if (user.length < 3) {
        erroMsg.innerText = 'Utilizador deve ter no mínimo 3 caracteres.';
        return;
    }
    if (pass.length < 5) {
        erroMsg.innerText = 'Senha deve ter no mínimo 5 caracteres.';
        return;
    }

    const users = carregarUtilizadores();
    if (users[user]) {
        erroMsg.innerText = 'Utilizador já existe.';
        return;
    }

    users[user] = {
        passwordHash: SHA256Hash(pass),
        drawData: null 
    };
    salvarUtilizadores(users);

    alert(`Conta criada com sucesso para ${user}! Faça login.`);
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-senha').value = '';
    trocarTela('login-area');
}

function fazerLogin() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-senha').value.trim();
    const erroMsg = document.getElementById('login-erro');
    erroMsg.innerText = '';

    const users = carregarUtilizadores();

    if (!users[user] || users[user].passwordHash !== SHA256Hash(pass)) {
        erroMsg.innerText = 'Utilizador ou senha incorretos.';
        return;
    }

    currentUsername = user;
    const userData = users[user];

    participantes = userData.drawData || [];

    if (participantes.length > 0) {
        document.getElementById('output-chaves').classList.remove('escondido');
        document.getElementById('lista-chaves-organizer').innerText = JSON.stringify(participantes.map(p => ({Nome: p.nome, Segredo: p.segredo})), null, 2); 
        gerarBotoesNomes();
    }
    
    trocarTela('organizer-panel');
    document.getElementById('area-participantes').classList.remove('escondido'); 
}

function fazerLogout() {
    currentUsername = null;
    trocarTela('login-area');
    document.getElementById('area-participantes').classList.add('escondido');
}


// ===============================================
// 4. FUNÇÕES DE SORTEIO E CRIPTOGRAFIA
// (Inalterado)
// ===============================================

function gerarChaveUnica() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function realizarSorteio(nomes) {
    let sorteio = {};
    let tentativas = 0;
    const maxTentativas = 100;

    while (tentativas < maxTentativas) {
        tentativas++;
        let alvos = [...nomes]; 
        let pairings = {};
        let valido = true;

        for (let i = alvos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [alvos[i], alvos[j]] = [alvos[j], alvos[i]];
        }

        for (let i = 0; i < nomes.length; i++) {
            const doador = nomes[i];
            const alvo = alvos[i];
            if (doador === alvo) {
                valido = false;
                break;
            }
            pairings[doador] = alvo;
        }

        if (valido) {
            return nomes.map(nome => ({
                nome: nome,
                alvo: pairings[nome]
            }));
        }
    }
    return null; 
}

function codificarDados(data) {
    const jsonString = JSON.stringify(data);
    return btoa(jsonString); 
}

function descodificarDados(hash) {
    try {
        const base64Data = hash.substring(1); 
        const jsonString = atob(base64Data); 
        return JSON.parse(jsonString);
    } catch (e) {
        return null;
    }
}

// ----------------------------------------------------
// FUNÇÃO INICIAR PROCESSO COM NOVA VALIDAÇÃO
// ----------------------------------------------------
function iniciarProcesso() {
    if (!currentUsername) {
        alert("Erro de segurança: Faça login antes de iniciar o sorteio.");
        fazerLogout();
        return;
    }

    const inputArea = document.getElementById('nomes-input');
    const nomes = inputArea.value.split('\n').map(n => n.trim()).filter(n => n.length > 0);

    const count = nomes.length;

    // 1. VALIDAÇÃO DE NÚMERO DE PARTICIPANTES (4 a 20)
    if (count < 4 || count > 20) {
        alert('O número de participantes deve ser entre 4 e 20.');
        return;
    }
    
    // 2. NOVA VALIDAÇÃO: NÚMERO PAR
    if (count % 2 !== 0) {
        alert('O número de participantes deve ser PAR (4, 6, 8, 10, etc.).');
        return;
    }

    const resultadosSorteio = realizarSorteio(nomes);
    if (!resultadosSorteio) {
        alert('Erro ao gerar o sorteio. Tente novamente.');
        return;
    }

    let listaChavesOrganizer = '';
    let novosParticipantesCriptografados = []; 
    listaChavesOrganizer += 'PARTICIPANTE | CHAVE ÚNICA\n--------------------------------\n';

    resultadosSorteio.forEach(item => {
        const chave = gerarChaveUnica();
        
        const alvoCriptografado = CryptoJS.AES.encrypt(item.alvo, chave).toString();

        novosParticipantesCriptografados.push({
            nome: item.nome,
            segredo: alvoCriptografado
        });

        listaChavesOrganizer += `${item.nome}: ${chave}\n`; 
    });

    // 1. PERSISTE E INJETA DADOS
    participantes = novosParticipantesCriptografados;
    salvarSorteioOrganizador(participantes);

    // 2. GERA LINK COMPARTILHÁVEL
    const dadosCodificados = codificarDados(participantes);
    const linkCompartilhavel = window.location.origin + window.location.pathname + '#' + dadosCodificados;

    // 3. ATUALIZA INTERFACE
    document.getElementById('lista-chaves-organizer').innerText = listaChavesOrganizer;
    document.getElementById('output-link').innerText = linkCompartilhavel;
    document.getElementById('link-area').classList.remove('escondido');
    document.getElementById('output-chaves').classList.remove('escondido');
    
    document.getElementById('area-participantes').classList.remove('escondido');
    gerarBotoesNomes();
}


// ===============================================
// 5. FUNÇÕES DE REVELAÇÃO E INICIALIZAÇÃO
// (Inalterado)
// ===============================================

function gerarBotoesNomes() {
    const containerNomes = document.getElementById('lista-nomes');
    containerNomes.innerHTML = ''; 
    
    const participantesOrdenados = [...participantes].sort((a, b) => a.nome.localeCompare(b.nome));

    participantesOrdenados.forEach(p => {
        const btn = document.createElement('button');
        btn.innerText = p.nome;
        btn.className = 'btn-nome';
        btn.onclick = () => abrirModal(p); 
        containerNomes.appendChild(btn);
    });
}

const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modal-titulo');
const inputSenha = document.getElementById('input-senha');
const erroMsg = document.getElementById('erro-msg');
const stepSenha = document.getElementById('step-senha');
const stepResultado = document.getElementById('step-resultado');
const nomeAmigo = document.getElementById('nome-amigo-secreto');
const spanClose = document.getElementsByClassName("close")[0];


function abrirModal(participante) {
    usuarioAtual = participante; 
    modal.style.display = "block";
    modalTitulo.innerText = "Olá, " + participante.nome;
    
    stepSenha.classList.remove('escondido');
    stepResultado.classList.add('escondido');
    inputSenha.value = "";
    erroMsg.innerText = "";
}

spanClose.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function verificarAmigo() {
    const chaveDigitada = inputSenha.value.trim();

    try {
        const bytes = CryptoJS.AES.decrypt(usuarioAtual.segredo, chaveDigitada);
        const textoRevelado = bytes.toString(CryptoJS.enc.Utf8);

        if (textoRevelado && textoRevelado.length > 0) {
            stepSenha.classList.add('escondido');
            stepResultado.classList.remove('escondido');
            
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
            document.getElementById('area-participantes').classList.remove('escondido');
            gerarBotoesNomes();
            document.getElementById('login-area').classList.add('escondido');
            return; 
        }
    }
    
    trocarTela('login-area');
}

document.addEventListener('DOMContentLoaded', inicializarAplicacao);