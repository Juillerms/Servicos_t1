// Adiciona um listener que espera o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const clearButton = document.getElementById('clearButton');
    const messageDiv = document.getElementById('message');

    const showMessage = (message, type) => {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`; 
    };

    const clearMessage = () => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    };
    
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        clearMessage();
        
        emailInput.classList.remove('invalid');
        passwordInput.classList.remove('invalid');

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

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

        showMessage('Validação realizada com sucesso!', 'success');

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email); 
        sessionStorage.setItem('userName', 'Cliente Exemplo'); 
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });

    clearButton.addEventListener('click', () => {
        emailInput.value = '';
        passwordInput.value = '';
        clearMessage();
        emailInput.classList.remove('invalid');
        passwordInput.classList.remove('invalid');
        emailInput.focus(); 
    });
});
