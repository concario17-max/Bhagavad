import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { UIProvider } from './context/UIContext';

window.addEventListener('error', (e: ErrorEvent) => console.error('Global error:', e.error));

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ThemeProvider>
            <UIProvider>
                <App />
            </UIProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
