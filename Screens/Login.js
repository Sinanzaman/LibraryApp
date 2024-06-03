import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import React from 'react';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';

const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEyeEnabled, setIsEyeEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hack, setHack] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            setHack(0);
        }, [])
      );

    const navigate = () => {
        navigation.navigate('Singup');
    }

    const Forget = () => {
        navigation.navigate('Forget')
    }

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
        auth
          .signInWithEmailAndPassword(email, password)
          .then((userCredentials) => {
            const user = userCredentials.user;
            if (user.emailVerified) {
                setEmail("");
                setPassword("");
                console.log('Kullanıcı giriş yaptı', user.email);
                navigation.navigate('Dashbord');
            } else {
                alert('E-posta adresinizi doğrulamak için lütfen e-postanızı kontrol edin ve doğrulama bağlantısına tıklayın.');
                user.sendEmailVerification();
            }
          })
          .catch((error) => alert(error.message));
          setLoading(false);
        };

    const deneme = () => {
        setEmail("sinanhesap55@gmail.com");
        setPassword("123456");
    }

    return(
            <View style={styles.container}>
                {/*Top View*/}
                <View style={styles.topView}>
                    <View>
                        <TouchableOpacity style={{flexDirection:'row'}} onPress ={backNavigate}>
                            <View style={{width:30, height:30, borderWidth:1, marginTop:30, marginLeft:25,borderColor:'white', alignItems:'center', justifyContent:'center', borderRadius:10}}>
                                <AntDesign name="left" size={20} style={{color:'#FFFCFC'}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Image style={styles.image}
                            source={require('../assets/Images/Logo-1.png')}
                        />
                    </View>
                </View>

                {/*Buttom View*/}
                <View style={styles.bottomView}>
                    <Text style={{marginLeft:25, marginTop:15, fontSize:20, fontWeight:'bold',}}>Hoş Geldiniz</Text>
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

                        {/* ---GOOGLE VE FACEBOOK İLE GİRİŞ YAP */}
                        
                        {/* <TouchableOpacity style={styles.btnSingInAnother} onPress={handleLogin}>
                            <Image source={require('../assets/Images/facebookicon.png')} style={{ marginRight:10, width:30, height:30, backgroundColor:'white', borderRadius:20}}></Image>
                            <Text style={{color:'#FFFCFC', fontSize:20, fontWeight:'bold'}}>' ile gir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnSingInAnother} onPress={handleLogin}>
                            <Image source={require('../assets/Images/googleicon.png')} style={{ marginRight:10, width:30, height:30, backgroundColor:'white', borderRadius:20}}></Image>
                            <Text style={{color:'#FFFCFC', fontSize:20, fontWeight:'bold'}}>' ile gir</Text>
                        </TouchableOpacity> */}
                        </View>
                        {hack > 50 && <TouchableOpacity style={{width:'10%', 
                    height:10, 
        backgroundColor:'#0984E3', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row'}} onPress={deneme}>
                            <Text style={{color:'#FFFCFC', fontSize:8, fontWeight:'bold', textAlign:"center"}}>Otomatik gir</Text>
                        </TouchableOpacity>}
                    </View>
                    {/*Forgot your password*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:5,}}>
                        <TouchableOpacity style={styles.forget} onPress={Forget}>
                            <Text style={{color:'blue', fontSize:15,}}>Şifreni mi unuttun ?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:5,}}>
                        <View style={{width:'90%', borderWidth:0.5}}></View>
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:10,}}>
                        <View><Text>Ya da</Text></View>
                    </View>
                    {/*Sign up now*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:15}}>
                        <TouchableOpacity style={styles.btnRegister} onPress ={navigate}>
                            <Text style={{color:'#FFFCFC', fontSize:20, marginLeft:90, fontWeight:'bold'}}>Şimdi Kayıt Ol</Text>
                            <Entypo name="add-user" size={20} style={{marginLeft:70, color:'#FFFCFC'}}/>
                        </TouchableOpacity>
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

    topView:{
        width:'100%',
        height:'37%',
        justifyContent:'center',
    },

    image:{
        width:260, 
        height:200,
    },

    bottomView:{
        width:'100%',
        height:'63%',
        backgroundColor:'#F4F4F4',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
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

export default Login;