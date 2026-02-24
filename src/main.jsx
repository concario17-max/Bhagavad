import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { UIProvider } from './context/UIContext.jsx'

window.addEventListener('error', (e) => console.error('Global error:', e.error));

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <UIProvider>
                <App />
            </UIProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
