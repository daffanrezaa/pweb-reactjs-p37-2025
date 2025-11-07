import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Style sederhana (diperbarui dengan warna Hijau dan Krem)
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between', // Pisahkan Kiri dan Kanan
  alignItems: 'center',
  padding: '1rem',
   
  
  // Konten Navbar (Link, Tombol) dibatasi dan terpusat
  maxWidth: '1200px', 
  margin: '0 auto', 
  width: '100%', // Tambahkan ini agar margin auto bekerja optimal
};

const NavLinkStyle = {
  marginRight: '1rem',
  textDecoration: 'none',
  // UBAH: Warna link menjadi Krem
  color: '#FFF5D1', 
};

const UserInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  // Tambahan: Agar text "Hi, user@email.com" juga berwarna Krem
  color: '#FFF5D1', 
};

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Arahkan ke login setelah logout 
  };

  return (
    <nav style={navStyle}>
      <div>
        {/* Link ke Halaman Utama (Daftar Buku) */}
        <Link to="/" style={NavLinkStyle}>
          IT Literature Shop
        </Link>
        {/* Tampilkan link Transaksi HANYA jika sudah login  */}
        {isAuthenticated && (
          <>
            {/* TAMBAHAN UNTUK CHECKOUT */}
            <Link to="/checkout" style={NavLinkStyle}>
              Checkout
            </Link>
            {/* AKHIR TAMBAHAN CHECKOUT */}

            <Link to="/transactions" style={NavLinkStyle}>
              Transactions
            </Link>
          </>
        )}
      </div>

      <div style={UserInfoStyle}>
        {isAuthenticated ? (
          // === Tampilan Jika Sudah Login ===
          <>
            <span style={{ marginRight: '1rem' }}>
              Hi, {user?.email} {/* Tampilkan email user  */}
            </span>
            {/* OPSI: Anda mungkin ingin memberi style khusus pada tombol Logout */}
            <button 
              onClick={handleLogout} 
              style={{ 
                backgroundColor: '#FFF5D1', 
                color: '#333', 
                border: 'none', 
                padding: '8px 15px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button> 
          </>
        ) : (
          // === Tampilan Jika Belum Login ===
          <>
            <Link to="/login" style={NavLinkStyle}>
              Login
            </Link>
            <Link to="/register" style={NavLinkStyle}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;