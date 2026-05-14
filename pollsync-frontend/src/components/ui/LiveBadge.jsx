import React from 'react';

export default function LiveBadge() {
  return (
    <div className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full border border-tertiary/20 inline-flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
      </span>
      <span className="font-jetbrains-mono text-xs uppercase font-bold tracking-widest">
        LIVE
      </span>
    </div>
  );
}
