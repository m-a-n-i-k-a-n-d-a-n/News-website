// Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZhwB-4iZT8oXQOoGpBKWHZwfsihzT2ZA",
  authDomain: "news-project-3abd6.firebaseapp.com",
  projectId: "news-project-3abd6",
  storageBucket: "news-project-3abd6.appspot.com",
  messagingSenderId: "105811140166",
  appId: "1:105811140166:web:03bb162c0529a94cd97447"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
