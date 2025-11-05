// Ganti 'axios' dengan 'axiosPublic'
import { axiosPublic } from '../lib/axiosConfig';
import type {
  ILoginInput,
  IRegisterInput,
  ILoginResponse,
  IRegisterResponse,
} from '../types/user';

const login = async (credentials: ILoginInput): Promise<ILoginResponse> => {
  
  const response = await axiosPublic.post<ILoginResponse>(
    '/auth/login',
    credentials
  );
  return response.data;
};

const register = async (
  userData: IRegisterInput
): Promise<IRegisterResponse> => {
  const response = await axiosPublic.post<IRegisterResponse>(
    '/auth/register', 
    userData
  );
  return response.data;
};

export const authService = {
  login,
  register,
};