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
    
    // Attempt to save to Firebase
    try {
      await recordResponse('YES', noHoverCount);
    } catch (error) {
      console.error("Failed to record response:", error);
    } finally {
      setIsSubmitting(false);
      setView('SUCCESS');
    }
  };

  // Logic to handle "Maybe" click
  const handleMaybeClick = async () => {
    // We just record the response, the UI change is handled locally in ProposalCard for the 'playful message'
    try {
      await recordResponse('MAYBE', noHoverCount);
    } catch (error) {
      console.error("Failed to record maybe response:", error);
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
            onMaybe={handleMaybeClick}
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