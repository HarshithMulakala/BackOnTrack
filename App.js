import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { useNavigation } from '@react-navigation/native';
import { isLoading, useFonts } from 'expo-font';
import Chat from './pages/Chat';
import LogIn from './pages/LogIn';
import Start from './pages/Start';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Messenger from './pages/Messenger';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { LogBox } from 'react-native';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function ChatStack({ user }) {
  return (
    <Stack.Navigator screenOptions={{ headerTransparent: true }} defaultScreenOptions={BottomNav}>
      {user ?
        <>
          <Stack.Screen
            name="Back"
            options={{ headerShown: false }}
          >
            {props => <BottomNav {...props} user={user} />}
          </Stack.Screen>

          <Stack.Screen
            name="Settings"
            options={{
              headerTransparent: true, headerShown: true, headerTitleStyle: {
                color: 'white'
              },
              headerTitleAlign: 'center',
              headerTintColor: 'white'
            }}
            component={Settings}
          />
        </>
        :
        <>
        </>
      }

    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} defaultScreenOptions={Start}>
      <Stack.Screen
        name="Start"
        component={Start}
        options={{}} />
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const [user, setUser] = useState('');
  useEffect(() => {
    const userCheck = onAuthStateChanged(auth, userExist => {
      if (userExist)
        setUser(userExist)
      else
        setUser("")
    })
    return userCheck;
  }, []);

  return (
    <NavigationContainer>
      {user ? <ChatStack user={user} /> : <AuthStack />}
    </NavigationContainer>
  );
}

function MessengerStack({ user }) {
  return (
    <Stack.Navigator screenOptions={{ headerTransparent: true }} defaultScreenOptions={Chat}>
      <Stack.Screen name="Chat" options={{ headerTransparent: true }}>
        {props => <Chat {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen name="Messenger" options={{ headerTransparent: true }}>
        {props => <Messenger {...props} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  )

}

function BottomNav({ user }) {
  return (
    <Tab.Navigator
      initialRouteName="Homer"
      shifting={true}
      labeled={false}
      sceneAnimationEnabled={false}
      screenOptions={{
        showLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: '#f1e6d8',
          },
          headerTransparent: true,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (<Ionicons name={focused ? "home" : "home-outline"} size={24} color="black" />),
        }}
      />
      <Tab.Screen
        name="MessengerStack"
        options={{
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: '#f1e6d8',
          },
          headerShown: false,
          tabBarLabel: 'Chat',
          tabBarIcon: ({ focused }) => (<Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={24} color="black" />),
        }}
      >
        {props => <MessengerStack {...props} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}



