import {
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';

import type {
  IUser,
  ILoginInput,
  IRegisterInput,
  IErrorResponse,
} from '../types/user';

// 1. Tentukan tipe data untuk nilai Context
interface IAuthContext {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; 
  login: (credentials: ILoginInput) => Promise<void>;
  register: (userData: IRegisterInput) => Promise<void>;
  logout: () => void;
  error: string | null; 
}

// 2. Buat Context itu sendiri
export const AuthContext = createContext<IAuthContext | undefined>(undefined);

// 3. Buat komponen Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  // 4. Fungsi untuk mengecek local storage saat aplikasi pertama kali load
  const checkAuthStatus = useCallback(() => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to parse auth data from storage', err);
      // Hapus data korup jika ada
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Jalankan checkAuthStatus sekali saat komponen di-mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // 5. Fungsi Login
  const login = async (credentials: ILoginInput) => {
    setError(null); 
    try {
      const response = await authService.login(credentials);
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      // Simpan ke local storage
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
    } catch (err: any) {
      const errData = err.response?.data as IErrorResponse;
      const message = errData?.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  // 6. Fungsi Register (hanya panggil service, tidak otomatis login)
  const register = async (userData: IRegisterInput) => {
    setError(null);
    try {
      await authService.register(userData);
      // Di sini kita tidak otomatis login, user harus ke halaman login
      // Ini sesuai flow register backend-mu yang tidak mengembalikan token
    } catch (err: any) {
      const errData = err.response?.data as IErrorResponse;
      const message =
        errData?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  // 7. Fungsi Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);

    // Hapus dari local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  // 8. Tentukan nilai yang akan di-provide
  const value: IAuthContext = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};