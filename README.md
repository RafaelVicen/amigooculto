# 🎄 Amigo Secreto Criptografado (Client-Side)

Um sistema seguro de Amigo Secreto (Amigo Oculto) desenvolvido inteiramente no lado do cliente (navegador) para garantir a privacidade do sorteio. Utiliza criptografia AES para proteger o nome do presenteado e um modelo de login multi-usuário (persistido localmente) para que vários organizadores possam gerenciar seus sorteios de forma independente.

## ✨ Funcionalidades Principais

* **Login Multi-Organizador (Local):** Permite que diferentes pessoas usem o mesmo site para criar sorteios separados, com credenciais de login e dados salvos no `localStorage` do navegador do organizador.
* **Segurança de Senha:** As senhas dos organizadores são armazenadas usando **Hash SHA-256**, garantindo que as senhas nunca sejam salvas em texto simples.
* **Sorteio Criptografado (AES-256):** O nome do presenteado é criptografado usando o algoritmo AES-256 e uma chave secreta única gerada para cada participante.
* **Link Compartilhável Único:** Após o sorteio, é gerado um URL contendo os dados criptografados. Este link é distribuído aos participantes, permitindo que eles acessem a página de revelação sem precisar de login.
* **Regra de Paridade Flexível:** O sistema só permite sorteios com um número **par** de participantes (mínimo de 4, máximo de 20).
* **Design 100% Client-Side:** Não requer servidor nem base de dados; o site pode ser hospedado de forma gratuita e ilimitada.

## 🛡️ Segurança do Projeto

O projeto utiliza o melhor da segurança Client-Side, mas é importante entender suas limitações:

| Aspecto | Nível de Segurança | Protegido Por |
| :--- | :--- | :--- |
| **Segredo do Sorteio (Quem tirou quem)** | **Alto** | AES-256 (Padrão de segurança de dados) |
| **Senha do Organizador** | **Médio/Alto** | Hashing SHA-256 (Protege contra leitura direta) |
| **Persistência de Dados (Local)** | **Baixo** | `localStorage` (Dados não são salvos em nuvem) |

> **Atenção:** Embora a criptografia seja de nível profissional, a persistência dos dados (contas e configurações) depende do navegador do organizador. A limpeza do cache resultará na perda de todos os sorteios e utilizadores.

## 🛠️ Tecnologias Utilizadas

* **HTML5**
* **CSS3**
* **JavaScript (Puro)**
* **CryptoJS:** Biblioteca para criptografia AES e Hashing SHA-256.

## ⚙️ Como Usar

### Para o Organizador

1.  Acesse a URL do site (após a hospedagem).
2.  Clique em **"Crie sua conta"** e cadastre um nome de utilizador e senha.
3.  Faça login no Painel do Organizador.
4.  Insira a lista de participantes, um nome por linha. O número deve ser **par** (entre 4 e 20).
5.  Clique em **"Sortear e Gerar Chaves"**.
6.  **Distribua as Informações:**
    * **Envie o "Link Único Compartilhável"** para todos os participantes.
    * **Envie a "Chave Única"** (encontrada na Lista de Chaves) para o participante correspondente **em privado**.

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
