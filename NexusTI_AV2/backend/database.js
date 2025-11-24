// backend/database.js
const sqlite3 = require('sqlite3').verbose();

// Cria o arquivo do banco de dados
const db = new sqlite3.Database('./nexus.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criação das tabelas
db.serialize(() => {
    // Tabela de Clientes
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        nome TEXT NOT NULL,
        cpf TEXT NOT NULL,
        data_nascimento TEXT,
        telefone TEXT,
        estado_civil TEXT,
        escolaridade TEXT
    )`);

    // Tabela de Serviços de TI
    db.run(`CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco REAL NOT NULL,
        prazo INTEGER NOT NULL
    )`);

    // Tabela de Solicitações (Relacionamento Cliente <-> Serviço)
    db.run(`CREATE TABLE IF NOT EXISTS solicitacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER,
        servico_id INTEGER,
        data_pedido TEXT,
        data_prevista TEXT,
        status TEXT,
        preco_momento REAL,
        FOREIGN KEY(cliente_id) REFERENCES clientes(id),
        FOREIGN KEY(servico_id) REFERENCES servicos(id)
    )`);
    
    // Inserir dados iniciais de serviços (opcional, para teste)
    db.get("SELECT count(*) as qtd FROM servicos", (err, row) => {
        if (row.qtd === 0) {
            const stmt = db.prepare("INSERT INTO servicos (nome, preco, prazo) VALUES (?, ?, ?)");
            stmt.run("Consultoria em TI", 500.00, 5);
            stmt.run("Desenvolvimento de Software", 3500.00, 30);
            stmt.run("Segurança da Informação", 1800.00, 15);
            stmt.run("Suporte Técnico Remoto", 250.00, 1);
            stmt.finalize();
        }
    });
});

module.exports = db;