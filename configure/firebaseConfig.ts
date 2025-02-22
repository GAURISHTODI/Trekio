import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAgGVs-WQE6CFIxegRjIbWYaOG7H16f3pM",
  authDomain: "trekio-ad0f2.firebaseapp.com",
  projectId: "trekio-ad0f2",
  storageBucket: "trekio-ad0f2.firebasestorage.app",
  messagingSenderId: "759827269154",
  appId: "1:759827269154:web:d0064ce304f99fa0302c7b",
  measurementId: "G-XXDLJ0Z6LV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const USER_KEY = '@user_auth';
const USER_CREDENTIALS_KEY = '@user_credentials';

// Save user credentials securely
export const saveUserCredentials = async (email: string, password: string) => {
  try {
    await AsyncStorage.setItem(USER_CREDENTIALS_KEY, JSON.stringify({ email, password }));
    console.log('User credentials saved');
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
};

// Get stored credentials
export const getUserCredentials = async () => {
  try {
    const credentials = await AsyncStorage.getItem(USER_CREDENTIALS_KEY);
    return credentials ? JSON.parse(credentials) : null;
  } catch (error) {
    console.error('Error getting credentials:', error);
    return null;
  }
};

// Save user to AsyncStorage
export const saveUserToStorage = async (user: any) => {
  if (!user) return;
  try {
    const userData = JSON.stringify({
      uid: user.uid,
      email: user.email,
      timestamp: Date.now(),
    });
    await AsyncStorage.setItem(USER_KEY, userData);
    console.log('User saved to AsyncStorage');
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Get user from AsyncStorage
export const getUserFromStorage = async () => {
  try {
    const userString = await AsyncStorage.getItem(USER_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Clear all user data
export const clearUserData = async () => {
  try {
    await AsyncStorage.multiRemove([USER_KEY, USER_CREDENTIALS_KEY]);
    console.log('User data cleared');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

// Handle logout
export const handleLogout = async () => {
  try {
    await signOut(auth);
    await clearUserData();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export { app, auth, db };