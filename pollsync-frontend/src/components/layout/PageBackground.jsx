import React from 'react';
import { useSelector } from 'react-redux';

export default function PageBackground({ children }) {
  const { theme } = useSelector(state => state.theme);

  return (
    <div className={children ? 'relative min-h-screen' : undefined}>
      {/* Fixed ambient background layer */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Primary ambient blob */}
        <div className={`absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] transition-colors duration-700 ${theme === 'light' ? 'bg-primary/10' : 'bg-primary/5'}`} />
        {/* Tertiary ambient blob */}
        <div className={`absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] transition-colors duration-700 ${theme === 'light' ? 'bg-tertiary/8' : 'bg-tertiary/5'}`} />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      </div>
      {/* Page content rendered above the background */}
      {children && (
        <div className="relative z-10">{children}</div>
      )}
    </div>
  );
}
