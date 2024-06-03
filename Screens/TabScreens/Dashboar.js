import React from "react";
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { auth } from "../../firebase";

import Profile from "./Profile";
import Explore from "./Explore";
import LastRead from "./LastRead";
import Favorite from "./Favorite";
import Search from "./Search";

const Tab = createBottomTabNavigator();

const Dashboard = ({navigation}) => {
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Çıkış Yap',
                    'Hesaptan çıkmak istediğinize emin misiniz?',
                    [
                        { text: 'Hayır', style: 'cancel' },
                        { text: 'Evet', onPress: homeNavigate }
                    ]
                );
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const homeNavigate = () => {
        auth
            .signOut()
            .then(() => {
                console.log('User signed out!');
                navigation.navigate('Home Screen');
            })
            .catch(error => {
                console.error('Sign out error', error);
            });
    };

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="LastRead"
                component={LastRead}
                options={{
                    tabBarLabel: 'Son Okunan',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="book-open" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Explore"
                component={Explore}
                options={{
                    tabBarLabel: 'Keşfet',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="find" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarLabel: 'Ara',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="search1" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Favorite"
                component={Favorite}
                options={{
                    tabBarLabel: 'Kitaplığım',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Fontisto name="favorite" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="User"
                component={Profile}
                options={{
                    tabBarLabel: 'Kullanıcı',
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: '#ADD8E6', // Header'ın arka plan rengi
                    },
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default Dashboard;
