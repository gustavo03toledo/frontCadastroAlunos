// Endpoint da API de cadastro
const API_ENDPOINT_CADASTRO = 'https://apicadastroalunos.onrender.com/api/alunos/cadastro';

// Elementos do DOM
const formCadastroAluno = document.getElementById('formCadastroAluno');
const mensagemFeedback = document.getElementById('mensagemFeedback');
const camposObrigatorios = ['nome_completo', 'usuario_acesso', 'email_aluno', 'senha_hash'];

// Função para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para exibir mensagem de feedback
function exibirMensagem(mensagem, tipo) {
    mensagemFeedback.textContent = mensagem;
    mensagemFeedback.className = `mensagem-feedback show ${tipo}`;
    
    // Scroll para a mensagem
    mensagemFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Se for sucesso, limpar após 5 segundos
    if (tipo === 'success') {
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

// Função para validar campos
function validarCampos() {
    let valido = true;
    limparMensagem();

    // Remover classes de erro anteriores
    camposObrigatorios.forEach(campoId => {
        const campo = document.getElementById(campoId);
        campo.classList.remove('error', 'success');
    });

    // Validar campos obrigatórios
    camposObrigatorios.forEach(campoId => {
        const campo = document.getElementById(campoId);
        const valor = campo.value.trim();

        if (!valor) {
            campo.classList.add('error');
            valido = false;
        } else {
            campo.classList.add('success');
        }
    });

    // Validar formato de email
    const emailAluno = document.getElementById('email_aluno').value.trim();
    if (emailAluno && !validarEmail(emailAluno)) {
        document.getElementById('email_aluno').classList.add('error');
        exibirMensagem('Por favor, insira um e-mail válido.', 'error');
        valido = false;
    }

    return valido;
}

// Função para coletar dados do formulário
function coletarDadosFormulario() {
    return {
        nome_completo: document.getElementById('nome_completo').value.trim(),
        usuario_acesso: document.getElementById('usuario_acesso').value.trim(),
        email_aluno: document.getElementById('email_aluno').value.trim(),
        senha_hash: document.getElementById('senha_hash').value,
        observacao: document.getElementById('observacao').value.trim() || null
    };
}

// Função para enviar dados para a API
async function enviarCadastro(dados) {
    try {
        console.log('📤 Enviando cadastro para:', API_ENDPOINT_CADASTRO);
        console.log('📊 Dados:', dados);
        
        const response = await fetch(API_ENDPOINT_CADASTRO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify(dados)
        });

        const dadosResposta = await response.json();

        if (response.status === 201) {
            // Sucesso
            console.log('✅ Aluno cadastrado com sucesso!', dadosResposta);
            exibirMensagem('Aluno cadastrado com sucesso!', 'success');
            formCadastroAluno.reset();
            
            // Remover classes de sucesso após um tempo
            setTimeout(() => {
                camposObrigatorios.forEach(campoId => {
                    document.getElementById(campoId).classList.remove('success');
                });
            }, 3000);
        } else if (response.status === 400) {
            // Erro de validação
            const mensagemErro = dadosResposta.mensagem || dadosResposta.message || dadosResposta.error || 'Dados inválidos. Verifique os campos preenchidos.';
            console.log('❌ Erro 400:', mensagemErro);
            exibirMensagem(mensagemErro, 'error');
        } else if (response.status === 500) {
            // Erro do servidor
            const mensagemErro = dadosResposta.mensagem || dadosResposta.message || dadosResposta.error || 'Erro interno do servidor. Tente novamente mais tarde.';
            console.log('❌ Erro 500:', mensagemErro);
            exibirMensagem(mensagemErro, 'error');
        } else {
            // Outros erros
            const mensagemErro = dadosResposta.mensagem || dadosResposta.message || dadosResposta.error || `Erro ao cadastrar aluno. Status: ${response.status}`;
            console.log('❌ Erro:', mensagemErro);
            exibirMensagem(mensagemErro, 'error');
        }
    } catch (error) {
        console.error('❌ Erro ao enviar cadastro:', error);
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            exibirMensagem('Erro de conexão. Verifique se a API está acessível e se há problemas de CORS.', 'error');
        } else {
            exibirMensagem('Erro de conexão. Verifique se a API está acessível e tente novamente.', 'error');
        }
    }
}

// Event listener para submissão do formulário
formCadastroAluno.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Validar campos
    if (!validarCampos()) {
        exibirMensagem('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
        return;
    }

    // Coletar dados
    const dados = coletarDadosFormulario();

    // Desabilitar botão durante o envio
    const btnSubmit = formCadastroAluno.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Cadastrando...';

    // Enviar para API
    await enviarCadastro(dados);

    // Reabilitar botão
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Cadastrar Aluno';
});

// Validação em tempo real para o campo de email
document.getElementById('email_aluno').addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !validarEmail(email)) {
        this.classList.add('error');
        this.classList.remove('success');
    } else if (email) {
        this.classList.remove('error');
        this.classList.add('success');
    }
});

// Limpar classes de erro ao começar a digitar
camposObrigatorios.forEach(campoId => {
    const campo = document.getElementById(campoId);
    campo.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
        }
    });
});

