// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors()); // Permite que o React acesse o Backend
app.use(bodyParser.json());

// --- ENDPOINTS ---

// 1. Cadastro de Cliente
app.post('/api/clientes', (req, res) => {
    const { email, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade } = req.body;
    
    // Validar se login existe
    db.get("SELECT email FROM clientes WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ status: 'erro', mensagem: err.message });
        if (row) return res.status(400).json({ status: 'erro', mensagem: 'Login já existe.' });

        const sql = `INSERT INTO clientes (email, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [email, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade], function(err) {
            if (err) return res.status(500).json({ status: 'erro', mensagem: err.message });
            res.json({ status: 'sucesso', id: this.lastID });
        });
    });
});

// 2. Autenticação (Login)
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    db.get("SELECT * FROM clientes WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ status: 'erro', mensagem: err.message });
        
        // Verificação simples de senha (conforme pedido)
        if (!user || user.senha !== senha) {
            return res.status(401).json({ status: 'erro', mensagem: 'Credenciais inválidas' });
        }
        
        // Retorna dados básicos do usuário para salvar na sessão do frontend
        res.json({ status: 'sucesso', usuario: { id: user.id, nome: user.nome, email: user.email } });
    });
});

// 3. Troca de Senha
app.post('/api/troca-senha', (req, res) => {
    const { email, senhaAtual, novaSenha } = req.body;
    
    db.get("SELECT * FROM clientes WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ status: 'erro', mensagem: err.message });
        
        if (!user || user.senha !== senhaAtual) {
            return res.status(400).json({ status: 'erro', mensagem: 'Senha atual incorreta ou usuário não encontrado.' });
        }

        db.run("UPDATE clientes SET senha = ? WHERE id = ?", [novaSenha, user.id], (err) => {
            if (err) return res.status(500).json({ status: 'erro', mensagem: err.message });
            res.json({ status: 'sucesso', mensagem: 'Senha alterada com sucesso.' });
        });
    });
});

// 4. Cadastro de Serviços de TI
app.post('/api/servicos', (req, res) => {
    const { nome, descricao, preco, prazo } = req.body;
    const sql = "INSERT INTO servicos (nome, descricao, preco, prazo) VALUES (?, ?, ?, ?)";
    db.run(sql, [nome, descricao, preco, prazo], function(err) {
        if (err) return res.status(500).json({ status: 'erro', mensagem: err.message });
        res.json({ status: 'sucesso', id: this.lastID });
    });
});

// 5. Consulta de Serviços de TI
app.get('/api/servicos', (req, res) => {
    db.all("SELECT * FROM servicos", [], (err, rows) => {
        if (err) return res.status(500).json({ status: 'erro', mensagem: err.message });
        res.json({ status: 'sucesso', dados: rows });
    });
});

// 6. Consulta Solicitações de um Usuário
app.get('/api/solicitacoes/:email', (req, res) => {
    const email = req.params.email;
    
    // Primeiro pega o ID do cliente pelo email
    db.get("SELECT id FROM clientes WHERE email = ?", [email], (err, cliente) => {
        if (err || !cliente) return res.status(400).json({ status: 'erro', mensagem: 'Cliente não encontrado' });

        // --- CORREÇÃO IMPORTANTE AQUI ---
        // Adicionado 's.servico_id' na seleção para garantir que o frontend receba o ID
        // para usar em atualizações futuras.
        const sql = `
            SELECT s.id, s.servico_id, s.data_pedido, s.data_prevista, s.status, s.preco_momento, svc.nome as nome_servico 
            FROM solicitacoes s
            JOIN servicos svc ON s.servico_id = svc.id
            WHERE s.cliente_id = ?
        `;
        // -------------------------------

        db.all(sql, [cliente.id], (err, rows) => {
            if (err) return res.status(500).json({ status: 'erro', mensagem: err.message });
            res.json({ status: 'sucesso', dados: rows });
        });
    });
});

// 7. Atualização das Solicitações (Apaga tudo e insere a nova lista)
app.post('/api/solicitacoes/atualizar', (req, res) => {
    const { email, solicitacoes } = req.body; // solicitacoes é um array de objetos

    db.get("SELECT id FROM clientes WHERE email = ?", [email], (err, cliente) => {
        if (err || !cliente) return res.status(400).json({ status: 'erro', mensagem: 'Cliente não encontrado' });

        const clienteId = cliente.id;

        // Inicia transação manual (serializada)
        db.serialize(() => {
            // 1. Apagar solicitações antigas
            db.run("DELETE FROM solicitacoes WHERE cliente_id = ?", [clienteId], (err) => {
                if (err) return res.status(500).json({ status: 'erro', mensagem: 'Erro ao limpar carrinho.' });
                
                // 2. Inserir novas solicitações
                if (solicitacoes && solicitacoes.length > 0) {
                    const stmt = db.prepare(`INSERT INTO solicitacoes (cliente_id, servico_id, data_pedido, data_prevista, status, preco_momento) VALUES (?, ?, ?, ?, ?, ?)`);
                    
                    solicitacoes.forEach(sol => {
                        stmt.run(clienteId, sol.servico_id, sol.data_pedido, sol.data_prevista, sol.status, sol.preco);
                    });
                    
                    stmt.finalize((err) => {
                        if (err) return res.status(500).json({ status: 'erro', mensagem: 'Erro ao salvar itens.' });
                        res.json({ status: 'sucesso', mensagem: 'Carrinho atualizado.' });
                    });
                } else {
                    res.json({ status: 'sucesso', mensagem: 'Carrinho limpo.' });
                }
            });
        });
    });
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});