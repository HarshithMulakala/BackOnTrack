import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Button, Alert, Pressable, SafeAreaView, TouchableOpacityBase, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { updateProfile } from 'firebase/auth';
import {
    doc,
    collection,
    addDoc,
    setDoc,
    orderBy,
    query,
    onSnapshot
} from 'firebase/firestore';

const window = Dimensions.get('window');

export default function LogIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
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
        if (email !== '' || password !== '' || name !== '' || !email.endsWith("friscoisd.org")) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log('User created successfully');
                    const docRef = doc(database, "users", auth.currentUser.uid)
                    const data = { email: email, name: name, uid: auth.currentUser.uid, avatar: 'https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png', type: 'user' }
                    updateProfile(auth.currentUser, {
                        'photoURL': 'https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png',
                        'displayName': name,
                    })
                    setDoc(docRef, data);
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
                            <Text style={styles.mainText}>Sign Up</Text>
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
                            <TextInput
                                style={{ height: 58, borderRadius: 10, fontSize: 20, padding: 12, marginBottom: 20, backgroundColor: 'white', width: (window.width) * 0.8, alignSelf: 'center' }}
                                placeholder="Enter Name"
                                autoCapitalize='none'
                                autoCorrect={false}
                                textContentType='name'
                                value={name}
                                onChangeText={text => setName(text)}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={.85}>
                                <Text style={styles.text}>Sign Up</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.NoAccount}>
                            <Text style={styles.othertext}>Already have an account?</Text>
                            <TouchableOpacity style={styles.otherbutton} onPress={() => navigation.navigate("LogIn")} activeOpacity={.8}>
                                <Text style={styles.signuptext}>Log In</Text>
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
        top: (window.height) * 0.75,
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
        marginBottom: 20,
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