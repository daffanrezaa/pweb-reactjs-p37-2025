import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 IT Literature Shop. Made with ❤️ by Team P37</p>
      </footer>
    </div>
  );
};

export default MainLayout;