import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useEffect } from 'react';
import { RefreshControl, StyleSheet, Text, View, Image, ImageBackground, Button, Alert, Pressable, SafeAreaView, TouchableOpacityBase, TouchableOpacity, StatusBar, TextInput, FlatList } from 'react-native';
import { useFonts } from 'expo-font';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { updateProfile } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useHeaderHeight } from '@react-navigation/elements';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { GiftedChat } from 'react-native-gifted-chat';
import Messenger from '../pages/Messenger';
import {
    doc,
    getDoc,
    getDocs,
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    firestore,
    where
} from 'firebase/firestore';
import { ScrollView } from 'react-native-virtualized-view';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

const MessageScreen = ({ user, navigation }) => {
    const [users, setUsers] = useState(null)
    const getUsers = async () => {
        //CHANGE THERAPIST TO USER IF YOU WANT TO SEE ALL USERS
        const querySanp = await getDocs(query(collection(database, "users"), where('type', '==', 'user'), where('uid', '!=', user.uid)))
        const allUsers = querySanp.docs.map(docSnap => docSnap.data())
        setUsers(allUsers)
    }

    useEffect(() => {
        getUsers();

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

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await getUsers();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, [refreshing]);

    return (
        <SafeAreaView >
            <StatusBar />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.Contain}>
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.uid}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Messenger', { name: item, uid: item.uid })}
                            >
                                <View style={styles.card} >
                                    <Image style={styles.userImageST} source={{ uri: item.avatar }} />
                                    <View style={styles.textArea}>
                                        <Text style={styles.nameText} >{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

var headerHeight = 0;

export default function AllChat({ navigation }) {
    const [fontsLoaded] = useFonts({
        'Alata': require('../assets/fonts/Alata-Regular.ttf'),
    });

    const Bot = useBottomTabBarHeight();
    headerHeight = useHeaderHeight();

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
            <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <MessageScreen user={auth.currentUser} navigation={navigation} />
            </View>

        </View>
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
        flexWrap: 'wrap',
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
        fontSize: 14,
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
})