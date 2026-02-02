import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import * as firebaseDatabase from 'firebase/database';
import { DateResponse } from '../types';

// Workaround for TypeScript resolution issues where named exports aren't found in some build environments
const { getDatabase, ref, push, goOnline } = firebaseDatabase as any;
type Database = any;

/**
 * Robust Environment Variable Retrieval
 * Prioritizes Vite's import.meta.env, then falls back to process.env.
 * Explicitly checks for VITE_ prefixes which are required for client-side exposure in Vite/Vercel.
 */
const getFirebaseConfig = () => {
  // Safe accessors
  const metaEnv = (import.meta as any).env || {};
  const procEnv = typeof process !== 'undefined' ? process.env : {};

  // Helper to pick the first defined value
  const pick = (...args: (string | undefined)[]) => args.find(val => val !== undefined && val !== '');

  return {
    apiKey: pick(
      metaEnv.VITE_FIREBASE_API_KEY, 
      metaEnv.FIREBASE_API_KEY, 
      procEnv.VITE_FIREBASE_API_KEY,
      procEnv.REACT_APP_FIREBASE_API_KEY,
      procEnv.FIREBASE_API_KEY
    ),
    authDomain: pick(
      metaEnv.VITE_FIREBASE_AUTH_DOMAIN, 
      metaEnv.FIREBASE_AUTH_DOMAIN, 
      procEnv.VITE_FIREBASE_AUTH_DOMAIN,
      procEnv.REACT_APP_FIREBASE_AUTH_DOMAIN,
      procEnv.FIREBASE_AUTH_DOMAIN
    ),
    databaseURL: pick(
      metaEnv.VITE_FIREBASE_DATABASE_URL, 
      metaEnv.FIREBASE_DATABASE_URL, 
      procEnv.VITE_FIREBASE_DATABASE_URL,
      procEnv.REACT_APP_FIREBASE_DATABASE_URL,
      procEnv.FIREBASE_DATABASE_URL
    ),
    projectId: pick(
      metaEnv.VITE_FIREBASE_PROJECT_ID, 
      metaEnv.FIREBASE_PROJECT_ID, 
      procEnv.VITE_FIREBASE_PROJECT_ID,
      procEnv.REACT_APP_FIREBASE_PROJECT_ID,
      procEnv.FIREBASE_PROJECT_ID
    ),
    storageBucket: pick(
      metaEnv.VITE_FIREBASE_STORAGE_BUCKET, 
      metaEnv.FIREBASE_STORAGE_BUCKET, 
      procEnv.VITE_FIREBASE_STORAGE_BUCKET,
      procEnv.REACT_APP_FIREBASE_STORAGE_BUCKET,
      procEnv.FIREBASE_STORAGE_BUCKET
    ),
    messagingSenderId: pick(
      metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID, 
      metaEnv.FIREBASE_MESSAGING_SENDER_ID, 
      procEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
      procEnv.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      procEnv.FIREBASE_MESSAGING_SENDER_ID
    ),
    appId: pick(
      metaEnv.VITE_FIREBASE_APP_ID, 
      metaEnv.FIREBASE_APP_ID, 
      procEnv.VITE_FIREBASE_APP_ID,
      procEnv.REACT_APP_FIREBASE_APP_ID,
      procEnv.FIREBASE_APP_ID
    ),
  };
};

let app: FirebaseApp | undefined;
let db: Database | undefined;
let isDemoMode = false;

/**
 * Initializes Firebase and verifies connectivity.
 * Falls back to "Demo Mode" if configuration is missing to allow UI testing.
 */
export const checkFirebaseConnection = async (): Promise<boolean> => {
  const config = getFirebaseConfig();
  console.log(process.env)
  // 1. Check Configuration
  if (!config.databaseURL || !config.apiKey) {
    console.warn("⚠️ Firebase configuration missing (API_KEY or DATABASE_URL). App running in DEMO MODE. Data will NOT be saved to database.");
    console.log("Debug Config:", JSON.stringify(config, null, 2));
    isDemoMode = true;
    return true; // Return true to allow the app to load in demo mode
  }

  try {
    // 2. Initialize App if not already done
    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }

    // 3. Initialize Database
    if (getDatabase) {
      db = getDatabase(app, config.databaseURL);
      // 4. Simple connectivity check
      goOnline(db);
    } else {
      // Fallback
      db = (app as any).database(config.databaseURL);
      db.goOnline();
    }
    
    console.log("✅ Firebase initialized successfully");
    return true;
  } catch (error: any) {
    console.error("Firebase Connection Verification Failed:", error);
    throw error;
  }
};

/**
 * Records the user's response to the Realtime Database.
 */
export const recordResponse = async (responseType: 'YES' | 'NO' | 'MAYBE', evasiveManeuvers: number): Promise<void> => {
  // Handle Demo Mode
  if (isDemoMode) {
    console.log(`[DEMO MODE] Recording response: ${responseType}, Moves: ${evasiveManeuvers}`);
    // Simulate a small network delay for realism
    await new Promise(resolve => setTimeout(resolve, 600));
    return;
  }

  // Ensure DB is ready
  if (!db) {
     const config = getFirebaseConfig();
     if (config.databaseURL && config.apiKey) {
        if (getApps().length === 0) {
            app = initializeApp(config);
        } else {
            app = getApps()[0];
        }
        if (getDatabase) {
          db = getDatabase(app, config.databaseURL);
        } else {
          db = (app as any).database(config.databaseURL);
        }
     } else {
        console.warn("Lazy init failed: Missing config. Falling back to console log.");
        console.log(`[DEMO MODE] Recording response: ${responseType}, Moves: ${evasiveManeuvers}`);
        return;
     }
  }

  const accepted = responseType === 'YES';
  
  const data: DateResponse = {
    accepted,
    responseType,
    evasiveManeuvers,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  try {
    if (ref && push) {
      const responsesRef = ref(db, 'date_responses');
      await push(responsesRef, data);
    } else {
      // Fallback v8 style
      const responsesRef = db.ref('date_responses');
      await responsesRef.push(data);
    }
  } catch (error) {
    console.error("Error writing to Firebase RTDB:", error);
    // Do not throw in production for user actions, just log it
  }
};