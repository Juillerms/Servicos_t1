document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('mainNav');

    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        // Usuário está logado: mostra link para serviços e botão de sair
        mainNav.innerHTML = `
            <a href="solicitacao-servicos.html">Solicitar Serviços</a>
            <a href="#" id="logoutButton">Sair</a>
        `;

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear(); // Limpa a sessão
            window.location.reload(); // Recarrega a página para atualizar o menu
        });

    } else {
        // Usuário não está logado: mostra links de login e cadastro
        mainNav.innerHTML = `
            <a href="login.html">Login</a>
            <a href="cadastro-cliente.html">Cadastrar Cliente</a>
        `;
    }
});
