import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('Rendering main.jsx');
createRoot(document.getElementById('root')).render(

  <App />

)
