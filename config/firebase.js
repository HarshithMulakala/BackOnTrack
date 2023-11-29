// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth/react-native';
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import constants from "expo-constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: constants.manifest.extra.apiKey,
    authDomain: constants.manifest.extra.authDomain,
    projectId: constants.manifest.extra.projectId,
    storageBucket: constants.manifest.extra.storageBucket,
    messagingSenderId: constants.manifest.extra.messagingSenderId,
    appId: constants.manifest.extra.appId,
    measurementId: "G-ECE6GXZT7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
export const database = initializeFirestore(app, { experimentalAutoDetectLongPolling: true })