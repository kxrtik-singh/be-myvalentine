import React, { useEffect, useState } from 'react';

interface SuccessCardProps {
  attempts: number;
}

export const SuccessCard: React.FC<SuccessCardProps> = ({ attempts }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Small delay for entrance animation
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`text-center transform transition-all duration-1000 ease-out ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="mb-6 flex justify-center">
        {/* Large animated heart SVG */}
        <svg 
          className="w-32 h-32 text-rose-500 animate-bounce" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      <h1 className="text-5xl md:text-7xl font-handwriting text-rose-600 mb-6">
        Thank You!
      </h1>
      
      <p className="text-2xl text-slate-700 font-light mb-8 max-w-lg mx-auto leading-relaxed">
        I'm so happy you said yes! Get ready for an amazing time.
      </p>

      {attempts > 0 && (
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl inline-block border border-rose-100">
          <p className="text-rose-500 text-sm">
            I saw you tried to catch that "No" button 
            <span className="font-bold text-lg mx-1">{attempts}</span> 
            times! 😉 <br/>
            Good thing it was hard to get!
          </p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-3 gap-2 w-full max-w-md mx-auto opacity-50">
        <div className="h-1 bg-rose-300 rounded-full animate-pulse"></div>
        <div className="h-1 bg-rose-300 rounded-full animate-pulse delay-75"></div>
        <div className="h-1 bg-rose-300 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
};