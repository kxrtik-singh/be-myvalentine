import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Position } from '../types';

interface ProposalCardProps {
  onYes: () => void;
  onNoHover: () => void;
  isSubmitting: boolean;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ onYes, onNoHover, isSubmitting }) => {
  const [noBtnPosition, setNoBtnPosition] = useState<Position | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Generate a random position within the viewport safely
  const moveButton = useCallback(() => {
    if (!buttonRef.current) return;
    
    const btnRect = buttonRef.current.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    // Use window dimensions but keep some padding (50px)
    const padding = 50;
    const maxTop = window.innerHeight - btnHeight - padding;
    const maxLeft = window.innerWidth - btnWidth - padding;
    const minTop = padding;
    const minLeft = padding;

    const newTop = Math.max(minTop, Math.random() * maxTop);
    const newLeft = Math.max(minLeft, Math.random() * maxLeft);

    setNoBtnPosition({ top: newTop, left: newLeft });
    onNoHover();
  }, [onNoHover]);

  return (
    <div className="relative text-center" ref={containerRef}>
      <h1 className="text-5xl md:text-7xl font-handwriting text-rose-600 mb-8 drop-shadow-sm animate-pulse">
        Will you go on a date with me?
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mt-12 min-h-[100px]">
        {/* YES BUTTON */}
        <button
          onClick={onYes}
          disabled={isSubmitting}
          className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xl rounded-full shadow-lg transform transition hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed z-20"
        >
          {isSubmitting ? "Processing..." : "Yes, absolutely! 💖"}
        </button>

        {/* NO BUTTON */}
        <button
          ref={buttonRef}
          onMouseEnter={moveButton}
          onClick={moveButton} // In case they manage to click, move it anyway!
          style={
            noBtnPosition
              ? {
                  position: 'fixed',
                  top: `${noBtnPosition.top}px`,
                  left: `${noBtnPosition.left}px`,
                  transition: 'top 0.2s ease-out, left 0.2s ease-out',
                }
              : {}
          }
          className="px-8 py-3 bg-slate-300 hover:bg-slate-400 text-slate-700 font-semibold text-lg rounded-full shadow-md z-20 cursor-default"
        >
          No way
        </button>
      </div>

      <p className="mt-8 text-rose-400 text-sm italic opacity-80">
        (Psst... the 'No' button is feeling a bit shy today)
      </p>
    </div>
  );
};