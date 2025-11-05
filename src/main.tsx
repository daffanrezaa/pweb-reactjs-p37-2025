import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Import router
import { AuthProvider } from './contexts/AuthContext'; // 2. Import AuthProvider
import App from './App';
import './index.css'; // Asumsi kamu punya file CSS global

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. Bungkus App dengan BrowserRouter */}
    <BrowserRouter>
      {/* 4. Bungkus App dengan AuthProvider */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);