// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CadastroCliente from './pages/CadastroCliente';
import TrocaSenha from './pages/TrocaSenha';
import SolicitacaoServicos from './pages/SolicitacaoServicos';
import CadastroServico from './pages/CadastroServico'; // <--- IMPORTANTE

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        <Route path="/troca-senha" element={<TrocaSenha />} />
        <Route path="/solicitacao-servicos" element={<SolicitacaoServicos />} />
        {/* A rota abaixo é a que permite acessar a nova página */}
        <Route path="/novo-servico" element={<CadastroServico />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;