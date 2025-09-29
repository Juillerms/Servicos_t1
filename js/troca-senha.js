// Conteúdo para o novo arquivo: js/troca-senha.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('changePasswordForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const messageDiv = document.getElementById('message');
    const clearButton = document.getElementById('clearButton');

    const showMessage = (message, type) => {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
    };

    const clearMessage = () => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password) => {
        if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
        if (!/\d/.test(password)) return 'A senha deve conter pelo menos um número.';
        if (!/[A-Z]/.test(password)) return 'A senha deve conter pelo menos uma letra maiúscula.';
        if (!/[@#$%&!_?\/+=.-]/.test(password)) return 'A senha deve conter um caractere especial permitido.';
        if (/[\[\]{}()^~:;,'"<>/|\\]/.test(password)) return 'A senha contém caracteres não permitidos.';
        return null;
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearMessage();
        const inputs = [emailInput, passwordInput, confirmPasswordInput];
        inputs.forEach(input => input.classList.remove('invalid'));

        if (!isValidEmail(emailInput.value.trim())) {
            showMessage('E-mail inválido ou não preenchido.', 'error');
            emailInput.classList.add('invalid');
            return;
        }

        const passwordError = validatePassword(passwordInput.value);
        if (passwordError) {
            showMessage(passwordError, 'error');
            passwordInput.classList.add('invalid');
            return;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            showMessage('As senhas não coincidem.', 'error');
            confirmPasswordInput.classList.add('invalid');
            return;
        }

        showMessage('Validação realizada com sucesso!', 'success');
        setTimeout(() => {
            window.history.back(); // Volta para a página anterior
        }, 1500);
    });

    clearButton.addEventListener('click', () => {
        form.reset();
        clearMessage();
        const inputs = [emailInput, passwordInput, confirmPasswordInput];
        inputs.forEach(input => input.classList.remove('invalid'));
        emailInput.focus();
    });
});
