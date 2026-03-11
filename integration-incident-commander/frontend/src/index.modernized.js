import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.modernized';
import { AppProvider } from './context/AppContext';

/**
 * MODERNIZED Entry Point
 * 
 * IMPROVEMENTS:
 * 1. Wraps App with AppProvider for Context API
 * 2. Enables centralized state management across all components
 * 3. Eliminates prop drilling
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);

// Made with Bob - Modernized Edition