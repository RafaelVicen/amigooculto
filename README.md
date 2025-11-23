# 🎄 Amigo Secreto Criptografado (AES) 🔒

Um sistema simples e seguro para sorteio de **Amigo Secreto** (*Secret Santa*) para grupos de família e amigos. Este projeto roda 100% no navegador (*Client-Side*) e utiliza criptografia de nível industrial para garantir que ninguém descubra os resultados antes da hora, mesmo inspecionando o código.

---

## ✨ Funcionalidades Principais

* **Segurança Avançada:** Utiliza o algoritmo **AES-256** (Advanced Encryption Standard) para criptografar os resultados.
* **Chave Única:** A senha do participante atua como a chave de descriptografia para o seu resultado.
* **Independente:** Não requer *backend*, servidor ou banco de dados. Pode ser hospedado gratuitamente no Netlify Drop ou GitHub Pages.
* **Interface Amigável:** Design simples onde o participante clica no seu nome e insere sua chave.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função |
| :--- | :--- |
| **HTML5** | Estrutura da página. |
| **CSS3** | Estilização temática (Natalina). |
| **JavaScript (ES6+)** | Lógica do sistema e interação. |
| **CryptoJS** | Biblioteca para realizar a Criptografia AES (via CDN). |

---

## 🔑 Segurança e Criptografia (AES)

O sistema utiliza **Criptografia Simétrica AES**. O nome do amigo secreto é "trancado" matematicamente e a **senha individual é a única chave** que pode destrancar o resultado.

Isso garante que, mesmo que um usuário mal-intencionado veja o código fonte (`U2FsdGVkX1...`), ele não conseguirá decifrar o nome sem ter a chave exata daquela pessoa.



[Image of AES encryption decryption process diagram]


* **Vulnerabilidade:** A única vulnerabilidade deste sistema são as **senhas de 4 dígitos**. Recomendamos usar **senhas de palavras** (ex: `presente-feliz`) em vez de números para proteção máxima contra *scripts* de força bruta.

---

## 🚀 Configuração e Deploy

### 1. Preparação dos Arquivos

Crie os 3 arquivos essenciais (`index.html`, `style.css`, `script.js`) na raiz do seu projeto.

### 2. Gerar a Lista Criptografada (Crucial)

Você deve rodar o arquivo **`gerador.html`** (que **não** deve ser enviado para o GitHub) para criar a lista de dados trancados.

1.  **Edite** o código dentro do `gerador.html` com os nomes e as senhas.
2.  Abra o `gerador.html` no seu navegador.
3.  **Copie** o array criptografado que aparecer na caixa de texto.

### 3. Inserir Dados e Finalizar o Código

**A. Atualizar `index.html`:** Adicione o link para o **CryptoJS** dentro do `<head>`:

```html
<head>
    <link rel="stylesheet" href="style.css">
    
    <script src="[https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js](https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js)"></script>
</head>
