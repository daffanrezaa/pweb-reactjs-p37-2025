import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Style sederhana (bisa kamu pindah ke CSS)
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '1rem',
  backgroundColor: '#eee',
};

const NavLinkStyle = {
  marginRight: '1rem',
  textDecoration: 'none',
  color: '#333',
};

const UserInfoStyle = {
  display: 'flex',
  alignItems: 'center',
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
            <button onClick={handleLogout}>Logout</button> {/* Tombol Logout  */}
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