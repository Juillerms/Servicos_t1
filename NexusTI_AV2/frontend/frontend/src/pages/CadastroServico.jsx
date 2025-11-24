import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css'; // Reutilizando estilo de formulário

const CadastroServico = () => {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        prazo: ''
    });
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação (Obrigatoriedade)
        if (!formData.nome || !formData.preco || !formData.prazo) {
            setMensagem({ texto: 'Preencha os campos obrigatórios.', tipo: 'error' });
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/servicos', formData);
            setMensagem({ texto: 'Serviço cadastrado com sucesso!', tipo: 'success' });
            // Limpa formulário
            setFormData({ nome: '', descricao: '', preco: '', prazo: '' });
        } catch (error) {
            setMensagem({ texto: 'Erro ao cadastrar serviço.', tipo: 'error' });
        }
    };

    return (
        <div className="login-container">
             <Link to="/" className="logo-container">
                <img src="/assets/nexus-logo.png" alt="Nexus TI Logo" />
            </Link>
            <h2 className="login-title">Novo Serviço de TI</h2>
            
            {mensagem.texto && <div className={`message ${mensagem.tipo}`}>{mensagem.texto}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nome do Serviço *</label>
                    <input name="nome" value={formData.nome} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Descrição</label>
                    <input name="descricao" value={formData.descricao} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label className="form-label">Preço (R$) *</label>
                    <input type="number" step="0.01" name="preco" value={formData.preco} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Prazo (dias) *</label>
                    <input type="number" name="prazo" value={formData.prazo} onChange={handleChange} className="form-input" required />
                </div>
                
                <button type="submit" className="btn btn-primary">Cadastrar</button>
                <Link to="/" className="btn btn-tertiary" style={{display: 'block', textAlign:'center', marginTop: '10px'}}>Voltar</Link>
            </form>
        </div>
    );
};

export default CadastroServico;