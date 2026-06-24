import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCcj7eBah4tE30icEb3lXgLOCHK6LAvqg8",
  authDomain: "schoolprojcet.firebaseapp.com",
  projectId: "schoolprojcet",
  storageBucket: "schoolprojcet.firebasestorage.app",
  messagingSenderId: "161894342641",
  appId: "1:161894342641:web:5356bc6874dda4ecc36e50",
  measurementId: "G-RYSBWN8EGJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore DB (THIS is what your authService uses)
export const db = getFirestore(app);

// Analytics (only works on web, optional)
const analytics = getAnalytics(app);