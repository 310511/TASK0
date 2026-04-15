import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/variables.css';
import './styles/global.css';

const setFavicon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#818cf8" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#0f172a" />
      <circle cx="32" cy="32" r="22" fill="url(#g)" />
      <path d="M20 24h24v4H20zm0 10h24v4H20zm0 10h16v4H20z" fill="#fff" />
    </svg>
  `;
  const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  let favicon = document.querySelector("link[rel='icon']");

  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    document.head.appendChild(favicon);
  }

  favicon.setAttribute('type', 'image/svg+xml');
  favicon.setAttribute('href', href);
};

setFavicon();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
