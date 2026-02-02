import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import * as firebaseDatabase from "firebase/database";
import { DateResponse } from "../types";

// Workaround for TypeScript resolution issues where named exports aren't found
const { getDatabase, ref, push, goOnline } = firebaseDatabase as any;
type Database = any;

// Helper to get environment variables securely
const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== "undefined" && process.env) {
    return (
      process.env[`REACT_APP_${key}`] ||
      process.env[`VITE_${key}`] ||
      process.env[key]
    );
  }
  return undefined;
};

// We construct the config object but do not initialize immediately
const getFirebaseConfig = () => ({
  apiKey: getEnvVar("FIREBASE_API_KEY"),
  authDomain: getEnvVar("FIREBASE_AUTH_DOMAIN"),
  databaseURL: getEnvVar("FIREBASE_DATABASE_URL"),
  projectId: getEnvVar("FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("FIREBASE_APP_ID"),
});

let app: FirebaseApp | undefined;
let db: Database | undefined;
let isDemoMode = false;

/**
 * Initializes Firebase and verifies connectivity.
 * Falls back to "Demo Mode" if configuration is missing to allow UI testing.
 */
export const checkFirebaseConnection = async (): Promise<boolean> => {
  const config = getFirebaseConfig();
  console.log(process.env);
  console.log(getEnvVar("FIREBASE_API_KEY"));

  // 1. Check Configuration
  if (!config.databaseURL || !config.apiKey) {
    console.warn(
      "⚠️ Firebase configuration missing (API_KEY or DATABASE_URL). App running in DEMO MODE. Data will NOT be saved to database."
    );
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
    // Explicitly passing the URL ensures the SDK doesn't guess wrong if multiple apps exist
    if (getDatabase) {
      db = getDatabase(app, config.databaseURL);
      // 4. Simple connectivity check
      goOnline(db);
    } else {
      // Fallback for v8-like environments or if named export failed at runtime but app exists
      // This is a safety net in case getDatabase import was undefined
      db = (app as any).database(config.databaseURL);
      db.goOnline();
    }

    return true;
  } catch (error: any) {
    console.error("Firebase Connection Verification Failed:", error);
    // If configuration exists but connection fails, we still throw to warn the user
    // unless we want to fallback to demo mode on error too?
    // For now, let's strict fail on bad config, but soft fail on missing config.
    throw error;
  }
};

/**
 * Records the user's response to the Realtime Database.
 */
export const recordResponse = async (
  responseType: "YES" | "NO" | "MAYBE",
  evasiveManeuvers: number
): Promise<void> => {
  // Handle Demo Mode
  if (isDemoMode) {
    console.log(
      `[DEMO MODE] Recording response: ${responseType}, Moves: ${evasiveManeuvers}`
    );
    // Simulate a small network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 600));
    return;
  }

  // If db is not initialized yet (rare if checkFirebaseConnection was called), try to init
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
      // Fallback to demo mode if lazy init fails due to missing config
      console.warn(
        "Lazy init failed: Missing config. Falling back to console log."
      );
      console.log(
        `[DEMO MODE] Recording response: ${responseType}, Moves: ${evasiveManeuvers}`
      );
      return;
    }
  }

  const accepted = responseType === "YES";

  const data: DateResponse = {
    accepted,
    responseType,
    evasiveManeuvers,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  try {
    if (ref && push) {
      const responsesRef = ref(db, "date_responses");
      await push(responsesRef, data);
    } else {
      // Fallback v8 style
      const responsesRef = db.ref("date_responses");
      await responsesRef.push(data);
    }
  } catch (error) {
    console.error("Error writing to Firebase RTDB:", error);
    throw error;
  }
};
