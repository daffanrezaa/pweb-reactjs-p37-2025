import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// Style sederhana untuk layout (bisa kamu pindah ke CSS)
const mainContentStyle = {
  padding: '1rem', // Beri jarak padding untuk konten halaman
};

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main style={mainContentStyle}>
        {/* <Outlet> adalah placeholder dari React Router */}
        {/* Ini akan diisi oleh komponen halaman (misal: BookList) */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;