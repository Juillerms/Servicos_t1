// Adiciona um listener que espera o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do formulário
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const clearButton = document.getElementById('clearButton');
    const messageDiv = document.getElementById('message');

    // Função para exibir mensagens de validação
    const showMessage = (message, type) => {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`; // Adiciona classe 'error' ou 'success'
    };

    // Função para limpar mensagens
    const clearMessage = () => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    };
    
    // Função para validar o formato do e-mail
    const isValidEmail = (email) => {
        // Expressão regular simples para validação de e-mail
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Listener para o evento de submit do formulário
    loginForm.addEventListener('submit', (event) => {
        // Previne o envio padrão do formulário
        event.preventDefault();
        clearMessage();
        
        // Remove classes de erro anteriores
        emailInput.classList.remove('invalid');
        passwordInput.classList.remove('invalid');

        // Pega os valores dos campos
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // --- VALIDAÇÕES ---
        if (email === '') {
            showMessage('O campo de e-mail é obrigatório.', 'error');
            emailInput.classList.add('invalid');
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Por favor, insira um formato de e-mail válido.', 'error');
            emailInput.classList.add('invalid');
            emailInput.focus();
            return;
        }

        if (password === '') {
            showMessage('O campo de senha é obrigatório.', 'error');
            passwordInput.classList.add('invalid');
            passwordInput.focus();
            return;
        }

        // --- SUCESSO ---
        showMessage('Validação realizada com sucesso!', 'success');
        
        // Simula o login e redireciona para a página principal após 1.5 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });

    // Listener para o botão "Limpar"
    clearButton.addEventListener('click', () => {
        emailInput.value = '';
        passwordInput.value = '';
        clearMessage();
        emailInput.classList.remove('invalid');
        passwordInput.classList.remove('invalid');
        emailInput.focus(); // Seta o foco para o campo de e-mail
    });
});
