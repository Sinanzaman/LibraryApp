import React from "react";
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';

import AnonymousExplore from "./AnonymousExplore";
import AnonymousSearch from "./AnonymousSearch";

const Tab = createBottomTabNavigator();

const AnonymousDashboard = ({navigation}) => {
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Çıkış Yap',
                    'Uygulamadan çıkmak istediğinize emin misiniz?',
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
        navigation.navigate('Home Screen');
    }

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Explore"
                component={AnonymousExplore}
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
                component={AnonymousSearch}
                options={{
                    tabBarLabel: 'Ara',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="search1" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default AnonymousDashboard;
