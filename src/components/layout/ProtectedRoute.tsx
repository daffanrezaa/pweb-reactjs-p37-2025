import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode; // 'children' adalah halaman yang ingin kita lindungi
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Cek apakah AuthContext masih loading (mengecek local storage)
  if (isLoading) {
    // Tampilkan loading state sederhana selagi mengecek
    // Ini PENTING untuk mencegah "kedipan" ke halaman login 
    return <div>Loading authentication...</div>;
  }

  // 2. Jika sudah tidak loading dan tidak terautentikasi
  if (!isAuthenticated) {
    // Arahkan (redirect) user ke halaman login 
    // 'replace' akan mengganti history, jadi user tidak bisa klik 'back'
    return <Navigate to="/login" replace />;
  }

  // 3. Jika semua aman (tidak loading dan terautentikasi)
  // Tampilkan halaman yang diminta (children)
  return <>{children}</>;
};

export default ProtectedRoute;