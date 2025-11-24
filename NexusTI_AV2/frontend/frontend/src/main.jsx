// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Importe seus CSS aqui
import './css/style.css' 
import './css/login.css' // Usado em várias páginas
// Outros CSS específicos podem ser importados nos componentes

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)