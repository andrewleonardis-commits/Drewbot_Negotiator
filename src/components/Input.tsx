import React from 'react';

interface InputProps {
  label: string;
  id: string;
  value: string | number | '';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number' | 'date';
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ label, id, value, onChange, type = 'number', placeholder, icon, disabled = false }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2 tracking-wide">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-500 sm:text-sm">{icon}</span>
          </div>
        )}
        <input
          type={type}
          name={id}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full rounded-md border-0 py-2.5 bg-slate-950 text-slate-100 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 ${icon ? 'pl-7' : 'pl-3'} disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70`}
          placeholder={placeholder}
          min="0"
        />
      </div>
    </div>
  );
};

export default Input;