// frontend/src/pages/CadastroServico.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css'; // Reutilizamos o CSS de formulário para manter o padrão visual

const CadastroServico = () => {
    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        prazo: ''
    });

    // Estado para mensagens de feedback (sucesso ou erro)
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    // Função genérica para atualizar o estado quando o utilizador digita
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Função de envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        // 1. Validação de Obrigatoriedade (Requisito AV2: Validação no React)
        if (!formData.nome || !formData.preco || !formData.prazo) {
            setMensagem({ 
                texto: 'Por favor, preencha todos os campos obrigatórios (*).', 
                tipo: 'error' 
            });
            return;
        }

        // 2. Envio para o Backend
        try {
            const response = await axios.post('http://localhost:3001/api/servicos', {
                nome: formData.nome,
                descricao: formData.descricao,
                preco: parseFloat(formData.preco), // Garante que vai como número
                prazo: parseInt(formData.prazo)    // Garante que vai como inteiro
            });

            if (response.data.status === 'sucesso') {
                // 3. Exibir o ID gerado (Prova do autoincremento do banco)
                const novoId = response.data.id;
                setMensagem({ 
                    texto: `Serviço cadastrado com sucesso! (ID Gerado no Banco: ${novoId})`, 
                    tipo: 'success' 
                });

                // Limpar formulário após sucesso
                setFormData({ nome: '', descricao: '', preco: '', prazo: '' });
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            setMensagem({ 
                texto: 'Erro ao cadastrar serviço. Verifique se o servidor está rodando.', 
                tipo: 'error' 
            });
        }
    };

    return (
        <div className="login-container">
             {/* Reutiliza a logo e estilo container do Login para manter consistência */}
             <Link to="/" className="logo-container">
                <img src="/assets/nexus-logo.png" alt="Nexus TI Logo" />
            </Link>
            
            <h2 className="login-title">Novo Serviço de TI</h2>
            
            {/* Área de Mensagens de Erro/Sucesso */}
            {mensagem.texto && (
                <div className={`message ${mensagem.tipo}`}>
                    {mensagem.texto}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nome do Serviço *</label>
                    <input 
                        type="text" 
                        name="nome" 
                        value={formData.nome} 
                        onChange={handleChange} 
                        className="form-input" 
                        placeholder="Ex: Manutenção de Servidores"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Descrição</label>
                    <input 
                        type="text" 
                        name="descricao" 
                        value={formData.descricao} 
                        onChange={handleChange} 
                        className="form-input" 
                        placeholder="Breve descrição do serviço"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Preço (R$) *</label>
                    <input 
                        type="number" 
                        step="0.01" 
                        name="preco" 
                        value={formData.preco} 
                        onChange={handleChange} 
                        className="form-input" 
                        placeholder="0.00"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Prazo Padrão (dias) *</label>
                    <input 
                        type="number" 
                        name="prazo" 
                        value={formData.prazo} 
                        onChange={handleChange} 
                        className="form-input" 
                        placeholder="Ex: 5"
                    />
                </div>
                
                <div className="button-group" style={{ flexDirection: 'column' }}>
                    <button type="submit" className="btn btn-primary">Cadastrar Serviço</button>
                    <Link to="/solicitacao-servicos" className="btn btn-tertiary" style={{textAlign: 'center', marginTop: '10px'}}>
                        Voltar para Solicitações
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CadastroServico;