import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Validação básica
        if (!email || !senha) {
            setMensagem({ texto: 'Preencha todos os campos.', tipo: 'error' });
            return;
        }

        try {
            // Chamada ao Backend criado no Passo 2
            const response = await axios.post('http://localhost:3001/api/login', {
                email,
                senha
            });

            if (response.data.status === 'sucesso') {
                setMensagem({ texto: 'Login realizado!', tipo: 'success' });
                // Salva na sessão (agora usando sessionStorage do browser, mas via React)
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', response.data.usuario.email);
                sessionStorage.setItem('userName', response.data.usuario.nome);
                
                setTimeout(() => navigate('/'), 1500);
            }
        } catch (error) {
            const msgErro = error.response?.data?.mensagem || 'Erro ao conectar ao servidor.';
            setMensagem({ texto: msgErro, tipo: 'error' });
        }
    };

    return (
        <div className="login-container">
            <Link to="/" className="logo-container">
                <img src="/assets/nexus-logo.png" alt="Nexus TI Logo" />
            </Link>

            <h2 className="login-title">Login de Clientes</h2>

            {mensagem.texto && (
                <div className={`message ${mensagem.tipo}`}>
                    {mensagem.texto}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label className="form-label">Login (e-mail)</label>
                    <input 
                        type="email" 
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Senha</label>
                    <input 
                        type="password" 
                        className="form-input"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required 
                    />
                </div>
                <div className="button-group">
                    <button type="submit" className="btn btn-primary">Realizar Login</button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => { setEmail(''); setSenha(''); setMensagem({texto:'', tipo:''}) }}
                    >
                        Limpar
                    </button>
                </div>
            </form>

            <div className="extra-links">
                <Link to="/troca-senha">Trocar senha</Link>
                <Link to="/cadastro-cliente">Cadastrar cliente</Link>
            </div>
        </div>
    );
};

export default Login;