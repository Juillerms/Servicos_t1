document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html'; 
        return;
    }

    const userNameSpan = document.getElementById('userName');
    const userEmailSpan = document.getElementById('userEmail');
    const logoutButton = document.getElementById('logoutButton');
    const serviceTypeSelect = document.getElementById('serviceType');
    const servicePriceSpan = document.getElementById('servicePrice');
    const serviceTermSpan = document.getElementById('serviceTerm');
    const serviceDateSpan = document.getElementById('serviceDate');
    const newRequestForm = document.getElementById('newRequestForm');
    const requestsTableBody = document.getElementById('requestsTableBody');

    const SERVICES = [
        { id: 1, name: 'Consultoria em TI', price: 500.00, term: 5 },
        { id: 2, name: 'Desenvolvimento de Software', price: 3500.00, term: 30 },
        { id: 3, name: 'Segurança da Informação', price: 1800.00, term: 15 },
        { id: 4, name: 'Suporte Técnico Remoto', price: 250.00, term: 1 },
    ];

    let initialRequests = [
        { date: '2024-03-15', id: 'NXS-001', service: 'Segurança da Informação', status: 'Concluído', price: 1800.00, expectedDate: '2024-03-30' },
        { date: '2024-04-01', id: 'NXS-002', service: 'Suporte Técnico Remoto', status: 'Em Andamento', price: 250.00, expectedDate: '2024-04-02' },
    ];
    
    function loadUserData() {
        userNameSpan.textContent = sessionStorage.getItem('userName') || 'N/A';
        userEmailSpan.textContent = sessionStorage.getItem('userEmail') || 'N/A';
    }

    function populateServices() {
        SERVICES.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = service.name;
            serviceTypeSelect.appendChild(option);
        });
    }

    function updateServiceDetails() {
        const selectedId = parseInt(serviceTypeSelect.value);
        const service = SERVICES.find(s => s.id === selectedId);

        if (service) {
            servicePriceSpan.textContent = service.price.toFixed(2).replace('.', ',');
            serviceTermSpan.textContent = service.term;
            
            const today = new Date();
            today.setDate(today.getDate() + service.term);
            serviceDateSpan.textContent = today.toLocaleDateString('pt-BR');
        }
    }

    function renderTable() {
        requestsTableBody.innerHTML = ''; 
        initialRequests.sort((a, b) => new Date(a.date) - new Date(b.date)); 

        initialRequests.forEach((req, index) => {
            const statusClass = req.status.toLowerCase().replace(' ', '-');
            const row = `
                <tr data-index="${index}">
                    <td>${new Date(req.date).toLocaleDateString('pt-BR')}</td>
                    <td>${req.id}</td>
                    <td>${req.service}</td>
                    <td><span class="status status-${statusClass}">${req.status}</span></td>
                    <td>R$ ${req.price.toFixed(2).replace('.', ',')}</td>
                    <td>${new Date(req.expectedDate).toLocaleDateString('pt-BR')}</td>
                    <td>
                        <button class="delete-btn" title="Excluir">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
            requestsTableBody.innerHTML += row;
        });
    }

    function handleAddRequest(event) {
        event.preventDefault();
        const selectedId = parseInt(serviceTypeSelect.value);
        const service = SERVICES.find(s => s.id === selectedId);
        
        const newIdNumber = initialRequests.length + 3; 
        const newRequest = {
            date: new Date().toISOString().split('T')[0],
            id: `NXS-00${newIdNumber}`,
            service: service.name,
            status: 'EM ELABORAÇÃO',
            price: service.price,
            expectedDate: new Date(new Date().setDate(new Date().getDate() + service.term)).toISOString().split('T')[0]
        };

        initialRequests.push(newRequest);
        renderTable();
    }
    
    loadUserData();
    populateServices();
    updateServiceDetails(); 

    serviceTypeSelect.addEventListener('change', updateServiceDetails);
    newRequestForm.addEventListener('submit', handleAddRequest);
    
    requestsTableBody.addEventListener('click', (event) => {
        if (event.target.closest('.delete-btn')) {
            const row = event.target.closest('tr');
            const index = parseInt(row.dataset.index);
            initialRequests.splice(index, 1);
            renderTable();
        }
    });

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.clear();
        window.location.href = 'index.html';
    });
});
