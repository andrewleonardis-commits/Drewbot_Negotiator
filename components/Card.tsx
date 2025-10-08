import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-slate-900/70 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-500/10 w-full ${className}`}>
      {title && (
        <div className="border-b border-cyan-500/30 px-6 py-4">
          <h3 className="text-lg font-semibold text-cyan-400 tracking-wider">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;