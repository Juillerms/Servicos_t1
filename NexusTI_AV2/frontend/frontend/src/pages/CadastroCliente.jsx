// frontend/src/pages/CadastroCliente.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/cadastro-cliente.css';
import '../css/login.css';

const CadastroCliente = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
        confirmarSenha: '',
        nome: '',
        cpf: '',
        data_nascimento: '',
        telefone: '',
        estado_civil: 'solteiro',
        escolaridade: '2-completo'
    });
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    // Funções de Validação Auxiliares
    const validateCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let sum = 0, remainder;
        for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    };

    const validatePassword = (password) => {
        if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
        if (!/\d/.test(password)) return "A senha deve conter pelo menos um número.";
        if (!/[A-Z]/.test(password)) return "A senha deve conter pelo menos uma letra maiúscula.";
        if (!/[@#$%&*!?/\\|_\+\.\-=]/.test(password)) return "A senha deve conter um caractere especial.";
        return null;
    };

    // Manipulação dos Inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Máscara básica de CPF e Telefone ao digitar
    const handleMask = (e) => {
        const { id, value } = e.target;
        let maskedValue = value;
        
        if (id === 'cpf') {
            maskedValue = value.replace(/\D/g, "")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else if (id === 'telefone') {
            maskedValue = value.replace(/\D/g, "");
            maskedValue = maskedValue.replace(/^(\d{2})(\d)/g, "($1) $2");
            maskedValue = maskedValue.replace(/(\d)(\d{4})$/, "$1-$2");
        }
        
        setFormData(prev => ({ ...prev, [id]: maskedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        // Validações
        if (formData.senha !== formData.confirmarSenha) {
            setMensagem({ texto: 'As senhas não coincidem.', tipo: 'error' });
            return;
        }
        
        const senhaErro = validatePassword(formData.senha);
        if (senhaErro) {
            setMensagem({ texto: senhaErro, tipo: 'error' });
            return;
        }

        if (!validateCPF(formData.cpf)) {
            setMensagem({ texto: 'CPF inválido.', tipo: 'error' });
            return;
        }

        // Calcular Idade
        const birthDate = new Date(formData.data_nascimento);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age < 18) {
            setMensagem({ texto: 'É necessário ter pelo menos 18 anos.', tipo: 'error' });
            return;
        }

        // Enviar para API
        try {
            const payload = { ...formData, email: formData.email }; // Ajuste para bater com o campo esperado
            const response = await axios.post('http://localhost:3001/api/clientes', payload);
            
            if (response.data.status === 'sucesso') {
                setMensagem({ texto: 'Cliente cadastrado com sucesso!', tipo: 'success' });
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            const msg = error.response?.data?.mensagem || 'Erro ao cadastrar.';
            setMensagem({ texto: msg, tipo: 'error' });
        }
    };

    return (
        <div className="login-container form-container">
             <Link to="/" className="logo-container">
                <img src="/assets/nexus-logo.png" alt="Nexus TI Logo" />
            </Link>
            <h2 className="login-title">Cadastro de Clientes</h2>
            
            {mensagem.texto && <div className={`message ${mensagem.tipo}`}>{mensagem.texto}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">E-mail (Login)</label>
                    <input type="email" id="email" className="form-input" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="senha" className="form-label">Senha</label>
                    <input type="password" id="senha" className="form-input" value={formData.senha} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmarSenha" className="form-label">Confirmação de Senha</label>
                    <input type="password" id="confirmarSenha" className="form-input" value={formData.confirmarSenha} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="nome" className="form-label">Nome Completo</label>
                    <input type="text" id="nome" className="form-input" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="cpf" className="form-label">CPF</label>
                    <input type="text" id="cpf" className="form-input" value={formData.cpf} onChange={handleMask} placeholder="000.000.000-00" maxLength="14" required />
                </div>
                <div className="form-group">
                    <label htmlFor="data_nascimento" className="form-label">Data de Nascimento</label>
                    <input type="date" id="data_nascimento" className="form-input" value={formData.data_nascimento} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="telefone" className="form-label">Telefone/WhatsApp</label>
                    <input type="tel" id="telefone" className="form-input" value={formData.telefone} onChange={handleMask} placeholder="(00) 90000-0000" maxLength="15" />
                </div>

                <div className="button-group">
                    <button type="submit" className="btn btn-primary">Incluir</button>
                    <button type="button" className="btn btn-tertiary" onClick={() => navigate('/')}>Voltar</button>
                </div>
            </form>
        </div>
    );
};

export default CadastroCliente;