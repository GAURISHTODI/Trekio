import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../configure/firebaseConfig';
import { useRouter, Stack } from 'expo-router';
import LottieView from 'lottie-react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

const ProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    email: auth.currentUser?.email || '',
    userName: '',
    gender: '',
    age: '',
    contactNumber: '',
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/signIn');
    } else {
      fetchUserProfile();
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setProfile((prev) => ({
          ...prev,
          ...userDocSnap.data(),
        }));
      }
    } catch (error) {
      setError('Failed to load profile');
      Alert.alert('Error', 'Failed to load profile');
      console.error(error);
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    if (!profile.userName.trim()) {
      Alert.alert('Error', 'Username is required');
      return false;
    }
    if (profile.age && (isNaN(profile.age) || parseInt(profile.age) < 0)) {
      Alert.alert('Error', 'Please enter a valid age');
      return false;
    }
    if (profile.contactNumber && !/^\+?[\d\s-]{8,}$/.test(profile.contactNumber)) {
      Alert.alert('Error', 'Please enter a valid contact number');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'No user logged in');
      return;
    }
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...profile,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth/signIn');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const Avatar = ({ userName, gender }) => {
    return (
      <View style={[styles.avatarContainer, styles.lottieContainer]}>
        {gender ? (
          <LottieView
            source={
              gender === 'Male'
                ? require('../../assets/images/male.json')
                : require('../../assets/images/female.json')
            }
            autoPlay
            loop
            style={{ width: 300, height: 200 }}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName ? userName[0].toUpperCase() : 'N/A'}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: 'My Profile',
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSave}
              style={styles.headerButton}
              disabled={isSaving}
            >
              <Text style={{ color: '#007AFF' }}>Save</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={{ 
            fontSize: 35,
            fontFamily: 'outfit-bold',
          }}> My Profile</Text>
          <Ionicons name="person" size={35} color="black" style={{marginRight: 10}} />
        </View>
        <View style={styles.form}>
          <Avatar userName={profile.userName} gender={profile.gender} />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#f0f0f0' }]}
            value={profile.email}
            editable={false}
            placeholder="Email"
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={profile.userName}
            onChangeText={(text) => setProfile((prev) => ({ ...prev, userName: text }))}
            placeholder="Enter username"
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={profile.age}
            onChangeText={(text) => setProfile((prev) => ({ ...prev, age: text }))}
            keyboardType="numeric"
            placeholder="Enter age"
          />

          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={profile.contactNumber}
            onChangeText={(text) => setProfile((prev) => ({ ...prev, contactNumber: text }))}
            keyboardType="phone-pad"
            placeholder="Enter contact number"
          />
          <Text style={styles.label}>Gender</Text>
          <View style={styles.gender}>
            <Picker
              selectedValue={profile.gender}
              style={styles.input}
              onValueChange={(itemValue) => setProfile((prev) => ({ ...prev, gender: itemValue }))}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>

          <TouchableOpacity 
            style={[styles.button, isSaving && styles.buttonDisabled]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Profile</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.logoutButton, {backgroundColor:'lightblue'}]} 
            onPress={handleLogout}
          >
            <Text style={[styles.buttonText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  gender: {
    borderWidth: 2,
    borderColor: '#ddd',
    padding: 0,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'outfit-medium'
  },
  form: {
    padding: 20,
    paddingBottom: 50,
  },
  lottieContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'outfit-medium',
  },
  button: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'black',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'outfit-bold',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 10,
  },
  headerButton: {
    marginRight: 15,
  },
  logoutButton: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'black',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    color: '#666',
  },
});

export default ProfileScreen;