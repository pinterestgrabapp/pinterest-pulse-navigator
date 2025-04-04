
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("[main] Starting application initialization");

// Ensure we have a valid DOM element to mount our app
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.log("[main] No root element found, creating one");
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
}

console.log("[main] Creating React root and rendering App");

// Apply dark mode class directly to html element before React initializes
document.documentElement.classList.add('dark');
console.log("[main] Applied dark class to documentElement directly");

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("[main] Render call complete");
