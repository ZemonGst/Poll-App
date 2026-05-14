import React from 'react';

export default function VoteBar({ percentage, label, votes, isLeading }) {
  const displayPercent = Math.round(percentage);
  
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-end mb-2">
        <span className="font-hanken-grotesk text-on-surface font-medium">
          {label}
        </span>
        <span className="font-jetbrains-mono text-on-surface-variant text-sm flex gap-3">
          <span>{votes} {votes === 1 ? 'vote' : 'votes'}</span>
          <span>{displayPercent}%</span>
        </span>
      </div>
      
      <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
        <div 
          className={`bg-gradient-to-r from-tertiary to-tertiary/70 h-full rounded-full transition-all duration-700 ease-out ${isLeading ? 'shadow-[0_0_12px_rgba(183,207,135,0.4)]' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
