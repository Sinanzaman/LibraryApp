import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { auth } from '../../../firebase';
import { useFocusEffect } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function ChangePassword({navigation}) {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');

  const user = auth.currentUser;

  useFocusEffect(
    React.useCallback(() => {
      const fetchPdfData = async () => {
      };
      fetchPdfData();
    }, [])
  );

  const handleReset = () => {
    if(newPassword === newPasswordAgain && newPassword && newPasswordAgain){
      user
      .updatePassword(newPassword)
      .then(() => {
        console.log('Kullanıcı şifresini yenileme başarılı');
        alert(`Şifreniz Yenilendi. Güvenliğiniz için tekrar giriş yapın.`);
      })
      .catch((error) => alert(error.message));
      signOut();
    }
  else{
    alert(`Bu alan boş bırakılamaz !!`);
  }};

  const backNavigate = () => {
    navigation.navigate('User');
  }
  const signOut = () => {
    navigation.navigate('Home Screen');
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{marginBottom:50}}>
        <TouchableOpacity style={{flexDirection:'row', alignItems:'center',gap:10}} onPress ={backNavigate}>
          <View style={{width:30, height:30, borderWidth:1, borderColor:'black', alignItems:'center', justifyContent:'center', borderRadius:10}}>
            <AntDesign name="left" size={20} style={{color:'black'}}/>
          </View>
          <Text style={{fontWeight:'bold'}}>Geri Dön</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Yeni Şifrenizi Giriniz</Text>
      <View style={[styles.buttons, styles.buttonsPrimary]}>
        <View>
          <TextInput 
            style={styles.input}
            placeholder='Yeni Şİfre'
            value={newPassword}
            onChangeText={(text)=> setNewPassword(text)}
          />
        </View>
      </View>

      <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Yeni Şifrenizi Tekrar Giriniz</Text>
      <View style={[styles.buttons, styles.buttonsPrimary]}>
        <View>
          <TextInput 
            style={styles.input}
            placeholder='Yeni Şİfre Tekrarı'
            value={newPasswordAgain}
            onChangeText={(text)=> setNewPasswordAgain(text)}
          />
        </View>
      </View>

      <TouchableOpacity onPress={handleReset} style={styles.buttonUpdate}>
        <Text style={styles.buttonUpdateText}>Şifreyi Yenile</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#F5F5F5", // Açık gri arka plan rengi
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:50,
    },
    buttons: {
      flexDirection: 'column',
      width: screenWidth * 0.9,
      height: screenHeight* 0.06,
      borderRadius: 8,
      borderWidth: 2,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      paddingHorizontal: 20,
    },
    buttonsPrimary: {
        borderColor: '#3498DB', // Mavi renk
    },
    buttonText: {
      fontSize: 18,
      marginBottom:8,
    },
    buttonTextPrimary: {
        color: '#3498DB', // Mavi renk
    },
    input: {
      width: '100%',
      fontSize: 16,
      paddingVertical: 8,
      textAlign:'center',
    },
    buttonUpdate:{
      width: screenWidth * 0.9,
      height: screenHeight* 0.07,
      backgroundColor:'#0984E3', 
      justifyContent:'center', 
      alignItems:'center', 
      borderRadius:8, 
      marginTop:40,
    },
    buttonUpdateText: {
        color: '#FFF',
        fontSize: 18,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject, // Tüm alanı kaplamak için
      backgroundColor: 'rgba(255, 255, 255, 0.85)', // Opak bir beyaz arka plan ekleyebilirsiniz
      justifyContent: 'center',
      alignItems: 'center',
    },
})