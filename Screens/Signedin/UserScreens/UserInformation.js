import { StyleSheet, Text, View, Dimensions, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert, Keyboard} from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { UploadProfilePicture, db, saveNameSurname, saveProfilePicture } from '../../../firebase';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../../../firebase';
import { useFocusEffect } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function UserInformation({navigation}) {
    const [loading, setLoading] = useState(false); // Yükleme durumu
    const [blobFile, setBlobFile] = useState(null); // Seçilen dosyanın blob verisi
    const [name, setName] = useState(''); // Seçilen dosyanın blob verisi
    const [mail, setMail] = useState(''); // Seçilen dosyanın blob verisi
    const [imageUrl, setImageUrl] = useState('');
    const [currentName, setCurrentName] = useState('');
    const [currentmail, setCurrentMail] = useState('');

    const user = auth.currentUser;

    useFocusEffect(
        React.useCallback(() => {
          const fetchPdfData = async () => {
            try {
              const userDoc = await db.collection('users').doc(user.uid).get(); // Kullanıcının belgesini al
              if (userDoc.exists) {
                const { user_name_surname, user_profile_picture_url } = userDoc.data(); // pdf_url ve pdf_isim alanlarını al
                setCurrentName(user_name_surname);
                setCurrentMail(user.email);
                setImageUrl(user_profile_picture_url);
              } else {
                console.log('Kullanıcı belgesi bulunamadı');
              }
            } catch (error) {
              console.error('Hata oluştu:', error);
            }
          };
    
          fetchPdfData(); // Verileri çekmek için fetchPdfData fonksiyonunu çağır
        }, [])
      );

    const pickDocument = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect:[1,1],
                quality:1,
              });
              console.log(JSON.stringify(result));

          if (!result.cancelled && result.assets.length > 0) {
            const selectedFile = result.assets[0]; // İlk belgeyi seçiyoruz
            const response = await fetch(selectedFile.uri);
            const blob = await response.blob();
            setBlobFile(blob);
          } else {
            Alert.alert('Dosya seçilmedi.');
          }
        } catch (error) {
          console.log('Belge seçme hatası:', error);
        }
      };
    const dropDocument = async () => {
        setBlobFile(null);
      };

    const backNavigate = () => {
        navigation.navigate('User');
      }

    const signOut = () => {
        navigation.navigate('Home Screen');
    };

    const handleChangeEmail = (mail) => {
        const user = auth.currentUser;
        user.verifyBeforeUpdateEmail(mail)
        .then(() => {
            // E-posta adresi başarıyla güncellendiğinde işlemler
            console.log('E-posta adresi başarıyla güncellendi.');
            alert('Yeni E-posta adresinize doğrulama linki gönderilmiştir. Lütfen doğrulama linkine girin. Güvenliğiniz için hesaptan çıkış yapılmıştır. Giriş yapmadan önce onay linkine girdiğinizden emin olun.');
            signOut();
        })
        .catch((error) => {
            console.error('E-posta adresi güncellenirken bir hata oluştu:', error);
            alert('E-posta adresi güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
        });
    };

    const handleUpload = () => {
        if(blobFile){
            setLoading(true); // Yükleme başladığında loading state'ini true yap

            UploadProfilePicture(blobFile, '_Profile_Picture.img', (isUploadCompleted) => {
                if (isUploadCompleted) {
                  saveProfilePicture('_Profile_Picture.img');
                  setBlobFile(null);
                } else {
                  Alert.alert('Resim yükleme sırasında bir hata oluştu.');
                }
              });
        }

        if(name){
            setLoading(true);
            saveNameSurname(name);
        }

        if(mail && mail !== user.email){
            setLoading(true);
            handleChangeEmail(mail);
        }
        Alert.alert( "Yükleme işlemi başarılı" );
        setMail('');
        setName('');
        setLoading(false);
    }
    
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
            <View style={styles.profileContainer}>
                {imageUrl 
                ? 
                (<Image style={styles.profilePicture} source={{ uri : imageUrl }} />) 
                : 
                (<Image style={styles.profilePicture} source={require("../../../assets/Images/userphoto.jpg")} />)
                }
                <View style={styles.profileNameSurname}>
                    <Text style={styles.profileText}>{currentName}</Text>
                    <Text style={styles.profileText}>{currentmail}</Text>
                </View>
            </View>
            <View style={[styles.buttons, styles.buttonsPrimary]}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Profil Fotoğrafı</Text>
                <View style={{flexDirection:'row'}}>
                    {!blobFile ? 
                    (<TouchableOpacity onPress={pickDocument} style={{backgroundColor:'blue', paddingVertical:6, paddingHorizontal:14, borderRadius:8,marginBottom:6}}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Profil Fotoğrafı Seç</Text>
                    </TouchableOpacity>) :
                    (<TouchableOpacity onPress={dropDocument} style={{backgroundColor:'red', paddingVertical:6, paddingHorizontal:14, borderRadius:8,marginBottom:6, marginLeft:5}}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Seçili Fotoğrafı İptal Et</Text>
                    </TouchableOpacity>)}
                </View>
            </View>
            <View style={[styles.buttons, styles.buttonsPrimary]}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Ad Soyad</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        placeholder='Ad Soyad'
                        value={name}
                        onChangeText={(text)=> setName(text)}
                    />
                </View>
            </View>
            <View style={[styles.buttons, styles.buttonsPrimary]}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>E-Posta</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        placeholder='E-Posta'
                        autoCapitalize='none'
                        value={mail}
                        onChangeText={(text)=> setMail(text)}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => {handleUpload(); Keyboard.dismiss()}} style={styles.buttonUpdate}>
                <Text style={styles.buttonUpdateText}>Güncelle</Text>
            </TouchableOpacity>
            {loading && (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={60} color="blue" />
                <Text style={{fontWeight:"900", fontSize:18}}>Dosyanız Yükleniyor Lütfen Bekleyin</Text>
            </View>)}
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
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ddd', // Gri arka plan rengi
        marginRight: 20,
    },
    profileText: {
        fontSize: 18,
        marginBottom: 5,
    },
    buttons: {
        flexDirection: 'column',
        width: screenWidth * 0.9,
        height: screenHeight* 0.09,
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
    },
    buttonTextPrimary: {
        color: '#3498DB', // Mavi renk
    },
    input: {
        width: '100%',
        fontSize: 16,
        paddingVertical: 8,
    },
    buttonUpdate:{
        width: screenWidth * 0.9,
        height: screenHeight* 0.07,
        backgroundColor:'#0984E3', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:8, 
        marginBottom: 15,
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