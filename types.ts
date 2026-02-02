export interface Position {
  top: number;
  left: number;
}

export interface DateResponse {
  accepted: boolean;
  evasiveManeuvers: number; // How many times the 'No' button moved
  timestamp: Date;
  userAgent: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}