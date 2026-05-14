import React from 'react';

export default function Spinner({ variant = 'inline' }) {
  const containerClasses = 
    variant === 'fullpage' 
      ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-[9999]' 
      : 'inline-flex items-center justify-center p-2';

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-10 h-10 border-4 border-tertiary/20 border-t-tertiary rounded-full animate-spin"></div>
        {/* Inner Pulsing Dot */}
        <div className="absolute w-2 h-2 bg-tertiary rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
