import React from 'react';
import UIKit from 'react-native';
import { useEffect, useCallback, useLayoutEffect, useState } from 'react';
import { ScrollView, FlatList, StyleSheet, Text, View, Image, ImageBackground, Button, Alert, Pressable, SafeAreaView, TouchableOpacityBase, TouchableOpacity, StatusBar, TextInput } from 'react-native';
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
import { updateProfile } from 'firebase/auth';
import {
    doc,
    getDoc,
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker'

SplashScreen.preventAutoHideAsync();





export default function Settings({ navigation }) {
    const [fontsLoaded] = useFonts({
        'Alata': require('../assets/fonts/Alata-Regular.ttf'),
    });

    const [image, setImage] = useState(null);
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

    async function verifyPermission() {
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }
        if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient permission!',
                'You need to grant camera access to use this app'
            );
            return false
        }
        return true;
    }

    const storage = getStorage();

    uploadImage = async (uri) => {
        const storageRef = ref(storage, "images/" + auth.currentUser.uid + "/" + "pfp.jpg");
        uploadBytes(storageRef, uri).then((snapshot) => {
            getDownloadURL(storageRef)
                .then((url) => {
                    updateProfile(auth.currentUser, {
                        'photoURL': url
                    }).then(() => {
                        dooc();
                    }).catch((error) => {
                        console.log(error);
                    });
                    updateDoc(doc(database, "users", auth.currentUser.uid), {
                        avatar: url
                    });

                })
                .catch((error) => {
                    // Handle any errors
                });
        });
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [2, 1],
            quality: .3,
        });

        if (result.assets != null) {
            const img = await fetch(result.assets[0].uri);
            const blob = await img.blob();
            uploadImage(blob);
        }
    };

    const headerHeight = useHeaderHeight();

    const [docs, setDocs] = useState(null)
    const dooc = async () => {
        setImage(auth.currentUser.photoURL);
    }


    useEffect(() => {
        dooc()
    }, [])

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

            <ScrollView>
                <View style={styles.Contain}>
                    <TouchableOpacity style={styles.Contain} onPress={() => pickImage()}>
                        <Image
                            source={{
                                uri: image,
                            }}
                            style={styles.pfp}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => auth.signOut()}>
                        <Text style={styles.signuptext}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </View >
    )

}



const styles = StyleSheet.create({
    Contain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
    },
    pfp: {
        alignSelf: 'center',
        borderRadius: 60,
        width: 100,
        height: 100,
        marginRight: 0,
        marginBottom: 5,
    },
    text: {
        fontSize: 20,
        color: 'black',
        alignSelf: 'center',
    },
    signuptext: {
        fontFamily: 'Alata',
        fontSize: 18,
        color: 'black',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#f1e6d8',
        height: 58,
        width: "100%",
        alignSelf: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        height: 'auto',
        marginHorizontal: 4,
        marginVertical: 6,
        flexDirection: 'row',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userImage: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    userImageST: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textArea: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 5,
        paddingLeft: 10,
        width: 300,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    userText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nameText: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: '900',
        fontFamily: 'Verdana'
    },
    msgTime: {
        textAlign: 'right',
        fontSize: 11,
        marginTop: -20,
    },
    msgContent: {
        paddingTop: 5,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    item: {

        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
})

