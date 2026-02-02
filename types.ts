export interface Position {
  top: number;
  left: number;
}

export interface DateResponse {
  accepted: boolean;
  responseType: 'YES' | 'NO' | 'MAYBE';
  evasiveManeuvers: number; // How many times the 'No' button moved
  timestamp: string;
  userAgent: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}