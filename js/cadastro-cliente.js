document.addEventListener('DOMContentLoaded', () => {

    // Seleção de Elementos
    const form = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const fullNameInput = document.getElementById('fullName');
    const cpfInput = document.getElementById('cpf');
    const birthDateInput = document.getElementById('birthDate');
    const phoneInput = document.getElementById('phone');
    const messageDiv = document.getElementById('message');
    const clearButton = document.getElementById('clearButton');
    const backButton = document.getElementById('backButton');

    // --- FUNÇÕES DE VALIDAÇÃO ---

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

    const validateCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let sum = 0, remainder;
        for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    };

    // --- MÁSCARAS DE INPUT ---

    cpfInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });

    // --- EVENT LISTENERS ---

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearMessage();
        
        const allInputs = [emailInput, passwordInput, confirmPasswordInput, fullNameInput, cpfInput, birthDateInput];
        allInputs.forEach(input => input.classList.remove('invalid'));

        // Validações
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
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

        const nameParts = fullNameInput.value.trim().split(' ');
        if (nameParts.length < 2 || nameParts[0].length < 2) {
             showMessage('O nome deve ter pelo menos duas palavras, com a primeira tendo no mínimo 2 caracteres.', 'error');
             fullNameInput.classList.add('invalid');
             return;
        }

        if (!validateCPF(cpfInput.value)) {
             showMessage('CPF inválido.', 'error');
             cpfInput.classList.add('invalid');
             return;
        }

        const birthDate = new Date(birthDateInput.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
             showMessage('É necessário ter pelo menos 18 anos.', 'error');
             birthDateInput.classList.add('invalid');
             return;
        }

        showMessage('Validação realizada com sucesso!', 'success');
    });

    clearButton.addEventListener('click', () => {
        form.reset();
        document.querySelector('input[name="maritalStatus"][value="solteiro"]').checked = true;
        document.getElementById('education').value = '2-completo';
        clearMessage();
        const allInputs = [emailInput, passwordInput, confirmPasswordInput, fullNameInput, cpfInput, birthDateInput, phoneInput];
        allInputs.forEach(input => input.classList.remove('invalid'));
        emailInput.focus();
    });

    backButton.addEventListener('click', () => {
        // Volta para a página anterior no histórico do navegador
        window.history.back();
    });
});
