// frontend/src/pages/TrocaSenha.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css';       // Estilos base do formulário
import '../css/troca-senha.css'; // Estilos específicos das regras de senha

const TrocaSenha = () => {
    const navigate = useNavigate();
    
    // Estados para os campos
    const [email, setEmail] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    // Lógica de validação trazida do seu arquivo JS original
    const validatePassword = (password) => {
        if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
        if (!/\d/.test(password)) return "A senha deve conter pelo menos um número.";
        if (!/[A-Z]/.test(password)) return "A senha deve conter pelo menos uma letra maiúscula.";
        if (!/[@#$%&*!?/\\|_\+\.\-=]/.test(password)) return "A senha deve conter um caractere especial permitido.";
        return null;
    };

    const handleTrocaSenha = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        // Validações Frontend
        if (!email || !senhaAtual || !novaSenha || !confirmarSenha) {
            setMensagem({ texto: 'Por favor, preencha todos os campos.', tipo: 'error' });
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setMensagem({ texto: 'As novas senhas não coincidem.', tipo: 'error' });
            return;
        }

        const erroSenha = validatePassword(novaSenha);
        if (erroSenha) {
            setMensagem({ texto: erroSenha, tipo: 'error' });
            return;
        }

        // Chamada ao Backend
        try {
            const response = await axios.post('http://localhost:3001/api/troca-senha', {
                email: email,
                senhaAtual: senhaAtual,
                novaSenha: novaSenha
            });

            if (response.data.status === 'sucesso') {
                setMensagem({ texto: 'Senha alterada com sucesso! Redirecionando...', tipo: 'success' });
                // Limpa os campos sensíveis
                setSenhaAtual('');
                setNovaSenha('');
                setConfirmarSenha('');
                
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            // Trata erros vindos do backend (ex: senha atual incorreta)
            const msgErro = error.response?.data?.mensagem || 'Erro ao processar a solicitação.';
            setMensagem({ texto: msgErro, tipo: 'error' });
        }
    };

    const limparCampos = () => {
        setEmail('');
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
        setMensagem({ texto: '', tipo: '' });
    };

    return (
        <div className="login-container">
            <Link to="/" className="logo-container">
                <img src="/assets/nexus-logo.png" alt="Nexus TI Logo" />
            </Link>

            <h2 className="login-title">Troca de Senha de Clientes</h2>

            {mensagem.texto && (
                <div className={`message ${mensagem.tipo}`}>
                    {mensagem.texto}
                </div>
            )}

            <form onSubmit={handleTrocaSenha}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Login (e-mail)</label>
                    <input 
                        type="email" 
                        id="email" 
                        className="form-input" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>

                {/* Campo Novo exigido pelo Backend */}
                <div className="form-group">
                    <label htmlFor="senhaAtual" className="form-label">Senha Atual</label>
                    <input 
                        type="password" 
                        id="senhaAtual" 
                        className="form-input" 
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="novaSenha" className="form-label">Nova Senha</label>
                    <input 
                        type="password" 
                        id="novaSenha" 
                        className="form-input" 
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="confirmarSenha" className="form-label">Confirmação da Nova Senha</label>
                    <input 
                        type="password" 
                        id="confirmarSenha" 
                        className="form-input" 
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required 
                    />
                </div>

                <div className="password-rules">
                    <h4>Regras para a senha:</h4>
                    <ul>
                        <li>Pelo menos 6 caracteres.</li>
                        <li>Pelo menos uma letra maiúscula.</li>
                        <li>Pelo menos um número.</li>
                        <li>Pelo menos um caractere especial: @ # $ % & * ! ? / \ | - _ + . =</li>
                    </ul>
                </div>

                <div className="button-group">
                    <button type="submit" className="btn btn-primary">Trocar Senha</button>
                    <button type="button" className="btn btn-secondary" onClick={limparCampos}>
                        Limpar
                    </button>
                </div>
            </form>

            <div className="extra-links">
                <Link to="/login">Voltar para o Login</Link>
            </div>
        </div>
    );
};

export default TrocaSenha;