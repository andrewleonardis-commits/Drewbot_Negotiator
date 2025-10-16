import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/30 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;