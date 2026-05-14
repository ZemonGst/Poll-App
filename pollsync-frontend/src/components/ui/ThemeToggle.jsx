import React from 'react';
import { useSelector } from 'react-redux';
import { useThemeToggle } from '../../hooks/useThemeToggle';

export default function ThemeToggle() {
  const theme = useSelector((state) => state.theme?.theme || 'dark');
  const toggleTheme = useThemeToggle();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all duration-300 flex items-center justify-center relative w-10 h-10"
      aria-label="Toggle theme"
    >
      <span 
        className={`material-symbols-outlined absolute transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        light_mode
      </span>
      <span 
        className={`material-symbols-outlined absolute transition-opacity duration-300 ${
          theme === 'light' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        dark_mode
      </span>
    </button>
  );
}
