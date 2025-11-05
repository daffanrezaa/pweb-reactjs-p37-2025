import type { ReactNode } from 'react';

// Style sederhana
const errorStyle = {
  color: '#D8000C', // Merah
  backgroundColor: '#FFD2D2', // Latar pink muda
  padding: '10px',
  margin: '10px 0',
  borderRadius: '5px',
  border: '1px solid #D8000C',
};

interface ErrorMessageProps {
  children: ReactNode; // Pesan errornya
}

const ErrorMessage = ({ children }: ErrorMessageProps) => {
  if (!children) {
    return null; // Jangan render apa-apa jika tidak ada pesan
  }

  return <div style={errorStyle}>{children}</div>;
};

export default ErrorMessage;