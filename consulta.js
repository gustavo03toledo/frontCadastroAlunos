// ============================================================================
// CONFIGURAÇÃO DA API
// ============================================================================
const API_ENDPOINT_CONSULTA = 'https://apicadastroalunos.onrender.com/api/alunos';

// ============================================================================
// ELEMENTOS DO DOM
// ============================================================================
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

        console.log('🔍 Buscando alunos em:', API_ENDPOINT_CONSULTA);

        const response = await fetch(API_ENDPOINT_CONSULTA, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            mode: 'cors',
            credentials: 'omit'
        });

        // Verificar se a resposta é JSON válido antes de fazer parse
        let dadosResposta;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            dadosResposta = await response.json();
        } else {
            const textResponse = await response.text();
            throw new Error(`Resposta não é JSON: ${textResponse}`);
        }

        if (response.status === 200) {
            // Sucesso - verificar múltiplos formatos de resposta
            let alunosParaRenderizar = [];

            // Formato 1: Array direto
            if (Array.isArray(dadosResposta)) {
                alunosParaRenderizar = dadosResposta;
            }
            // Formato 2: Objeto com propriedade 'alunos' (padrão da API)
            else if (dadosResposta && dadosResposta.alunos && Array.isArray(dadosResposta.alunos)) {
                alunosParaRenderizar = dadosResposta.alunos;
            }
            // Formato 3: Objeto com propriedade 'data'
            else if (dadosResposta && dadosResposta.data && Array.isArray(dadosResposta.data)) {
                alunosParaRenderizar = dadosResposta.data;
            }

            if (alunosParaRenderizar.length > 0) {
                console.log('✅ Alunos encontrados:', alunosParaRenderizar.length);
                renderizarAlunos(alunosParaRenderizar);
                exibirMensagem(`${alunosParaRenderizar.length} aluno(s) encontrado(s).`, 'success');
            } else {
                console.log('ℹ️ Nenhum aluno encontrado');
                renderizarAlunos([]);
                exibirMensagem('Nenhum aluno cadastrado encontrado.', 'info');
            }
        } else if (response.status === 404) {
            // Não encontrado
            const mensagemErro = dadosResposta?.mensagem || dadosResposta?.message || dadosResposta?.erro || 'Endpoint não encontrado. Verifique se a rota GET /api/alunos está disponível na API.';
            console.log('❌ Erro 404:', mensagemErro);
            exibirMensagem(mensagemErro, 'error');
            limparTabela();
        } else if (response.status === 500) {
            // Erro do servidor
            const mensagemErro = dadosResposta?.mensagem || dadosResposta?.message || dadosResposta?.erro || dadosResposta?.error || 'Erro interno do servidor. Tente novamente mais tarde.';
            console.log('❌ Erro 500:', mensagemErro);
            exibirMensagem(mensagemErro, 'error');
            limparTabela();
        } else {
            // Outros erros
            const mensagemErro = dadosResposta?.mensagem || dadosResposta?.message || dadosResposta?.erro || dadosResposta?.error || `Erro ao buscar alunos. Status: ${response.status}`;
            console.log('❌ Erro:', mensagemErro);
            exibirMensagem(mensagemErro, 'error');
            limparTabela();
        }
    } catch (error) {
        console.error('❌ Erro ao buscar alunos:', error);
        
        // Tratamento específico para erros de rede ou CORS
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            exibirMensagem('Erro de conexão. Verifique se a API está acessível e se há problemas de CORS.', 'error');
        } else if (error.message.includes('JSON')) {
            exibirMensagem('Erro ao processar resposta da API. Verifique se o endpoint está correto.', 'error');
        } else {
            exibirMensagem(`Erro: ${error.message}`, 'error');
        }
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
