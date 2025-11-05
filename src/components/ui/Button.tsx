import type { ReactNode, ComponentPropsWithoutRef } from 'react';

// Gabungkan props HTML <button> standar dengan props kustom kita
type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  children: ReactNode;
  isLoading?: boolean;
};

// Style sederhana (bisa kamu pindah ke CSS)
const buttonStyle = {
  padding: '10px 15px',
  fontSize: '16px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  color: 'white',
};

const disabledStyle = {
  backgroundColor: '#ccc',
  cursor: 'not-allowed',
};

const Button = ({
  children,
  isLoading = false,
  ...props // ...props akan menampung 'onClick', 'type', 'className', dll.
}: ButtonProps) => {
  return (
    <button
      style={{
        ...buttonStyle,
        ...(isLoading ? disabledStyle : {}),
      }}
      disabled={isLoading}
      {...props} // Terapkan semua props <button> standar
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;