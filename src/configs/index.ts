import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const CONFIGS = {
  env: import.meta.env.VITE_APP_STAGE || "development",
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  localStorageKey: import.meta.env.VITE_LOCAL_STORAGE_KEY,
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const firebaseConfigs = {
  storage,
};
