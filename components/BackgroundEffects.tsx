import React, { useMemo } from 'react';

export const BackgroundEffects: React.FC = () => {
  // Generate random hearts only once on mount
  const hearts = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      animationDuration: 5 + Math.random() * 10, // 5-15s
      delay: Math.random() * 5,
      size: 10 + Math.random() * 30, // 10-40px
      opacity: 0.1 + Math.random() * 0.4,
      color: Math.random() > 0.5 ? '#fda4af' : '#fb7185', // rose-300 or rose-400
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.left}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            color: heart.color,
            animationDuration: `${heart.animationDuration}s`,
            animationDelay: `-${heart.delay}s`,
            opacity: heart.opacity,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};