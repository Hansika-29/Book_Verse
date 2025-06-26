import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHRGLE83L2WhCB2x6dLlm4IsNnMRZduqo",
  authDomain: "bookverse-3261a.firebaseapp.com",
  projectId: "bookverse-3261a",
  storageBucket: "bookverse-3261a.firebasestorage.app",
  messagingSenderId: "8900071808",
  appId: "1:8900071808:web:841ee20fe358de66ea7165"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();



