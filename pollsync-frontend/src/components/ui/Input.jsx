import React from 'react';

export default function Input({ label, type = 'text', icon, error, placeholder, value, onChange, name, className = '', ...rest }) {
  return (
    <div className={className}>
      {label && (
        <label className="block font-jetbrains-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant z-10 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-surface-container-highest border ${error ? 'border-error/50' : 'border-outline-variant/50'} rounded-lg py-3 ${icon ? 'pl-10' : 'pl-4'} pr-4 text-on-surface font-hanken-grotesk focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant/50 relative z-0`}
          {...rest}
        />
      </div>
      {error && <p className="text-error text-sm mt-1 font-hanken-grotesk">{error}</p>}
    </div>
  );
}
