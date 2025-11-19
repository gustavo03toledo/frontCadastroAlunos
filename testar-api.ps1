# Script de Teste da API - Cadastro de Alunos
$baseUrl = "https://apicadastroalunos.onrender.com"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Teste da API - Cadastro de Alunos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Teste 1: Health Check
Write-Host "1. Testando Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Method Get -Uri "$baseUrl/health" -TimeoutSec 15
    Write-Host "   OK - Health Check funcionando" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
} catch {
    Write-Host "   FALHOU - Health Check" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 2: POST - Cadastrar Aluno
Write-Host "2. Testando POST /api/alunos/cadastro..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$dadosCadastro = @{
    nome_completo = "Aluno Teste $timestamp"
    usuario_acesso = "teste_$timestamp"
    email_aluno = "teste_$timestamp@example.com"
    senha_hash = "senha123"
    observacao = "Aluno criado via script de teste"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/api/alunos/cadastro" -Body $dadosCadastro -ContentType "application/json" -TimeoutSec 15
    Write-Host "   OK - Cadastro realizado com sucesso!" -ForegroundColor Green
    Write-Host "   ID do aluno: $($response.id)" -ForegroundColor Gray
    $alunoId = $response.id
} catch {
    Write-Host "   FALHOU - Cadastro" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
    $alunoId = $null
}
Write-Host ""

# Teste 3: GET - Listar Alunos
Write-Host "3. Testando GET /api/alunos..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Method Get -Uri "$baseUrl/api/alunos" -TimeoutSec 15
    Write-Host "   OK - Listagem realizada com sucesso!" -ForegroundColor Green
    
    if ($response.alunos -and $response.alunos.Count -gt 0) {
        Write-Host "   Total de alunos: $($response.alunos.Count)" -ForegroundColor Gray
    } elseif ($response -is [Array] -and $response.Count -gt 0) {
        Write-Host "   Total de alunos: $($response.Count)" -ForegroundColor Gray
    } else {
        Write-Host "   Nenhum aluno encontrado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   FALHOU - Listagem (endpoint pode nao estar disponivel)" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 4: GET - Buscar Aluno por ID
if ($alunoId) {
    Write-Host "4. Testando GET /api/alunos/$alunoId..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Method Get -Uri "$baseUrl/api/alunos/$alunoId" -TimeoutSec 15
        Write-Host "   OK - Busca por ID realizada com sucesso!" -ForegroundColor Green
        Write-Host "   Aluno: $($response.aluno.nome_completo)" -ForegroundColor Gray
    } catch {
        Write-Host "   FALHOU - Busca por ID" -ForegroundColor Red
        Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testes concluidos!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
