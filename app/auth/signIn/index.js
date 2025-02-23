import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, saveUserToStorage, saveUserCredentials } from './../../../configure/firebaseConfig';
import { KeyboardAvoidingView } from 'react-native';
import LottieView from 'lottie-react-native';

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        console.log("Firebase auth state:", auth?.currentUser);
        console.log("Firebase auth initialized:", auth != null);
      }, []);
      

    const onSignIn = async () => {
        if (!email || !password) {
            ToastAndroid.show("Please enter email and password", ToastAndroid.BOTTOM);
            return;
        }

        setLoading(true);
        try {
            console.log("Attempting sign in...");
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Sign in successful, user:", userCredential.user.uid);
            
            try {
                console.log("Saving user to storage...");
                await saveUserToStorage(userCredential.user);
                console.log("User saved to storage successfully");
                
                console.log("Saving user credentials...");
                await saveUserCredentials(email, password);
                console.log("User credentials saved successfully");
            } catch (storageError) {
                console.error("Storage error:", storageError);
                ToastAndroid.show("Sign in successful but error saving data", ToastAndroid.BOTTOM);
            }

            console.log("Navigating to myTrip...");
            router.replace('/(tabs)/myTrip');
        } catch (error) {
            console.error("Login error:", error);
            // Add network check
            if (!navigator.onLine) {
              ToastAndroid.show("No internet connection", ToastAndroid.LONG);
              return;
            }
            
            let errorMessage = "Sign in failed. ";
            if (error.code === 'auth/invalid-email') {
                errorMessage += "Invalid email format.";
            } else if (error.code === 'auth/user-not-found') {
                errorMessage += "User not found.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage += "Incorrect password.";
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage += "Network error. Check your connection.";
            } else {
                errorMessage += error.message || "Please try again.";
            }
            
            ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    };

    // Add initialization check
    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("Auth state:", auth.currentUser);
            } catch (error) {
                console.error("Auth initialization error:", error);
            }
        };
        checkAuth();
    }, []);

    return (
        <KeyboardAvoidingView style={{ padding: 25, backgroundColor: Colors.WHITE, height: '100%' }}>
            <StatusBar barStyle='dark-content'/>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 30, padding: 20, marginTop: 20 }}>
                Let's Sign you In
            </Text>
            <Text style={{ fontFamily: 'outfit', fontSize: 21, color: Colors.GRAY, marginTop: 0 }}>
                Welcome back! You've been missed!
            </Text>

            <View style={{ marginTop: 10 }}>
                <Text style={Styles.inptext}>EMAIL</Text>
                <TextInput
                    style={Styles.input}
                    onChangeText={setEmail}
                    placeholder='Enter Email'
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text style={Styles.inptext}>PASSWORD</Text>
                <TextInput
                    style={Styles.input}
                    placeholder='Enter Password'
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            
            <View>
                <LottieView
                    source={require('../../../assets/images/signin.json')}
                    autoPlay
                    loop
                    style={{ width: '100%', height: 200, marginTop: 10}}
                />
            </View>

            <View style={{ marginTop: 10 }}>
                <TouchableOpacity 
                    style={[Styles.buttonStyle, loading && { opacity: 0.7 }]} 
                    onPress={onSignIn}
                    disabled={loading}
                >
                    <Text style={Styles.buttonText}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[Styles.buttonStyle, { backgroundColor: 'lightblue' }]}
                    onPress={() => router.replace('/auth/signUp')}
                    disabled={loading}
                >
                    <Text style={Styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const Styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        padding: 15,
        marginTop: 10,
        fontSize: 18,
        borderRadius: 15,
        borderColor: Colors.GRAY,
        fontFamily: 'outfit',
    },
    inptext: {
        fontFamily: 'outfit',
        fontSize: 19,
        marginTop: 5,
    },
    buttonStyle: {
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'black',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'outfit-bold',
    },
});


export default SignIn;