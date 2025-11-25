import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/solicitacao-servicos.css';

const SolicitacaoServicos = () => {
    const navigate = useNavigate();
    
    const [usuario, setUsuario] = useState({ nome: '', email: '' });
    const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
    const [meusPedidos, setMeusPedidos] = useState([]);
    
    const [servicoSelecionadoId, setServicoSelecionadoId] = useState('');
    const [detalhesServico, setDetalhesServico] = useState(null);

    // Carrega dados iniciais
    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const email = sessionStorage.getItem('userEmail');
        const nome = sessionStorage.getItem('userName');

        if (isLoggedIn !== 'true' || !email) {
            navigate('/login');
            return;
        }

        setUsuario({ nome, email });
        carregarServicos();
        carregarPedidosUsuario(email);
    }, [navigate]);

    const carregarServicos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/servicos');
            if (response.data.status === 'sucesso') {
                setServicosDisponiveis(response.data.dados);
                // Seleciona o primeiro item automaticamente se houver
                if (response.data.dados.length > 0) {
                    setServicoSelecionadoId(response.data.dados[0].id);
                }
            }
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
        }
    };

    const carregarPedidosUsuario = async (email) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/solicitacoes/${email}`);
            if (response.data.status === 'sucesso') {
                // Formata os dados vindos do banco (que estão em português) para o state local
                const pedidosFormatados = response.data.dados.map(p => ({
                    ...p,
                    service: p.nome_servico,
                    price: p.preco_momento, 
                    date: p.data_pedido,
                    expectedDate: p.data_prevista,
                    servico_id: p.servico_id // Garante que o ID venha do banco
                }));
                setMeusPedidos(pedidosFormatados);
            }
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
        }
    };

    // Atualiza o objeto 'detalhesServico' sempre que o ID selecionado muda
    useEffect(() => {
        if (servicoSelecionadoId && servicosDisponiveis.length > 0) {
            const servico = servicosDisponiveis.find(s => s.id === parseInt(servicoSelecionadoId));
            setDetalhesServico(servico);
        }
    }, [servicoSelecionadoId, servicosDisponiveis]);

    // --- AÇÃO: Botão INCLUIR ---
    const handleAdicionarPedido = (e) => {
        e.preventDefault();
        
        if (!detalhesServico) {
            alert("Aguarde o carregamento dos serviços ou selecione um válido.");
            return;
        }

        const dataHoje = new Date();
        const dataPrevista = new Date();
        dataPrevista.setDate(dataHoje.getDate() + detalhesServico.prazo);

        const novoPedido = {
            id: `TEMP-${Date.now()}`, // ID provisório para o React
            servico_id: detalhesServico.id, // ID real do serviço para o Banco
            service: detalhesServico.nome,
            price: detalhesServico.preco,
            date: dataHoje.toISOString().split('T')[0],
            expectedDate: dataPrevista.toISOString().split('T')[0],
            status: 'EM ELABORAÇÃO'
        };

        setMeusPedidos([...meusPedidos, novoPedido]);
    };

    const handleRemoverPedido = (indexToRemove) => {
        const novosPedidos = meusPedidos.filter((_, index) => index !== indexToRemove);
        setMeusPedidos(novosPedidos);
    };

    // --- AÇÃO: Botão SALVAR ---
    const handleSalvarTudo = async () => {
        // Prepara o payload no formato que o backend espera (nomes em português)
        const payloadSolicitacoes = meusPedidos.map(item => ({
            servico_id: item.servico_id,
            data_pedido: item.date,
            data_prevista: item.expectedDate,
            status: item.status,
            preco: item.price
        }));

        try {
            await axios.post('http://localhost:3001/api/solicitacoes/atualizar', {
                email: usuario.email,
                solicitacoes: payloadSolicitacoes
            });
            alert('Solicitações atualizadas com sucesso!');
            // Recarrega do banco para confirmar que gravou
            carregarPedidosUsuario(usuario.email);
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar solicitações.');
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.clear();
        navigate('/');
    };

    const formatMoney = (val) => val ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';

    return (
        <div>
            <header className="main-header">
                <div className="container">
                    <Link to="/" className="logo-container">
                        <img src="/assets/nexus-logo.png" alt="Nexus TI Logo" />
                    </Link>
                    <nav className="main-nav">
                        <Link to="/">Início</Link>
                        <a href="#" onClick={handleLogout}>Sair</a>
                    </nav>
                </div>
            </header>

            <main className="container">
                <section className="section user-info">
                    <h2 className="section-title">Bem-vindo(a) de volta!</h2>
                    <p><strong>Nome:</strong> <span>{usuario.nome}</span></p>
                    <p><strong>Login:</strong> <span>{usuario.email}</span></p>
                </section>

                <div className="dashboard-layout">
                    <section className="section new-request-section">
                        <h2 className="section-title">Nova Solicitação de Serviço</h2>
                        <form onSubmit={handleAdicionarPedido}>
                            <div className="form-group">
                                <label htmlFor="serviceType" className="form-label">Selecione o Serviço de TI:</label>
                                <select 
                                    id="serviceType" 
                                    className="form-input"
                                    value={servicoSelecionadoId}
                                    onChange={(e) => setServicoSelecionadoId(e.target.value)}
                                >
                                    {servicosDisponiveis.map(s => (
                                        <option key={s.id} value={s.id}>{s.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="service-details">
                                <p><strong>Preço:</strong> {detalhesServico ? formatMoney(detalhesServico.preco) : 'R$ 0,00'}</p>
                                <p><strong>Prazo:</strong> {detalhesServico?.prazo || 0} dias</p>
                                <p><strong>Status:</strong> EM ELABORAÇÃO</p>
                            </div>

                            <button type="submit" className="btn btn-primary">Incluir Solicitação (No Carrinho)</button>
                        </form>
                    </section>

                    <section className="section history-section">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                            <h2 className="section-title" style={{marginBottom: 0}}>Minhas Solicitações</h2>
                            <button onClick={handleSalvarTudo} className="btn btn-primary" style={{width: 'auto', backgroundColor: '#16a34a'}}>
                                Salvar / Atualizar Lista
                            </button>
                        </div>
                        
                        <div className="table-wrapper">
                            <table className="requests-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Serviço</th>
                                        <th>Status</th>
                                        <th>Preço</th>
                                        <th>Previsão</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {meusPedidos.map((req, index) => (
                                        <tr key={index}>
                                            <td>{new Date(req.date).toLocaleDateString('pt-BR')}</td>
                                            <td>{req.service}</td>
                                            <td>
                                                <span className={`status status-${req.status.toLowerCase().replace(/ /g, '-')}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td>{formatMoney(req.price)}</td>
                                            <td>{new Date(req.expectedDate).toLocaleDateString('pt-BR')}</td>
                                            <td>
                                                <button 
                                                    className="delete-btn" 
                                                    onClick={() => handleRemoverPedido(index)}
                                                    type="button"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {meusPedidos.length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{textAlign: 'center'}}>Nenhuma solicitação encontrada.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
            
            <footer className="main-footer">
                <div className="container footer-bottom">
                    <p>&copy; 2025 Nexus TI. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default SolicitacaoServicos;