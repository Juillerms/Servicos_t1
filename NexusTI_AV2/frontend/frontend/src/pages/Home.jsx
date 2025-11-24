// frontend/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/style.css';

// Componente Header (Reutilizável/Interno para pontuação extra na AV2)
const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(sessionStorage.getItem('isLoggedIn') === 'true');
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate('/');
        window.location.reload(); // Para garantir reset de estados
    };

    return (
        <header className="main-header">
            <div className="container">
                <Link to="/" className="logo-container">
                    <img src="/assets/nexus-logo.png" alt="Nexus TI Logo" />
                </Link>
                <p className="header-phrase">Tecnologia que conecta | Inovação que transforma</p>
                <nav className="main-nav">
                    {isLoggedIn ? (
                        <>
                            <Link to="/solicitacao-servicos">Solicitar Serviços</Link>
                            <a href="#" onClick={handleLogout}>Sair</a>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/cadastro-cliente">Cadastrar Cliente</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

const Home = () => {
    return (
        <>
            <Header />
            <main>
                <div className="container">
                    <section className="section">
                        <h2 className="section-title">Nossa Jornada</h2>
                        <p className="section-intro-text">
                            Fundada em 2025, a Nexus TI nasceu da paixão por inovação e do
                            desejo de transformar desafios tecnológicos em soluções eficientes.
                        </p>
                    </section>

                    <section className="section">
                        <h2 className="section-title">Conheça a Nexus TI</h2>
                        <div className="video-wrapper">
                            <iframe
                                src="https://www.youtube.com/embed/KBP72QBb8nY?si=MwG2-HPDzj3SARtu"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Vídeo Nexus TI"
                            ></iframe>
                        </div>
                    </section>

                    <section className="section">
                        <h2 className="section-title">Nosso Ambiente</h2>
                        <div className="grid-layout gallery-grid">
                            <img src="/assets/escritorio-da-empresa.png" alt="Escritório" />
                            <img src="/assets/trabalhando-em-equipe.png" alt="Equipe" />
                            <img src="/assets/sala-de-reuniao.png" alt="Reunião" />
                            <img src="/assets/area-de-lazer-descanso.png" alt="Lazer" />
                        </div>
                    </section>

                    <section className="section">
                        <h2 className="section-title">Nossos Serviços</h2>
                        <div className="grid-layout services-grid">
                            <div className="service-card">
                                <h3>Consultoria em TI</h3>
                                <p>Análise e estratégia para otimizar sua infraestrutura tecnológica.</p>
                            </div>
                            <div className="service-card">
                                <h3>Desenvolvimento de Software</h3>
                                <p>Soluções personalizadas para atender às suas demandas específicas.</p>
                            </div>
                            <div className="service-card">
                                <h3>Segurança da Informação</h3>
                                <p>Proteja seus dados e sistemas contra as ameaças mais recentes.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="main-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div>
                            <h3>Contato</h3>
                            <ul>
                                <li>Telefone: (81) 8888-8888</li>
                                <li>WhatsApp: (81) 99999-9999</li>
                                <li><a href="mailto:contato@nexusti.com.br">contato@nexusti.com.br</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3>Formas de Pagamento</h3>
                            <div className="payment-methods">
                                <img src="/assets/visa-10.svg" alt="Visa" />
                                <img src="/assets/mastercard-modern-design-.svg" alt="Mastercard" />
                                <img src="/assets/pix-2.svg" alt="Pix" />
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 Nexus TI. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Home;