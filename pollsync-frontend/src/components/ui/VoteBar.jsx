import React from 'react';

const VoteBar = ({ percentage, label, votes, isLeading }) => {
  const safePercentage = Math.max(percentage, 2);
  
  return (
    <div className="w-full" style={{ minHeight: '48px' }}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-hanken-grotesk text-sm text-on-surface">
          {label}
        </span>
        <span className="font-jetbrains-mono text-xs text-on-surface-variant">
          {votes} · {Math.round(percentage)}%
        </span>
      </div>
      <div 
        className="w-full bg-surface-container-highest rounded-full overflow-hidden"
        style={{ height: '10px' }}
      >
        <div
          style={{
            width: `${safePercentage}%`,
            height: '10px',
            backgroundColor: '#b7cf87',
            borderRadius: '9999px',
            transition: 'width 0.6s ease-out',
            boxShadow: isLeading 
              ? '0 0 10px rgba(183,207,135,0.5)' 
              : 'none',
          }}
        />
      </div>
    </div>
  );
};

export default VoteBar;
