import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, push, Database } from 'firebase/database';
import { DateResponse } from '../types';

// Helper to get environment variables from either REACT_APP_ (CRA) or VITE_ (Vite)
const getEnvVar = (key: string): string | undefined => {
  // Check process.env (standard)
  if (typeof process !== 'undefined' && process.env) {
    const reactAppKey = `REACT_APP_${key}`;
    const viteKey = `VITE_${key}`;
    if (process.env[reactAppKey]) return process.env[reactAppKey];
    if (process.env[viteKey]) return process.env[viteKey];
    // Also check direct mapping if available
    if (process.env[key]) return process.env[key];
  }
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY') || "PLACEHOLDER_KEY",
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN') || "placeholder.firebaseapp.com",
  databaseURL: getEnvVar('FIREBASE_DATABASE_URL') || "https://placeholder-project.firebaseio.com",
  projectId: getEnvVar('FIREBASE_PROJECT_ID') || "placeholder-project",
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET') || "placeholder.appspot.com",
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID') || "123456789",
  appId: getEnvVar('FIREBASE_APP_ID') || "1:123456789:web:abcdef",
};

let app: FirebaseApp | undefined;
let db: Database | undefined;

// Initialize Firebase
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  // Initialize Realtime Database
  db = getDatabase(app);
} catch (e) {
  console.warn("Firebase initialization failed:", e);
}

/**
 * Records the user's response to the Realtime Database.
 * @param responseType The type of response (YES, NO, MAYBE)
 * @param evasiveManeuvers How many times the No button moved
 */
export const recordResponse = async (responseType: 'YES' | 'NO' | 'MAYBE', evasiveManeuvers: number): Promise<void> => {
  const accepted = responseType === 'YES';
  
  const data: DateResponse = {
    accepted,
    responseType,
    evasiveManeuvers,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  // If DB failed to initialize, we can't write
  if (!db) {
    console.error("Database not initialized. Cannot write data:", data);
    return;
  }

  try {
    const responsesRef = ref(db, 'date_responses');
    await push(responsesRef, data);
    console.log("Response recorded successfully to Firebase");
  } catch (error) {
    console.error("Error writing to Firebase RTDB:", error);
    // We re-throw so the UI knows it failed (though we catch it in the UI currently)
    throw error;
  }
};