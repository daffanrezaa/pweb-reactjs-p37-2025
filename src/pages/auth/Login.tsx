import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Style sederhana untuk error (bisa kamu pindah ke CSS)
const errorStyle = {
  color: 'red',
  marginBottom: '10px',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error setiap kali submit

    try {
      // Panggil fungsi login dari AuthContext
      await login({ email, password });

      // Jika sukses, redirect ke halaman utama (daftar buku)
      navigate('/');
    } catch (err: any) {
      // Jika error, tampilkan pesan (dari Error yg kita 'throw' di AuthContext)
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {/* Tampilkan pesan error jika ada */}
        {error && <div style={errorStyle}>{error}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
        <p>
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
         </p>
    </div>
  );
};

export default Login;