
// Tipe data untuk input form register
export interface IRegisterInput {
  username?: string; 
  email?: string;
  password?: string;
}

// Tipe data untuk input form login
export interface ILoginInput {
  email?: string; 
  password?: string;
}


// 1. Tipe data untuk User
export interface IUser {
  id: string; 
  username: string;
  email: string;
}


// 2. Tipe data untuk Respons Login Sukses
export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: IUser;
  };
}

// 3. Tipe data untuk Respons Register Sukses
export interface IRegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
}

// 4. Tipe data untuk Respons Error
export interface IErrorResponse {
  success: boolean;
  message: string;
}