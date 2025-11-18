# Frontend — Cadastro de Alunos

Pequena aplicação front-end (HTML/CSS/JS) para cadastrar e consultar alunos usando uma API REST.

## Estrutura do projeto

Arquivos principais:

- `cadastro.html` — formulário para cadastrar alunos
- `cadastro.js` — lógica de validação e envio do formulário para a API
- `consulta.html` — interface para buscar/listar alunos
- `consulta.js` — lógica para consultar a API e renderizar a tabela
- `style.css` — estilos da aplicação

> Observação: este frontend é estático e foi pensado para ser servido via servidor simples (ex.: `Live Server`, `http-server`) ou integrado ao backend.

## Configurar a URL da API

Antes de usar a aplicação, atualize as constantes de endpoint no JavaScript para apontar para a URL pública da sua API.

- Em `cadastro.js`, localize a constante `API_ENDPOINT_CADASTRO` e defina a URL completa do endpoint de cadastro. Por exemplo:

```js
const API_ENDPOINT_CADASTRO = 'https://apicadastroalunos.onrender.com/api/alunos/cadastro';
```

- Em `consulta.js`, atualize `API_ENDPOINT_CONSULTA` para o endpoint de listagem da sua API. Por exemplo:

```js
const API_ENDPOINT_CONSULTA = 'https://apicadastroalunos.onrender.com/api/alunos';
```

Se a sua API retornar objetos em formatos diferentes, ajuste a lógica de `consulta.js` para adaptar (por exemplo, usar `dados.alunos` ou `dados.data`).

## Executar localmente

Sugestões rápidas para servir os arquivos estáticos:

- Usando o Live Server do VS Code (recomendado para desenvolvimento): selecione a pasta no Explorer e clique em "Open with Live Server".

- Usando `http-server` (Node.js):

```powershell
npm install -g http-server
http-server . -p 8080
```

Acesse então `http://localhost:8080/cadastro.html` ou `http://localhost:8080/consulta.html`.

## Testes e verificação

- Teste o cadastro via formulário em `cadastro.html`. Preencha os campos e envie; se tudo estiver configurado corretamente, você deverá receber uma mensagem de sucesso.

- Teste a consulta em `consulta.html`. Caso a API não exponha uma rota GET de listagem (retorno 404), a página exibirá mensagem informando que o endpoint não foi encontrado. Nesse caso, confirme com o backend o caminho correto para a listagem ou implemente um endpoint de listagem.

### Testes via PowerShell (exemplos)

- POST de teste (cadastro):

```powershell
Invoke-RestMethod -Method Post -Uri 'https://apicadastroalunos.onrender.com/api/alunos/cadastro' -Body (@{nome_completo='Teste';usuario_acesso='teste123';email_aluno='teste@example.com';senha_hash='senha123' } | ConvertTo-Json) -ContentType 'application/json' -TimeoutSec 15
```

- GET de health-check:

```powershell
Invoke-WebRequest -Method Get -Uri 'https://apicadastroalunos.onrender.com/health' -UseBasicParsing -TimeoutSec 15 | Select-Object StatusCode,Content
```

- GET de listagem (se existir):

```powershell
Invoke-RestMethod -Method Get -Uri 'https://apicadastroalunos.onrender.com/api/alunos' -TimeoutSec 15
```

## Dicas e solução de problemas

- CORS: se o frontend for servido de um domínio diferente, o backend deve habilitar CORS (ou retornar os cabeçalhos adequados). Se ocorrer erro de CORS no navegador, verifique os logs do backend.

- 404 em GET: indica que não existe rota de listagem pública — confirme o endpoint com o backend. Enquanto isso, você pode usar o POST para inserir e o `health` para checar o servidor.

- 500 / erros de servidor: verifique o retorno JSON do servidor para mensagens de erro detalhadas e ajuste os dados enviados (formatos e campos obrigatórios).

## Contato

Se quiser, posso ajustar o `consulta.js` para um endpoint diferente se você me informar o caminho correto, ou implementar uma versão que aceite múltiplos formatos de resposta (ex.: `data`, `alunos`, array cru).