import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/shell.css'   // after index.css so the shell rules win
import './styles/sidebar.css' // labelled sidebar + guide pages

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)