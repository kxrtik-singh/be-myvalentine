import React, { useState, useEffect } from 'react';
import { ProposalCard } from './components/ProposalCard';
import { SuccessCard } from './components/SuccessCard';
import { BackgroundEffects } from './components/BackgroundEffects';
import { recordResponse } from './services/firebaseService';

export default function App() {
  // Application State
  const [view, setView] = useState<'PROPOSAL' | 'SUCCESS'>('PROPOSAL');
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Logic to handle the "No" button hover
  const handleNoHover = () => {
    setNoHoverCount((prev) => prev + 1);
  };

  // Logic to handle "Yes" click
  const handleYesClick = async () => {
    setIsSubmitting(true);
    
    // Attempt to save to Firebase, but don't block UI if it fails (e.g. invalid config)
    try {
      await recordResponse(true, noHoverCount);
    } catch (error) {
      console.error("Failed to record response:", error);
    } finally {
      setIsSubmitting(false);
      setView('SUCCESS');
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <BackgroundEffects />

      {/* Main Content Area */}
      <main className="z-10 w-full max-w-4xl px-4 flex flex-col items-center justify-center min-h-[60vh]">
        {view === 'PROPOSAL' ? (
          <ProposalCard 
            onYes={handleYesClick}
            onNoHover={handleNoHover}
            isSubmitting={isSubmitting}
          />
        ) : (
          <SuccessCard 
            attempts={noHoverCount} 
          />
        )}
      </main>

      {/* Footer / Copyright */}
      <footer className="absolute bottom-4 text-pink-300 text-xs z-10">
        Made with ❤️
      </footer>
    </div>
  );
}