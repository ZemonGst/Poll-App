import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeCard({ url, shareCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col items-center max-w-sm mx-auto text-center">
      <h3 className="font-sora text-lg font-bold text-on-surface mb-4">Scan to Vote</h3>
      
      <div className="bg-white p-3 rounded-xl border border-outline-variant/30 shadow-lg mb-6">
        <QRCodeSVG 
          value={url} 
          size={200} 
          bgColor="#ffffff" 
          fgColor="#151312" 
          level="H" 
          includeMargin={false} 
        />
      </div>

      <div className="w-full bg-surface-container-highest border border-outline-variant/50 rounded-lg p-4 flex flex-col items-center gap-3">
        <span className="font-jetbrains-mono text-xs text-on-surface-variant break-all text-center uppercase tracking-widest">
          Share Code: <span className="text-primary font-bold text-sm ml-1">{shareCode}</span>
        </span>
        
        <div className="w-full h-px bg-outline-variant/30 my-1"></div>

        <div className="flex flex-col items-center justify-between w-full gap-3">
          <span className="font-jetbrains-mono text-[11px] text-on-surface-variant/80 truncate w-full px-2" title={url}>
            {url}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-surface-bright hover:bg-outline-variant/30 text-on-surface font-hanken-grotesk text-sm py-2 px-4 rounded-md transition-colors border border-outline-variant/30 w-full"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
