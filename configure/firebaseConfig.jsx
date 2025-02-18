import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgGVs-WQE6CFIxegRjIbWYaOG7H16f3pM",
  authDomain: "trekio-ad0f2.firebaseapp.com",
  projectId: "trekio-ad0f2",
  storageBucket: "trekio-ad0f2.firebasestorage.app",
  messagingSenderId: "759827269154",
  appId: "1:759827269154:web:d0064ce304f99fa0302c7b",
  measurementId: "G-XXDLJ0Z6LV"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Ensure correct auth persistence setup
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
