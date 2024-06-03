import React from "react";
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { auth } from "../../firebase";

import AdminPanel from "./AdminPanel";
import AdminBookScreen from "./AdminBookScreen";
import AdminSuggestionAndComplaint from "./AdminSuggestionAndComplaint";

const Tab = createBottomTabNavigator();

const AdminDashboard = ({navigation}) => {
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
                name="AdminPanel"
                component={AdminPanel}
                options={{
                    tabBarLabel: 'Kitap Ekleme Paneli',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="book-plus" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="AdminBookScreen"
                component={AdminBookScreen}
                options={{
                    tabBarLabel: 'Kitap Düzenleme Paneli',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="book-sync" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="AdminSuggestionAndComplaint"
                component={AdminSuggestionAndComplaint}
                options={{
                    tabBarLabel: 'İstek ve Şikayetler',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="privacy-tip" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default AdminDashboard;
