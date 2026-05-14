import React from 'react';

export default function Card({ title, children, className = '', elevated = false, ...props }) {
  const panelClass = elevated ? 'glass-panel-elevated' : 'glass-panel';
  
  return (
    <div className={`${panelClass} rounded-xl p-6 ${className}`} {...props}>
      {title && (
        <div className="border-b border-outline-variant/20 pb-4 mb-4">
          <h2 className="font-sora text-xl md:text-2xl font-bold text-on-surface">
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
}
