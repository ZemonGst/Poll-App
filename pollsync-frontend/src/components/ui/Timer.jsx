import React, { useState, useEffect } from 'react';

export default function Timer({ seconds, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onExpire]);

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  
  const isDanger = timeLeft > 0 && timeLeft <= 10;
  
  const colorClass = isDanger 
    ? 'text-error drop-shadow-[0_0_8px_rgba(255,180,171,0.5)] animate-pulse' 
    : 'text-tertiary drop-shadow-[0_0_8px_rgba(183,207,135,0.3)]';

  return (
    <div className={`font-jetbrains-mono text-2xl font-semibold ${colorClass}`}>
      {m}:{s}
    </div>
  );
}
