import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { auth, getUserFromStorage, getUserCredentials, saveUserToStorage } from '../configure/firebaseConfig';
import Login from './Login';
import { User } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Index(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check AsyncStorage first
        const storedUser = await getUserFromStorage();
        
        if (storedUser) {
          // If we have stored credentials, try to sign in automatically
          const credentials = await getUserCredentials();
          if (credentials) {
            const { email, password } = credentials;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await saveUserToStorage(userCredential.user);
            setUser(userCredential.user);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (authUser) {
        saveUserToStorage(authUser);
      }
    });

    initializeAuth();

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return user ? <Redirect href="/myTrip" /> : <Login />;
}