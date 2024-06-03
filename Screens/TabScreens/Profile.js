import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Image, Alert} from 'react-native';
import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function Profile({ navigation }) {
    const [imageUrl, setImageUrl] = useState('');
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');

    const user = auth.currentUser;

    useFocusEffect(
        React.useCallback(() => {
          const fetchPdfData = async () => {
            try {
              const userDoc = await db.collection('users').doc(user.uid).get(); // Kullanıcının belgesini al
              if (userDoc.exists) {
                const { user_name_surname, user_profile_picture_url } = userDoc.data(); // pdf_url ve pdf_isim alanlarını al
                setName(user_name_surname);
                setMail(user.email);
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

    const signOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.navigate('Home Screen');
            })
            .catch((error) => Alert(error.message));
    };

    const handleSignOut = () => {
        // Kullanıcıya emin misin diye sor
        Alert.alert(
            "Çıkış Yap",
            "Çıkış yapmak istediğinizden emin misiniz?",
            [
                {
                    text: "Hayır, Geri Dön",
                    style: "cancel"
                },
                { text: "Evet", onPress: () => signOut() }
            ]
        );
    };

    const handleUserInformation = () => {
        navigation.navigate('UserInformation');
      }
    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
      }
    const handleUserUpload = () => {
        navigation.navigate('UserUpload');
      }
    const handleTermsAndPrivacyPolicy = () => {
        navigation.navigate('TermsAndPrivacyPolicy');
      }
    const handleOneriSikayet = () => {
        navigation.navigate('OneriSikayet');
      }
    const handleDeleteAccount = () => {
        navigation.navigate('DeleteAccount');
      }
    const handleAddAlert = () => {
        navigation.navigate('AddAlert');
      }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileContainer}>
                {/* <Image style={styles.profilePicture} source={require('../../assets/Images/sfenxy.jpg')} /> */}
                {imageUrl 
                ?
                (<Image style={styles.profilePicture} source={{ uri: imageUrl }} />)
                :
                (<Image style={styles.profilePicture} source={require('../../assets/Images/userphoto.jpg')} />)
                }
                <View>
                    <Text style={styles.profileText}>{name ? (name) : ('Ad Bilgisi Bulunamadı')}</Text>
                    <Text style={styles.profileText}>{mail ? (mail) : (user.email)}</Text>
                </View>
            </View>
            <TouchableOpacity style={[styles.buttons, styles.buttonsPrimary]} onPress={handleUserInformation}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Kişisel Bilgiler</Text>
                <AntDesign name="right" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsPrimary]} onPress={handleAddAlert}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Hatırlatıcı Alarm Kur</Text>
                <AntDesign name="right" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsPrimary]} onPress={handleChangePassword}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Şifre Değiştir</Text>
                <AntDesign name="right" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsPrimary]} onPress={handleUserUpload}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Cihazdan Kitap Ekle</Text>
                <AntDesign name="right" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsPrimary]} onPress={handleTermsAndPrivacyPolicy}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Şartlar ve Gizlilik Politikası</Text>
                <AntDesign name="right" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsPrimary]} onPress={handleOneriSikayet}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Öneri veya Şikayet İlet</Text>
                <AntDesign name="right" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsSecondary]} onPress={handleDeleteAccount}>
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Hesabımı Sil</Text>
                <AntDesign name="right" size={20} style={[styles.icon, { color: '#fff' }]} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsSecondary]} onPress={handleSignOut}>
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Çıkış Yap</Text>
                <AntDesign name="right" size={20} style={[styles.icon, { color: '#fff' }]} />
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
        flexDirection: 'row',
        width: screenWidth * 0.9,
        height: screenHeight * 0.065,
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
    buttonsSecondary: {
        backgroundColor: '#E74C3C', // Kırmızı renk
    },
    buttonText: {
        fontSize: 18,
    },
    buttonTextPrimary: {
        color: '#3498DB', // Mavi renk
    },
    buttonTextSecondary: {
        color: '#fff', // Beyaz renk
    },
    icon: {
        color: '#000', // Siyah renk
    },
})
