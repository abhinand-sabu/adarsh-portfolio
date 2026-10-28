import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ⚡ Creative ASCII Art Easter Egg Log crediting @abhinand.33
const asciiArt = `
  █████╗ ██████╗  █████╗ ██████╗ ███████╗██╗  ██╗
 ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██║  ██║
 ███████║██║  ██║███████║██████╔╝███████╗███████║
 ██╔══██║██║  ██║██╔══██║██╔══██╗╚════██║██╔══██║
 ██║  ██║██████╔╝██║  ██║██║  ██║███████║██║  ██║
 ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
`;

console.log(
  `%c${asciiArt}\n` +
  `%c⚡ Designed & Engineered by @abhinand.33\n` +
  `%c✦ Adarsh A L — Graphic Designer & Video Editor Portfolio\n` +
  `%c📸 Instagram: https://instagram.com/abhinand.33\n` +
  `%c✨ Ultra-Minimalist High-Performance Build Initialized`,
  'color: #dfba73; font-family: monospace; font-size: 10px; font-weight: bold; line-height: 1.1;',
  'color: #dfba73; font-size: 13px; font-weight: bold; padding: 4px 0; text-shadow: 0 0 10px rgba(223,186,115,0.4);',
  'color: #f1f5f9; font-size: 12px; font-weight: 600; padding: 2px 0;',
  'color: #38bdf8; font-size: 11px; font-family: monospace; text-decoration: underline;',
  'color: #94a3b8; font-size: 10px; font-style: italic; padding-top: 4px;'
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

