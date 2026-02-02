import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Firestore } from 'firebase/firestore';
import { DateResponse } from '../types';

// NOTE: In a real deployment, these values should come from process.env or import.meta.env
// For this generated code to be runnable immediately without crashing on empty keys, 
// we will implement a "mock" mode if keys are missing.

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "PLACEHOLDER_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

// Initialize Firebase only if we haven't already
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase initialization failed. Running in offline/demo mode. Check your configuration keys.");
}

/**
 * Records the user's response to the Firestore database.
 * @param accepted Whether they clicked Yes
 * @param evasiveManeuvers How many times the No button moved
 */
export const recordResponse = async (accepted: boolean, evasiveManeuvers: number): Promise<void> => {
  const data: DateResponse = {
    accepted,
    evasiveManeuvers,
    timestamp: new Date(),
    userAgent: navigator.userAgent
  };

  if (!db || firebaseConfig.apiKey === "PLACEHOLDER_KEY") {
    console.log("MOCK FIREBASE WRITE:", data);
    // Simulate network delay
    return new Promise(resolve => setTimeout(resolve, 800));
  }

  try {
    const responsesCol = collection(db, 'date_responses');
    await addDoc(responsesCol, data);
  } catch (error) {
    console.error("Error writing to Firebase: ", error);
    throw error;
  }
};