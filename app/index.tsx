import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { auth, getUserFromStorage, getUserCredentials, saveUserToStorage, reAuthenticate } from '../configure/firebaseConfig';
import Login from './Login';
import { User } from 'firebase/auth';

export default function Index(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check if we're already logged in
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          // We're already authenticated
          setUser(currentUser);
          await saveUserToStorage(currentUser);
        } else {
          // Try to restore auth state from storage
          const storedUser = await getUserFromStorage();
          
          if (storedUser) {
            // Try to re-authenticate using stored credentials
            const authenticatedUser = await reAuthenticate();
            setUser(authenticatedUser);
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
        setLoading(false);
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