document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('mainNav');

    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        mainNav.innerHTML = `
            <a href="solicitacao-servicos.html">Solicitar Serviços</a>
            <a href="#" id="logoutButton">Sair</a>
        `;

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear(); 
            window.location.reload();
        });

    } else {
        mainNav.innerHTML = `
            <a href="login.html">Login</a>
            <a href="cadastro-cliente.html">Cadastrar cliente</a>
        `;
    }
});
