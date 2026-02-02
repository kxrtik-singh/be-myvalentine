import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, push, Database } from 'firebase/database';
import { DateResponse } from '../types';

// NOTE: In a real deployment, these values should come from process.env or import.meta.env
// For this generated code to be runnable immediately without crashing on empty keys, 
// we will implement a "mock" mode if keys are missing.

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "PLACEHOLDER_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://placeholder-project.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

let app: FirebaseApp | undefined;
let db: Database | undefined;

// Initialize Firebase only if we haven't already
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  // Initialize Realtime Database
  db = getDatabase(app);
} catch (e) {
  console.warn("Firebase initialization failed. Running in offline/demo mode. Check your configuration keys.");
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

  if (!db || firebaseConfig.apiKey === "PLACEHOLDER_KEY") {
    console.log("MOCK RTDB WRITE:", data);
    // Simulate network delay
    return new Promise(resolve => setTimeout(resolve, 800));
  }

  try {
    const responsesRef = ref(db, 'date_responses');
    await push(responsesRef, data);
  } catch (error) {
    console.error("Error writing to Firebase RTDB: ", error);
    throw error;
  }
};