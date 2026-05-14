import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 h-16 glass-panel border-b border-outline-variant/20 flex items-center justify-between px-5 md:px-10">
      
      {/* Left: Brand */}
      <Link to={isAuthenticated ? '/dashboard' : '/'} className="hover:opacity-80 transition-opacity">
        <div className="relative flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-tertiary/20 animate-ping" />
            <div className="absolute w-8 h-8 rounded-full bg-tertiary/10 blur-sm" />
            <span
              className="material-symbols-outlined relative z-10 text-tertiary"
              style={{
                fontVariationSettings: "'FILL' 1",
                fontSize: '24px',
                animation: 'electric-pulse 2s ease-in-out infinite',
              }}
            >
              bolt
            </span>
          </div>
          <span className="font-sora font-bold text-xl text-primary">
            PollSync
          </span>
        </div>
      </Link>

      {/* Right: Auth controls */}
      {isAuthenticated && (
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="font-hanken-grotesk text-on-surface hover:text-primary transition-colors text-sm font-medium hidden sm:block">
            Dashboard
          </Link>
          <Link to="/poll/create" className="font-hanken-grotesk text-on-surface hover:text-primary transition-colors text-sm font-medium hidden sm:block">
            Create Poll
          </Link>
          
          <div className="h-6 w-px bg-outline-variant/30 hidden sm:block"></div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {user?.name && (
              <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center font-sora font-semibold text-sm border border-primary/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            <button
              onClick={logout}
              className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
