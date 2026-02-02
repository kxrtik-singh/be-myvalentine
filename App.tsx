import React, { useState, useEffect } from 'react';
import { ProposalCard } from './components/ProposalCard';
import { SuccessCard } from './components/SuccessCard';
import { BackgroundEffects } from './components/BackgroundEffects';
import { ErrorPage } from './components/ErrorPage';
import { recordResponse, checkFirebaseConnection } from './services/firebaseService';

type AppView = 'LOADING' | 'ERROR' | 'PROPOSAL' | 'SUCCESS';

export default function App() {
  // Application State
  const [view, setView] = useState<AppView>('LOADING');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial Connection Check
  useEffect(() => {
    const initApp = async () => {
      try {
        await checkFirebaseConnection();
        setView('PROPOSAL');
      } catch (err: any) {
        console.error("Initialization error:", err);
        setErrorMessage(err.message || "Failed to connect to services.");
        setView('ERROR');
      }
    };
    initApp();
  }, []);

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
      // We still proceed to success screen even if logging fails, 
      // because we don't want to ruin the moment!
    } finally {
      setIsSubmitting(false);
      setView('SUCCESS');
    }
  };

  // Logic to handle "Maybe" click
  const handleMaybeClick = async () => {
    try {
      await recordResponse('MAYBE', noHoverCount);
    } catch (error) {
      console.error("Failed to record maybe response:", error);
    }
  };

  if (view === 'LOADING') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-rose-50 text-rose-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="text-4xl mb-4">❤️</div>
          <p className="font-handwriting text-xl">Preparing something special...</p>
        </div>
      </div>
    );
  }

  if (view === 'ERROR') {
    return <ErrorPage message={errorMessage} />;
  }

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