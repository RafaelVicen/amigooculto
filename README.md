# 🎄 Amigo Secreto Criptografado (Client-Side)

Um sistema seguro de Amigo Secreto (Amigo Oculto) desenvolvido inteiramente no lado do cliente (navegador) para garantir a privacidade do sorteio. Utiliza criptografia AES para proteger o nome do presenteado e um modelo de login multi-usuário (persistido localmente) para que vários organizadores possam gerenciar seus sorteios de forma independente.

## ✨ Funcionalidades Principais

- **Login Multi-Organizador (Local com Salt):** Permite que diferentes pessoas usem o mesmo site para criar sorteios separados, com credenciais de login e dados salvos no `localStorage` do navegador do organizador. Senhas são hashed com salt para maior segurança.
- **Segurança Aprimorada:** Criptografia AES-256 para o sorteio, chaves únicas geradas com `crypto.getRandomValues()`, validações robustas e proteção contra XSS.
- **Sorteio Otimizado:** Algoritmo de Fisher-Yates com validação determinística para evitar auto-atribuições.
- **Validações Completas:** Nomes únicos, limite de caracteres (25), senhas fortes (8+ chars, maiúscula + número), número par de participantes.
- **UX Melhorada:** Feedback visual durante sorteio, debounce em botões, limpeza de modal, responsividade mobile.
- **Link Compartilhável Seguro:** Dados criptografados com AES (não apenas base64), protegendo a privacidade mesmo na URL.

## 🛡️ Segurança do Projeto

O projeto utiliza as melhores práticas de segurança Client-Side, incluindo melhorias recentes:

| Aspecto                                  | Nível de Segurança | Protegido Por                                                      |
| :--------------------------------------- | :----------------- | :----------------------------------------------------------------- |
| **Segredo do Sorteio (Quem tirou quem)** | **Alto**           | AES-256 com chave compartilhada (Padrão de segurança de dados)     |
| **Senha do Organizador**                 | **Alto**           | Hashing SHA-256 com salt aleatório (Protege contra rainbow tables) |
| **Chaves Únicas**                        | **Alto**           | `crypto.getRandomValues()` (Entropia criptográfica segura)         |
| **Validações de Input**                  | **Médio/Alto**     | Sanitização XSS, limites de caracteres, validações de unicidade    |
| **Persistência de Dados (Local)**        | **Baixo**          | `localStorage` (Dados não são salvos em nuvem)                     |

> **Atenção:** Embora a criptografia seja profissional, a persistência depende do navegador. Limpeza de cache resulta em perda de dados. Dados na URL são agora criptografados (não base64).

## 🛠️ Tecnologias Utilizadas

- **HTML5**
- **CSS3** (com responsividade mobile)
- **JavaScript (ES6+ puro)**
- **CryptoJS:** Biblioteca para AES-256, SHA-256 e geração de salt.

## 📋 Changelog

### v3.0 (Atual)

- **Segurança:** Adicionado salt ao hashing de senhas, criptografia AES para dados na URL (substituindo base64), chaves únicas com `crypto.getRandomValues()`.
- **Validações:** Nomes únicos obrigatórios, limite de 25 caracteres por nome, senhas fortes (8+ chars, maiúscula + número).
- **UX:** Feedback visual durante sorteio, debounce em botões, limpeza automática do modal, responsividade mobile.
- **Performance:** Algoritmo de sorteio otimizado com Fisher-Yates determinístico.
- **Código:** Configurações centralizadas, sanitização XSS, constantes para limites.

### v2.0

- Sistema multi-usuário com localStorage.
- Criptografia AES-256 para sorteios.
- Link compartilhável com base64.

### v1.0

- Versão inicial com sorteio básico.

## ⚙️ Como Usar

### Para o Organizador

1.  Acesse a URL do site (após a hospedagem).
2.  Clique em **"Crie sua conta"** e cadastre um nome de utilizador e senha.
3.  Faça login no Painel do Organizador.
4.  Insira a lista de participantes, um nome por linha. O número deve ser **par** (entre 4 e 20).
5.  Clique em **"Sortear e Gerar Chaves"**.
6.  **Distribua as Informações:**
    - **Envie o "Link Único Compartilhável"** para todos os participantes.
    - **Envie a "Chave Única"** (encontrada na Lista de Chaves) para o participante correspondente **em privado**.

### Para o Participante

1.  Clique no **Link Único Compartilhável** recebido do organizador.
2.  O site irá carregar a lista de nomes. Clique no **seu nome**.
3.  Insira a **Chave Secreta** que o organizador enviou em privado.
4.  O nome do seu Amigo Secreto será revelado!

## 🌐 Hospedagem (Deployment)

O Netlify é o método mais recomendado para este projeto estático.

### Opção: Netlify

1.  Crie uma conta no Netlify e conecte-a ao seu repositório GitHub.
2.  Inicie a importação do projeto, selecionando o repositório.
3.  Deixe os campos **Build Command** e **Publish Directory** vazios.
4.  Clique em **Deploy Site**. O site será publicado automaticamente no seu endereço Netlify.
