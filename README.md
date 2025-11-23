<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>README - Amigo Secreto Criptografado</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; color: #24292e; }
        h1 { border-bottom: 2px solid #eaecef; padding-bottom: 0.3em; color: #0366d6; }
        h2 { border-bottom: 1px solid #eaecef; padding-bottom: 0.2em; margin-top: 1.5em; }
        code { background-color: rgba(27, 31, 35, 0.05); padding: 0.2em 0.4em; border-radius: 6px; }
        pre { background-color: #f6f8fa; padding: 16px; overflow: auto; border-radius: 6px; }
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        th, td { border: 1px solid #dfe2e5; padding: 8px; text-align: left; }
        th { background-color: #f6f8fa; }
        .emoji { font-size: 1.2em; }
    </style>
</head>
<body>

    <h1><span class="emoji">🎄</span> Amigo Secreto Criptografado (AES) <span class="emoji">🔒</span></h1>

    <p>Um sistema simples e seguro para sorteio de <strong>Amigo Secreto</strong> (<em>Secret Santa</em>) para grupos de família e amigos. Este projeto roda 100% no navegador (<em>Client-Side</em>) e utiliza criptografia de nível industrial para garantir que ninguém descubra os resultados antes da hora, mesmo inspecionando o código.</p>

    <hr>

    <h2><span class="emoji">✨</span> Funcionalidades Principais</h2>
    <ul>
        <li><strong>Segurança Avançada:</strong> Utiliza o algoritmo <strong>AES-256</strong> (Advanced Encryption Standard) para criptografar os resultados.</li>
        <li><strong>Chave Única:</strong> A senha do participante atua como a chave de descriptografia para o seu resultado.</li>
        <li><strong>Independente:</strong> Não requer <em>backend</em>, servidor ou banco de dados.</li>
        <li><strong>Interface Amigável:</strong> Design simples onde o participante clica no seu nome e insere sua chave.</li>
    </ul>

    <hr>

    <h2><span class="emoji">🛠️</span> Tecnologias Utilizadas</h2>
    <table>
        <thead>
            <tr>
                <th>Tecnologia</th>
                <th>Função</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>HTML5</strong></td>
                <td>Estrutura da página.</td>
            </tr>
            <tr>
                <td><strong>CSS3</strong></td>
                <td>Estilização temática (Natalina).</td>
            </tr>
            <tr>
                <td><strong>JavaScript (ES6+)</strong></td>
                <td>Lógica do sistema e interação.</td>
            </tr>
            <tr>
                <td><strong>CryptoJS</strong></td>
                <td>Biblioteca para realizar a Criptografia AES (via CDN).</td>
            </tr>
        </tbody>
    </table>

    <hr>

    <h2><span class="emoji">🔑</span> Segurança e Criptografia (AES)</h2>
    <p>O sistema utiliza <strong>Criptografia Simétrica AES</strong>. O nome do amigo secreto é "trancado" matematicamente e a <strong>senha individual é a única chave</strong> que pode destrancar o resultado.</p>

    <p>Isso garante que, mesmo que um usuário mal-intencionado veja o código fonte (<code>U2FsdGVkX1...</code>), ele não conseguirá decifrar o nome sem ter a chave exata daquela pessoa.</p>

    <p>

[Image of AES encryption decryption process diagram]
</p>

    <ul>
        <li><strong>Vulnerabilidade:</strong> A única vulnerabilidade deste sistema são as <strong>senhas de 4 dígitos</strong>. Recomendamos usar <strong>senhas de palavras</strong> (ex: <code>presente-feliz</code>) em vez de números para proteção máxima contra <em>scripts</em> de força bruta.</li>
    </ul>

    <hr>

    <h2><span class="emoji">🚀</span> Configuração e Deploy</h2>

    <h3>1. Preparação dos Arquivos</h3>
    <p>Crie os 3 arquivos essenciais (<code>index.html</code>, <code>style.css</code>, <code>script.js</code>) na raiz do seu projeto.</p>

    <h3>2. Gerar a Lista Criptografada (Crucial)</h3>
    <p>Você precisa rodar o arquivo **<code>gerador.html</code>** (que não deve ser enviado para o GitHub) para criar a lista de dados trancados.</p>
    <ol>
        <li><strong>Edite</strong> o código dentro do <code>gerador.html</code> com os nomes e as senhas.</li>
        <li>Abra o <code>gerador.html</code> no seu navegador.</li>
        <li><strong>Copie</strong> o array criptografado que aparecer na caixa de texto.</li>
    </ol>

    <h3>3. Inserir Dados e Finalizar o Código</h3>
    <p><strong>A. Atualizar <code>index.html</code>:</strong> Adicione o link para o <strong>CryptoJS</strong> dentro do <code>&lt;head&gt;</code>:</p>
    <pre><code>&lt;!-- index.html (Trecho) --&gt;
&lt;head&gt;
    &lt;!-- ... tags ... --&gt;
    &lt;link rel="stylesheet" href="style.css"&gt;
    
    &lt;!-- Biblioteca de Segurança para o AES-256 --&gt;
    &lt;script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"&gt;&lt;/script&gt;

&lt;/head&gt;</code></pre>

    <p><strong>B. Atualizar <code>script.js</code>:</strong> Cole o código copiado do gerador (o array <code>const participantes</code>) no topo do seu <code>script.js</code>.</p>
    <pre><code>// script.js (Trecho)

// COLE AQUI O CÓDIGO QUE VOCÊ COPIOU DO ARQUIVO GERADOR.HTML
const participantes = [ 
    { "nome": "Isabel Cortez", "segredo": "U2FsdGVkX1+W+hJQPTDp2IW0oIS/Lioc/PvInIT6h/o=" },
    // ...
]; 

// --- RESTO DA LÓGICA DO JS ---</code></pre>

    <h3>4. Deploy (Publicação)</h3>
    <ol>
        <li><strong>Atenção:</strong> Certifique-se de que o arquivo **<code>gerador.html</code> foi DELETADO** antes de enviar para o GitHub.</li>
        <li>Faça o <em>push</em> dos 3 arquivos (<code>index.html</code>, <code>style.css</code>, <code>script.js</code>) para o repositório.</li>
        <li>Ative o **GitHub Pages** para obter o link público do seu projeto.</li>
    </ol>

    <hr>

    <h2><span class="emoji">🎁</span> Como Usar (Para os Participantes)</h2>
    <ol>
        <li>O organizador envia o link do site e, no <strong>privado</strong>, a chave secreta de cada um.</li>
        <li>O participante acessa o link.</li>
        <li>Clica no <strong>SEU NOME</strong> na lista.</li>
        <li>Insere a chave secreta.</li>
        <li>O site tenta descriptografar a mensagem. Se a senha estiver correta, o nome é revelado.</li>
    </ol>

    <hr>

    <h2><span class="emoji">📜</span> Licença</h2>
    <p>Este projeto está sob a licença **MIT**. Sinta-se à vontade para clonar, modificar e usar!</p>

</body>
</html>
