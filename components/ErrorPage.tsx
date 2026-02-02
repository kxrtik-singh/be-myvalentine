import React from 'react';

interface ErrorPageProps {
  message?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 text-slate-700 p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-rose-100">
        <div className="text-6xl mb-6">💔</div>
        <h1 className="text-2xl font-bold text-rose-600 mb-4 font-handwriting">
          Connection Issue
        </h1>
        <p className="mb-6 text-sm text-slate-500 leading-relaxed">
          {message || "We couldn't connect to the database. This usually means the application isn't configured correctly yet."}
        </p>
        <div className="bg-slate-100 p-4 rounded-lg text-xs text-left overflow-x-auto">
          <p className="font-mono text-slate-500 mb-2 font-bold">Troubleshooting:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 font-mono">
            <li>Check internet connection</li>
            <li>Verify FIREBASE_DATABASE_URL</li>
            <li>Check browser console for errors</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};