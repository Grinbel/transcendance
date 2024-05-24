import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import { GameProvider } from './contexts/GameContext.jsx'; 
import './index.css'
// import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <GameProvider>
      <App />
    </GameProvider>
  </BrowserRouter>,
)
