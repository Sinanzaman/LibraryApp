import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { auth } from '../../firebase.js';
import { useState } from 'react';
import React from 'react';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';

const AdminLoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const AdminEmail = 'admin@libraryappadmin.com';
    const [password, setPassword] = useState('');
    const [isEyeEnabled, setIsEyeEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hack, setHack] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            setHack(0);
        }, [])
      );

    const backNavigate = () => {
        navigation.navigate('Home Screen');
    }

    const handleEyeChange = () => {
        if(isEyeEnabled == true){
            setIsEyeEnabled(false);
            const temp = hack;
            setHack(temp + 1);
        }else{
            setIsEyeEnabled(true);
            const temp = hack;
            setHack(temp + 1);
        }
    }

    const handleLogin = () => {
    setLoading(true);
      if(email == AdminEmail){
        auth
          .signInWithEmailAndPassword(email, password)
          .then((userCredentials) => {
            const user = userCredentials.user;
            setEmail("");
            setPassword("");
            console.log('Admin giriş yaptı', user.email);
            setLoading(false);
            navigation.navigate('AdminDashboard');
          })
          .catch((error) => alert(error.message));
          setLoading(false);
        }else{
          alert('Admin bilgilerine sahip olduğunuzdan emin olun');
          setLoading(false);
        };
      }

      const deneme = () => {
        setEmail("admin@libraryappadmin.com");
        setPassword("123456");
    }

    return(
            <View style={styles.container}>
              <View style={{marginBottom:50, marginLeft:25, width:'90%'}}>
                <TouchableOpacity style={{flexDirection:'row'}} onPress ={backNavigate}>
                  <View style={{width:30, height:30, borderWidth:1, borderColor:'white', alignItems:'center', justifyContent:'center', borderRadius:10}}>
                    <AntDesign name="left" size={20} style={{color:'#FFFCFC'}}/>
                  </View>
                </TouchableOpacity>
              </View>
                {/*Buttom View*/}
                <View style={styles.bottomView}>
                    <Text style={{marginLeft:25, marginTop:15, fontSize:20, fontWeight:'bold',}}>Admin Girişine Hoş Geldiniz</Text>
                    {/*Txt Email*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:20}}>
                        <View style={styles.txtEmail}>
                            <Icon name="email" size={30} style={{marginLeft:15, color:'#818181'}}/>
                            <View style={{ height: '100%', width: 1, backgroundColor: '#818181', marginLeft:15}}></View>
                            <TextInput
                                style={{height:50,width:'100%', fontSize:15, marginLeft:15, color:'#818181'}}
                                placeholder='E-posta'
                                value={email}
                                onChangeText={(text)=> setEmail(text)}
                            />
                        </View>
                    </View>
                    {/*Txt Password*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:20}}>
                        <View style={styles.txtPassword}>
                            <Ionicons name="key-outline" size={30} style={{marginLeft:15, color:'#818181'}}/>
                            <View style={{ height: '100%', width: 1, backgroundColor: '#818181', marginLeft:15}}></View>
                            <TextInput
                                style={{height:50,width:'65%', fontSize:15, marginLeft:15, color:'#818181'}}
                                placeholder='Şifre'
                                value={password}
                                onChangeText={(text)=> setPassword(text)}
                                secureTextEntry={!isEyeEnabled}
                            />
                            {isEyeEnabled 
                            ? 
                            <TouchableOpacity>
                                <Feather name="eye" size={30} style={{color:'#818181'}} onPress={handleEyeChange}/> 
                            </TouchableOpacity>
                            : 
                            <TouchableOpacity>
                                <Feather name="eye-off" size={30} style={{color:'#818181'}} onPress={handleEyeChange}/> 
                            </TouchableOpacity> 
                            }
                        </View>
                    </View>
                    {/*btn Sing In*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:20, flexDirection:"column"}}>
                        <TouchableOpacity style={styles.btnSingIn} onPress={handleLogin}>
                            <Text style={{color:'#FFFCFC', fontSize:20, marginLeft:110, fontWeight:'bold'}}>Giriş Yap</Text>
                            <AntDesign name="rightcircle" size={20} style={{marginLeft:100, color:'#FFFCFC'}}/>
                        </TouchableOpacity>
                        <View style={{justifyContent:'center', alignItems:'center', marginTop:20, flexDirection:"row"}}>
                        </View>

                        {/*btn Otomatik Gir*/}
                        { hack > 50 && <TouchableOpacity style={{width:'10%', 
                          height:10, 
                          backgroundColor:'#0984E3', 
                          justifyContent:'center', 
                          alignItems:'center', 
                          borderRadius:15, 
                          flexDirection:'row'}} onPress={deneme}>
                            <Text style={{color:'#FFFCFC', fontSize:8, fontWeight:'bold', textAlign:"center"}}>Otomatik gir</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
                {loading && ( <View style={styles.loadingContainer}>
                    <ActivityIndicator size={60} color="blue" />
                    <Text style={{fontWeight:"900", fontSize:18}}>Lütfen Bekleyin</Text>
                </View>
                )}
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'#2980B9',
        justifyContent:'center',
    },

    bottomView:{
        width:'90%',
        height:'50%',
        backgroundColor:'#F4F4F4',
        borderRadius:20,
    },

    txtEmail:{
        width:'90%', 
        height:50, 
        borderColor:'#818181', 
        borderWidth:1, 
        borderRadius:15,
        flexDirection:'row',
        alignItems:'center' 
    },

    txtPassword:{
        width:'90%', 
        height:50, 
        borderColor:'#818181', 
        borderWidth:1, 
        borderRadius:15,
        flexDirection:'row',
        alignItems:'center' 
    },

    btnSingIn:{
        width:'90%', 
        height:50, 
        backgroundColor:'#0984E3', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row'
    },
    btnSingInAnother:{
        width:'43%', 
        height:50, 
        backgroundColor:'#0984E3', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row',
        marginHorizontal:10,
    },

    forget:{
        width:'90%', 
        height:50,
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row'
    },

    btnRegister:{
        width:'90%', 
        height:50, 
        backgroundColor:'#2ECC71', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row',
        marginBottom:100
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject, // Tüm alanı kaplamak için
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Opak bir beyaz arka plan ekleyebilirsiniz
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AdminLoginScreen;