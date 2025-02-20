import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';  // Only use `useRouter` if using expo-router
import { Colors } from './../../../constants/Colors';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../../configure/firebaseConfig';
import { KeyboardAvoidingView } from 'react-native';
import LottieView from 'lottie-react-native';

const SignIn = () => {
    const router = useRouter();  //  router usage
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSignIn = async () => {
        if (!email && !password) {

            ToastAndroid.show("Please enter email and password", ToastAndroid.BOTTOM)
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in:", userCredential.user);
            router.replace('/(tabs)/myTrip'); 
        } catch (error) {
            console.error("Login error:", error.message);
        }
    };

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
                    onChangeText={(value)=>setEmail(value)}
                    placeholder='Enter Email'
                    value={email}
                     // Bind state 
                />

                <Text style={Styles.inptext}>PASSWORD</Text>
                <TextInput
                    style={Styles.input}
                    placeholder='Enter Password'
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(value) => setPassword(value)} //Bind state
                    
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
                <TouchableOpacity style={Styles.buttonStyle} onPress={onSignIn}>
                    <Text style={Styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[Styles.buttonStyle, { backgroundColor: 'lightblue' }]}
                    onPress={() => router.replace('/auth/signUp')} // 
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
