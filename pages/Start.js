import React from 'react';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, Button, Alert, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import { Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
const window = Dimensions.get('window');
var bg = "";
var num = Math.floor(Math.random() * 3);
if (num == 0) {
    bg = require('../assets/bg1.png');
}
else if (num == 1) {
    bg = require('../assets/bg2.png');
}
else {
    bg = require('../assets/bg3.png');
}

export default function App({ navigation }) {
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

    return (
        <View style={styles.container}>
            <ImageBackground
                resizeMode="cover"
                blurRadius={7}
                style={styles.image}
                source={bg}>

                <Text style={styles.mainText}>        BRAVE BEAR</Text>

                <Pressable
                    onPress={() => {
                        navigation.navigate("SignUp")
                    }}
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed
                                ? 'rgb(	111, 29, 27)'
                                : 'transparent'
                        },
                        styles.button
                    ]}>
                    {({ pressed }) => (
                        <Text style={styles.text}>
                            SIGN UP
                        </Text>
                    )}
                </Pressable>

                <Pressable
                    onPress={() => {
                        navigation.navigate("LogIn")
                    }}
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed
                                ? 'rgb(	111, 29, 27)'
                                : 'transparent'
                        },
                        styles.button2
                    ]}>
                    {({ pressed }) => (
                        <Text style={styles.text}>
                            LOG IN
                        </Text>
                    )}
                </Pressable>

            </ImageBackground>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    image: {
        flex: 1,
        justifyContent: "space-evenly",
        backgroundColor: 'transparent',
    },
    mainText: {
        position: "absolute",
        left: 0,
        right: 0,
        margin: 'auto',
        top: (window.height) * 0.12,
        fontFamily: 'Alata',
        color: "#FFE6A7",
        fontSize: '80vw',
        lineHeight: 100,
        fontWeight: "regular",
        textAlign: "center",
    },
    button: {
        position: "absolute",
        left: (window.width) * .1,
        right: 0,
        margin: 'auto',
        bottom: (window.height) * 0.2,
        fontFamily: 'Alata',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 0,
        width: (window.width) * .3,
        borderWidth: 4,
        borderColor: 'rgba(255, 230, 167, .4)'
    },
    button2: {
        position: "absolute",
        right: (window.width) * .1,
        margin: 'auto',
        bottom: (window.height) * 0.2,
        fontFamily: 'Alata',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 0,
        width: (window.width) * .3,
        borderWidth: 4,
        borderColor: 'rgba(255, 230, 167, .4)'
    },
    text: {
        fontFamily: 'Alata',
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#FEFAE0',
    }
});
