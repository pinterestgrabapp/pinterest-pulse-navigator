
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure we have a valid DOM element to mount our app
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Could not find root element to mount the application');
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
}

// Add error boundary to catch render errors
try {
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App successfully mounted to DOM');
} catch (error) {
  console.error('Failed to render React application:', error);
  // Display fallback UI if render fails
  const rootDiv = document.getElementById('root');
  if (rootDiv) {
    rootDiv.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Sorry, something went wrong</h1>
        <p>The application couldn't load properly. Please check the console for errors.</p>
      </div>
    `;
  }
}
