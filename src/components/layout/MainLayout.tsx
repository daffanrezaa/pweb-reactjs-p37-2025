// src/components/layout/MainLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 

const fullWidthNavWrapperStyle = {
  backgroundColor: '#3B572F', // Background hijau yang mengisi penuh
  width: '100vw', // PENTING: Memastikan lebar 100% dari viewport
  top: 0,
  left: 0,
  zIndex: 1000, // Agar tidak tertutup konten lain
};

const MainLayout: React.FC = () => {
  return (
    <div style={fullWidthNavWrapperStyle}>
        <Navbar />
      
        {/* Konten Halaman lainnya (BookList, Checkout, dll) */}
        <main style={{ padding: '20px', paddingTop: '80px' }}> {/* Tambah padding atas agar konten tidak tertutup fixed navbar */}
            <Outlet />
        </main>
    </div>
  );
};

export default MainLayout;