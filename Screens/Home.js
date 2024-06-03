import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground, BackHandler, Alert } from 'react-native';

const Home = ({navigation}) =>{

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Çıkış Yap',
                    'Uygulamadan çıkmak istediğinize emin misiniz?',
                    [
                        { text: 'Hayır', style: 'cancel' },
                        { text: 'Evet', onPress: () => BackHandler.exitApp() }
                    ]
                );
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const navigateLogin = () => {
        navigation.navigate('Login');
    }
    
    const navigateAdmin = () => {
        navigation.navigate('AdminLoginScreen');
    }

    const navigateAnonymous = () => {
        navigation.navigate('AnonymousDashboard');
    }

    return(
       <ScrollView contentContainerStyle={{flex:1}}>
            <View style={styles.container}>
                <View style={{marginTop:100}}>
                    <Image style={{width:230, height:230}}
                        source={require('../assets/Images/Logo.png')}
                    />
                </View>

                <View>
                    <Text style={styles.bookShop}>Mobil Kütüphane</Text>
                </View>

                <View style={{width:'70%'}}>
                    {/* <Text style={styles.lorem}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum 
                    has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled 
                    it to make a type specimen book</Text> */}
                    <Text style={styles.lorem}>Hoşgeldiniz</Text>
                </View>

                <View style={{justifyContent:'center', alignItems:'center', width:'100%'}}>
                    <TouchableOpacity style={styles.btnTouch} onPress ={navigateLogin}>
                            <Text style={styles.btnSing}>Uygulamaya Gir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnTouchAdmin} onPress ={navigateAdmin}>
                            <Text style={styles.btnSing}>Admin Girişi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnTouchAnonymous} onPress ={navigateAnonymous}>
                            <Text style={styles.btnSing}>Uygulamayı Anonim Keşfet</Text>
                    </TouchableOpacity>
                </View>
            </View>
       </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ADD8E6',
      alignItems: 'center',
    },

    bookShop:{
        marginTop:50,
        fontSize:30,
        fontWeight:'bold',
    },

    lorem:{
        marginTop:30,
        fontSize:14,
        textAlign:'center',
    },

    btnTouch:{
        marginTop:30,
        width:'90%', 
        height:50, 
        backgroundColor:'#0984E3', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15,
    },
    btnTouchAdmin:{
        marginTop:20,
        width:'90%', 
        height:50, 
        backgroundColor:'#2ECC71', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15,
    },
    btnTouchAnonymous:{
        marginTop:20,
        width:'90%', 
        height:50, 
        backgroundColor:'#003285', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15,
    },
    btnSing:{
        color:'#FFFCFC', 
        fontSize:20, 
        fontWeight:'bold',
    }
  });

export default Home;