/**
 * Firebase Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console: https://console.firebase.google.com
 * 2. Select your project (or create one)
 * 3. Go to Project Settings > General > Your apps
 * 4. Add a Web App if you haven't already
 * 5. Copy your Firebase config values below
 *
 * REQUIRED SERVICES TO ENABLE:
 * - Authentication: Enable Email/Password and Google sign-in providers
 * - Firestore Database: Create in production or test mode
 * - Storage: Enable Cloud Storage (for product images)
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbl7QL5oNJK1PVzwIu1QbKBxTjzwKoP3E",
  authDomain: "jaipur-touch-d8a54.firebaseapp.com",
  projectId: "jaipur-touch-d8a54",
  storageBucket: "jaipur-touch-d8a54.firebasestorage.app",
  messagingSenderId: "1009352915866",
  appId: "1:1009352915866:web:36e737e66f64a9bc281823",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with long-polling to avoid WebChannel issues
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  "jaipur",
);

// Initialize other services
export const auth = getAuth(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();

export default app;
