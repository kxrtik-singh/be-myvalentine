import React, { useState, useRef, useCallback } from 'react';
import { Position } from '../types';
import { playPopSound, playClickSound } from '../services/audioService';

interface ProposalCardProps {
  onYes: () => void;
  onMaybe: () => void;
  onNoHover: () => void;
  isSubmitting: boolean;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ onYes, onMaybe, onNoHover, isSubmitting }) => {
  const [noBtnPosition, setNoBtnPosition] = useState<Position | null>(null);
  const [showMaybeMessage, setShowMaybeMessage] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Generate a random position within the viewport safely
  const moveButton = useCallback(() => {
    if (!buttonRef.current) return;
    
    // Play playful sound effect
    playPopSound();
    
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

  const handleYesClick = () => {
    playClickSound();
    onYes();
  };

  const handleMaybeClick = () => {
    playClickSound();
    onMaybe();
    setShowMaybeMessage(true);
  };

  const resetMaybe = () => {
    playClickSound();
    setShowMaybeMessage(false);
  };

  if (showMaybeMessage) {
    return (
      <div className="text-center animate-fade-in bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-rose-200 shadow-xl max-w-md mx-auto">
        <div className="text-6xl mb-4">😉</div>
        <h2 className="text-3xl font-handwriting text-rose-600 mb-4">
          Playing hard to get?
        </h2>
        <p className="text-slate-700 mb-6">
          I respect the hustle. I'll be right here waiting when you're ready to say yes!
        </p>
        <button 
          onClick={resetMaybe}
          className="px-6 py-2 bg-rose-400 hover:bg-rose-500 text-white rounded-full font-semibold transition-colors shadow-sm"
        >
          Okay, ask me again!
        </button>
      </div>
    );
  }

  return (
    <div className="relative text-center" ref={containerRef}>
      <h1 className="text-5xl md:text-7xl font-handwriting text-rose-600 mb-8 drop-shadow-sm animate-pulse">
        Will you go on a date with me?
      </h1>
      
      <div className="flex flex-col items-center justify-center gap-6 mt-12 min-h-[100px]">
        
        {/* Main Buttons Row */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* YES BUTTON */}
          <button
            onClick={handleYesClick}
            disabled={isSubmitting}
            className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xl rounded-full shadow-lg transform transition hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed z-20"
          >
            {isSubmitting ? "Processing..." : "Yes, absolutely! 💖"}
          </button>

          {/* NO BUTTON */}
          <button
            ref={buttonRef}
            onMouseEnter={moveButton}
            onClick={moveButton}
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

        {/* Maybe Later Button */}
        <button 
          onClick={handleMaybeClick}
          className="mt-6 px-6 py-2 bg-white/50 hover:bg-white/80 border border-rose-200 text-rose-500 hover:text-rose-600 font-medium text-sm rounded-full transition-all duration-200 shadow-sm"
        >
          Maybe Later? 🕰️
        </button>

      </div>

      <p className="mt-8 text-rose-400 text-sm italic opacity-80">
        (Psst... the 'No' button is feeling a bit shy today)
      </p>
    </div>
  );
};