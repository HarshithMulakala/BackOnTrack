import React from 'react';
import { useEffect, useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Button, Alert, Pressable, SafeAreaView, TouchableOpacityBase, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { updateProfile } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useHeaderHeight } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import {
    firestore,
    doc,
    getDoc,
    getDocs,
    collection,
    addDoc,
    setDoc,
    orderBy,
    query,
    onSnapshot
} from 'firebase/firestore';
import {
    Actions,
    ActionsProps
} from 'react-native-gifted-chat'
import { serverTimestamp } from "firebase/firestore";


SplashScreen.preventAutoHideAsync();

const customtInputToolbar = props => {
    return (
        <InputToolbar
            {...props}
            textInputProps={{
                marginTop: 15,
                placeholder: "Message",
                placeholderTextColor: "grey",
                color: "black",
            }}
            containerStyle={{
                justifyContent: 'center',
                backgroundColor: "#f4f5f8",
                border: 50,
                padding: 8,
                height: 40,
                width: "100%",
                marginBottom: -34,
            }}
        >
        </InputToolbar>
    );
};

const customtSend = props => {
    return (
        <Send
            {...props}
            containerStyle={{
                width: "10%",
                justifyContent: 'center',
                height: 45,
                marginBottom: 3,
                marginRight: "-3%",
            }}
        >
            <View style={{}}>
                <FontAwesome
                    name='send'
                    type='ionicon'
                    size={24}
                    color="black"
                />
            </View>
        </Send>



    );
};

const ChatScreen = ({ user, route, Bot }) => {
    const [messages, setMessages] = useState([]);
    const { uid } = route.params;

    const getAllMessages = async () => {
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        const docRef = collection(database, "chats", docid, "messages");
        const msgResponse = query(docRef, orderBy("createdAt", "desc"))
        const unsubscribe = onSnapshot(msgResponse, snapshot => {
            setMessages(
                snapshot.docs.map(docSanp => ({
                    ...docSanp.data(),
                    createdAt: new Date()
                }))
            )
        })
        return () => unsubscribe();
    }

    useLayoutEffect(() => {
        getAllMessages()
    }, []);

    const onSend = (msgArray) => {
        const msg = msgArray[0]
        const usermsg = {
            ...msg,
            sentBy: user.uid,
            sentTo: uid,
            createdAt: new Date()
        }

        setMessages(previousMessages => GiftedChat.append(previousMessages, usermsg))
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        const data = { ...usermsg, createdAt: serverTimestamp() }
        const docRef = collection(database, "chats", docid, "messages");
        addDoc(docRef, data);
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                avatar: user.photoURL,
            }}
            showUserAvatar={true}
            messagesContainerStyle={{
                marginTop: 42,
                backgroundColor: "transparent",
            }}
            renderInputToolbar={props => customtInputToolbar(props)}
            renderSend={props => customtSend(props)}
            bottomOffset={Bot - 4}
        />
    )
}

export default function Messenger({ user, route, navigation }) {
    const [messages, setMessages] = useState([]);

    const [fontsLoaded] = useFonts({
        'Alata': require('../assets/fonts/Alata-Regular.ttf'),
    });

    const Bot = useBottomTabBarHeight();
    const headerHeight = useHeaderHeight();

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();

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
        });

    }, [navigation]);



    if (!fontsLoaded) {
        return undefined;
    } else {
        SplashScreen.hideAsync();
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f1e6d8', '#efe3d4', '#d2c8bb']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', height: "100%", width: "100%", elevation: 0 }}
            >
                <ChatScreen user={user} route={route} Bot={Bot} />
            </LinearGradient>

            <LinearGradient
                colors={['#bb9457', '#99582A']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={{ height: headerHeight, width: "100%", borderRadius: 10, elevation: 10, marginBottom: 20 }}
            >
            </LinearGradient>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        color: 'black',
        alignSelf: 'center',
    },
    signuptext: {
        fontFamily: 'Alata',
        fontSize: 18,
        color: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    button: {
        backgroundColor: 'black',
        height: 58,
        borderRadius: 10,
        width: "80%",
        alignSelf: 'center',
        justifyContent: 'center',
    },
    textInput: {
        width: "80%",
        marginLeft: "10%",
        backgroundColor: 'white',
        borderRadius: 10,
        backgroundColor: 'black',
    }
})