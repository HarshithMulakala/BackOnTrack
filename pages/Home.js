import React from 'react';
import { useEffect, useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Button, Alert, Pressable, SafeAreaView, TouchableOpacityBase, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { auth, database } from '../config/firebase';
import { useHeaderHeight } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Chat from '../pages/Chat';
import {
    doc,
    getDoc,
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot
} from 'firebase/firestore';
import Settings from './Settings';

SplashScreen.preventAutoHideAsync();

export default function Home({ navigation }) {
    const [fontsLoaded] = useFonts({
        'Alata': require('../assets/fonts/Alata-Regular.ttf'),
    });

    const headerHeight = useHeaderHeight();
    const Bot = useBottomTabBarHeight();


    useEffect(() => {
        const dooc = async () => {
            navigation.setOptions({
                headerStyle: {
                    backgroundColor: '#BB9457',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    color: '#fff',
                    fontFamila: 'Alata',
                    fontWeight: 'bold',
                },
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Image
                            source={{
                                uri: auth.currentUser.photoURL,
                            }}
                            style={{
                                borderRadius: 20,
                                width: 40,
                                height: 40,
                                marginRight: 15,
                                marginBottom: 5,
                            }}
                        />
                    </TouchableOpacity>

                ),
            });
        }
        // Subscribe for the focus Listener
        const unsubscribe = navigation.addListener('focus', () => {
            dooc();
        });

        return () => {
            unsubscribe;
        };
    }, [navigation]);

    useLayoutEffect(() => {




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

    return (

        <View style={styles.container}>
            <LinearGradient
                colors={['#d2c8bb', '#efe3d4']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 1 }}
                style={{ position: 'absolute', height: "100%", width: "100%", elevation: 0 }}
            >
            </LinearGradient>
            <LinearGradient
                colors={['#bb9457', '#99582A']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={{ height: headerHeight + 5, width: "100%", borderRadius: 10 }}
            >
            </LinearGradient>

            <Text style={styles.text}></Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        border: 'none',
        backgroundColor: "rgb(239,227,212)",
    },
    text: {
        fontSize: 20,
        color: 'black',
        alignSelf: 'center',
    }
})

