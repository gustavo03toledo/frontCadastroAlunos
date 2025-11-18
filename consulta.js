// Endpoint da API de consulta
const API_ENDPOINT_CONSULTA = 'INSIRA_AQUI_O_URL_DO_AZURE/api/alunos';

// Elementos do DOM
const btnBuscarAlunos = document.getElementById('btnBuscarAlunos');
const tabelaAlunos = document.getElementById('tabelaAlunos');
const tbody = tabelaAlunos.querySelector('tbody');
const mensagemFeedback = document.getElementById('mensagemFeedback');

// Função para exibir mensagem de feedback
function exibirMensagem(mensagem, tipo) {
    mensagemFeedback.textContent = mensagem;
    mensagemFeedback.className = `mensagem-feedback show ${tipo}`;
    
    // Scroll para a mensagem
    mensagemFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Se for info ou sucesso, limpar após alguns segundos
    if (tipo === 'success' || tipo === 'info') {
        setTimeout(() => {
            mensagemFeedback.classList.remove('show');
        }, 5000);
    }
}

// Função para limpar mensagem
function limparMensagem() {
    mensagemFeedback.classList.remove('show');
    mensagemFeedback.textContent = '';
}

// Função para limpar tabela
function limparTabela() {
    tbody.innerHTML = '';
}

// Função para renderizar alunos na tabela
function renderizarAlunos(alunos) {
    limparTabela();

    if (!alunos || alunos.length === 0) {
        const tr = document.createElement('tr');
        tr.className = 'tabela-vazia';
        tr.innerHTML = '<td colspan="3">Nenhum aluno cadastrado encontrado.</td>';
        tbody.appendChild(tr);
        return;
    }

    alunos.forEach(aluno => {
        const tr = document.createElement('tr');
        
        const tdNome = document.createElement('td');
        tdNome.textContent = aluno.nome_completo || '-';
        
        const tdUsuario = document.createElement('td');
        tdUsuario.textContent = aluno.usuario_acesso || '-';
        
        const tdEmail = document.createElement('td');
        tdEmail.textContent = aluno.email_aluno || '-';
        
        tr.appendChild(tdNome);
        tr.appendChild(tdUsuario);
        tr.appendChild(tdEmail);
        
        tbody.appendChild(tr);
    });
}

// Função para buscar alunos da API
async function buscarAlunos() {
    try {
        // Desabilitar botão durante a busca
        btnBuscarAlunos.disabled = true;
        btnBuscarAlunos.textContent = 'Buscando...';
        limparMensagem();

        const response = await fetch(API_ENDPOINT_CONSULTA, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const dadosResposta = await response.json();

        if (response.status === 200) {
            // Sucesso
            if (Array.isArray(dadosResposta)) {
                renderizarAlunos(dadosResposta);
                
                if (dadosResposta.length > 0) {
                    exibirMensagem(`${dadosResposta.length} aluno(s) encontrado(s).`, 'success');
                } else {
                    exibirMensagem('Nenhum aluno cadastrado encontrado.', 'info');
                }
            } else if (dadosResposta.alunos && Array.isArray(dadosResposta.alunos)) {
                // Se a resposta vier em um objeto com propriedade 'alunos'
                renderizarAlunos(dadosResposta.alunos);
                
                if (dadosResposta.alunos.length > 0) {
                    exibirMensagem(`${dadosResposta.alunos.length} aluno(s) encontrado(s).`, 'success');
                } else {
                    exibirMensagem('Nenhum aluno cadastrado encontrado.', 'info');
                }
            } else {
                exibirMensagem('Formato de resposta inesperado da API.', 'error');
                limparTabela();
            }
        } else if (response.status === 404) {
            // Não encontrado
            exibirMensagem('Endpoint não encontrado. Verifique a URL da API.', 'error');
            limparTabela();
        } else if (response.status === 500) {
            // Erro do servidor
            const mensagemErro = dadosResposta.message || dadosResposta.error || 'Erro interno do servidor. Tente novamente mais tarde.';
            exibirMensagem(mensagemErro, 'error');
            limparTabela();
        } else {
            // Outros erros
            const mensagemErro = dadosResposta.message || dadosResposta.error || `Erro ao buscar alunos. Status: ${response.status}`;
            exibirMensagem(mensagemErro, 'error');
            limparTabela();
        }
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        exibirMensagem('Erro de conexão. Verifique se a API está acessível e tente novamente.', 'error');
        limparTabela();
    } finally {
        // Reabilitar botão
        btnBuscarAlunos.disabled = false;
        btnBuscarAlunos.textContent = 'Buscar Todos os Alunos';
    }
}

// Event listener para o botão de buscar
btnBuscarAlunos.addEventListener('click', buscarAlunos);

// Buscar alunos automaticamente ao carregar a página (opcional)
// Descomente a linha abaixo se desejar que os alunos sejam carregados automaticamente
// window.addEventListener('DOMContentLoaded', buscarAlunos);

