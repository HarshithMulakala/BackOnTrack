import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Button, Alert, Pressable, SafeAreaView, TouchableOpacityBase, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const window = Dimensions.get('window');

export default function LogIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fontsLoaded] = useFonts({
        'Alata': require('../assets/fonts/Alata-Regular.ttf'),
    });

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    if (!fontsLoaded) {
        return undefined;
    } else {
        SplashScreen.hideAsync();
    }

    const handleLogin = () => {
        if (email !== '' || password !== '') {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                resizeMode="cover"
                style={styles.image}
                blurRadius={7}
                source={require('../assets/AuthBg.png')}>
                <View style={styles.child}>
                    <View style={styles.Login}>
                        <SafeAreaView>
                            <Text style={styles.mainText}>Log In</Text>
                            <TextInput
                                style={{ height: 58, borderRadius: 10, fontSize: 20, padding: 12, marginBottom: 20, backgroundColor: 'white', width: (window.width) * 0.8, alignSelf: 'center', }}
                                placeholder="Enter Email"
                                autoCapitalize='none'
                                keyboardType='email-address'
                                textContentType='emailAddress'
                                value={email}
                                onChangeText={text => setEmail(text)}
                            />
                            <TextInput
                                style={{ height: 58, borderRadius: 10, fontSize: 20, padding: 12, marginBottom: 20, backgroundColor: 'white', width: (window.width) * 0.8, alignSelf: 'center' }}
                                placeholder="Enter Password"
                                autoCapitalize='none'
                                autoCorrect={false}
                                secureTextEntry={true}
                                textContentType='password'
                                value={password}
                                onChangeText={text => setPassword(text)}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={.85}>
                                <Text style={styles.text}>Log In</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.NoAccount}>
                            <Text style={styles.othertext}>Don't have an account?</Text>
                            <TouchableOpacity style={styles.otherbutton} onPress={() => navigation.navigate("SignUp")} activeOpacity={.8}>
                                <Text style={styles.signuptext}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>

            </ImageBackground>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: 'transparent',
    },
    image: {
        flex: 2,
        justifyContent: "center",
        backgroundColor: 'transparent',
    },
    mainText: {
        fontFamily: 'Alata',
        fontSize: '60vw',
        color: '#ffe6a7',
        alignSelf: 'center',
        marginBottom: 20,
    },
    text: {
        fontFamily: 'Alata',
        fontSize: 20,
        color: 'black',
        alignSelf: 'center',
    },
    othertext: {
        fontFamily: 'Alata',
        fontSize: 20,
        color: '#ffe6a7',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        margin: 5,
    },
    signuptext: {
        fontFamily: 'Alata',
        fontSize: 18,
        color: 'black',
        alignSelf: 'center',
    },
    child: {
        flex: 1,
        backgroundColor: 'rgba(153, 88, 42, .3)',
    },
    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        margin: 'auto',
        top: (window.height) * 0.65,
    },
    Login: {
        position: "absolute",
        left: 0,
        right: 0,
        margin: 'auto',
        top: (window.height) * 0.18,
    },
    NoAccount: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#ffe6a7',
        height: 58,
        borderRadius: 10,
        width: (window.width) * 0.8,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    otherbutton: {
        backgroundColor: '#ffe6a7',
        height: 29,
        borderRadius: 5,
        width: (window.width) * 0.3,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        margin: 5,
    }
})