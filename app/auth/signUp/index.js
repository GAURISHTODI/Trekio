import { View, Text, TextInput, TouchableOpacity, ToastAndroid, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../../configure/firebaseConfig';
import LottieView from 'lottie-react-native';

const signUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onCreateAccount = () => {
        if (!email || !password ) {
            ToastAndroid.show("Please enter all details", ToastAndroid.BOTTOM);
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                router.replace('/myTrip');
                ToastAndroid.show("Success", ToastAndroid.BOTTOM);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                ToastAndroid.show("Invalid credentials", ToastAndroid.LONG);
            });
    };

    return (
        <View style={Styles.container}>
            <StatusBar barStyle='dark-content'/>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 25 }}> Create New Account</Text>

            <View style={{ marginTop: 30 }}>

                <Text style={Styles.inptext}> EMAIL</Text>
                <TextInput style={Styles.input} placeholder='Enter Email' onChangeText={setEmail} />

                <Text style={Styles.inptext}> Password</Text>
                <TextInput style={Styles.input} placeholder='Enter Password' secureTextEntry={true} onChangeText={setPassword} />

                  <View>
                                     <LottieView
                                                   source={require('../../../assets/images/signin.json')}
                                                   autoPlay
                                                   loop
                                                   style={{ width: '100%', height: 200, marginTop: 10}}
                                                 />
</View>


                <View style={{ marginTop: 40 }}>
                    <TouchableOpacity style={Styles.buttonStyle} onPress={onCreateAccount}>
                        <Text style={{ color: 'white', textAlign: "center", fontSize: 20 }}> Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default signUp;

const Styles = StyleSheet.create({
    container: {
        padding: 30,
        marginTop: 20,
        flex: 1,
    },
    input: {
            borderWidth: 1,
            padding: 15,
            marginTop: 10,
            fontSize: 18,
            borderRadius: 15,
            fontFamily: 'outfit-medium',
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
        textAlign: 'center'
    }
});
