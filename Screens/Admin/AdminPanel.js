import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, TextInput, Keyboard, ScrollView, BackHandler } from 'react-native';
import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { UploadPdfAdmin, UploadPdfImageAdmin, savePdfAdmin, savePdfImageAdmin, savePdfDescAdmin, savePdfBookNameAdmin
  ,saveYayinEvi, saveKategoriler, saveYazar, auth, saveVisibility } from '../../firebase.js';
import { useFocusEffect } from '@react-navigation/native';


export default function AdminPanel({navigation}) {
  const [fileName, setFileName] = useState(''); // Seçilen dosyanın adı
  const [imageName, setImageName] = useState(''); // Seçilen dosyanın adı
  const [blobFile, setBlobFile] = useState(null); // Seçilen dosyanın blob verisi
  const [blobFileimage, setBlobFileimage] = useState(null); // Seçilen dosyanın blob verisi
  const [loading, setLoading] = useState(false); // Yükleme durumu
  const [bookName, setBookName] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [yayinevi, setYayinevi] = useState('');
  const [kategoriler, setKategoriler] = useState('');
  const [yazar, setYazar] = useState('');

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

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', // Yalnızca pdf dosyalarını filtrele
      });
      console.log('Result:', JSON.stringify(result));
  
      if (!result.cancelled && result.assets.length > 0) {
        const selectedFile = result.assets[0]; // İlk belgeyi seçiyoruz
        const response = await fetch(selectedFile.uri);
        const blob = await response.blob();
        setFileName(selectedFile.name);
        setBlobFile(blob);
      } else {
        Alert.alert('Dosya seçilmedi.');
      }
    } catch (error) {
      console.log('Belge seçme hatası:', error);
    }
  };
  const pickBookImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect:[9,15],
        quality:1,
      });
      console.log(JSON.stringify(result));
  
      if (!result.cancelled && result.assets.length > 0) {
        const selectedFile = result.assets[0]; // İlk belgeyi seçiyoruz
        const response = await fetch(selectedFile.uri);
        const blob = await response.blob();
        const selectedFilename = selectedFile.uri.split('/').pop(); // Dosya adını al
        setImageName(selectedFilename);
        setBlobFileimage(blob);
      } else {
        Alert.alert('Kitap Resmi seçilmedi.');
      }
    } catch (error) {
      console.log('Kitap Resmi seçme hatası:', error);
    }
  };

  const generateRandomFileName = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomName = '';
    for (let i = 0; i < 20; i++) {
      randomName += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomName ;
  };

  const handleUpload = () => {
    if (!blobFile) {
      Alert.alert('Lütfen önce bir dosya seçin.');
      return;
    }

    const randomFileName = generateRandomFileName();
    setLoading(true); // Yükleme başladığında loading state'ini true yap

    // Firebase'e yükleme fonksiyonunu çağır
    UploadPdfAdmin(blobFile, randomFileName, (isUploadCompleted) => {
      /* setLoading(false); // Yükleme tamamlandığında loading state'ini false yap */
      if (isUploadCompleted) {
        savePdfAdmin(randomFileName);
        setFileName('');
        setBlobFile(null);

        handleUploadBookImage(randomFileName);

        // Yükleme tamamlandığında gerekli işlemleri yapabilirsiniz
      } else {
        Alert.alert('Dosya yükleme sırasında bir hata oluştu.');
      }
    });
  };

  const handleUploadBookImage = (randomFileName) => {
    if (!blobFileimage) {
      Alert.alert('Lütfen önce bir resim seçin.');
      return;
    }
                  /* setLoading(true); // Yükleme başladığında loading state'ini true yap */
    const user = auth.currentUser;
    // Firebase'e yükleme fonksiyonunu çağır
    UploadPdfImageAdmin(blobFileimage, randomFileName, (isUploadCompleted) => {
      if (isUploadCompleted) {
        savePdfImageAdmin(randomFileName);
        savePdfDescAdmin(bookDesc,randomFileName);
        savePdfBookNameAdmin(bookName,randomFileName);
        saveYayinEvi(yayinevi,randomFileName);
        saveKategoriler(kategoriler,randomFileName);
        saveYazar(yazar,randomFileName);
        saveVisibility(true,randomFileName);
        setBookName('');
        setBookDesc('');
        setImageName('');
        setYayinevi('');
        setKategoriler('');
        setYazar('');
        setBlobFileimage(null);
        Alert.alert("Yükleme işlemi başarılı");
        // Yükleme tamamlandığında gerekli işlemleri yapabilirsiniz
      } else {
        Alert.alert('Resim yükleme sırasında bir hata oluştu.');
      }
      setLoading(false); // Yükleme tamamlandığında loading state'ini false yap
    });
  };

const handleReset = () => {
  setFileName('');
  setImageName('');
  setBlobFile(null);
  setBlobFileimage(null);
  setBookName('');
  setBookDesc('');
  setYayinevi('');
  setKategoriler('');
  setYazar('');
}

return (
  <ScrollView contentContainerStyle={styles.container}>

    <View style={styles.containerimageselection}>
      <TouchableOpacity onPress={pickBookImage} style={[styles.button,{marginLeft:5}]}>
        <Text style={styles.buttonText}>{blobFileimage ? "Kitap Resmini Değiştir" : "Kitap Resmini Seç"}</Text>
      </TouchableOpacity>
      {imageName ? (
        <Text style={[styles.fileName,{marginBottom:20, marginLeft:10, marginRight:200, textAlign:'center'}]}>Seçilen Resim: {imageName}</Text>
      ) : (<Text style={{marginTop: 20, fontSize: 16,position:'absolute', right:5 }}></Text>)}
    </View>

    <View style={styles.containerimageselection}>

    <TouchableOpacity onPress={pickDocument} style={[styles.button,{marginLeft:5}]}>
      <Text style={styles.buttonText}>{blobFile ? "Dosyayı Değiştir" : "Dosya Seç"}</Text>
    </TouchableOpacity>

    {fileName ? (
      <Text style={[styles.fileName,{marginBottom:20, marginLeft:10, marginRight:160, textAlign:'center'}]}>Seçilen Dosya: {fileName}</Text>
    ) : (<Text style={{marginTop: 20, fontSize: 16,position:'absolute', right:5}}></Text>)}
    </View>

    <TextInput
      style={styles.input}
      placeholder="Kitap Adını Girin"
      onChangeText={text => setBookName(text)}
      value={bookName}
    />

    <TextInput
      style={styles.input}
      placeholder="Kitap Yayınını Girin"
      onChangeText={text => setYayinevi(text)}
      value={yayinevi}
    />

    <TextInput
      style={styles.input}
      placeholder="Kitap Kategorilerini Girin"
      onChangeText={text => setKategoriler(text)}
      value={kategoriler}
    />

    <TextInput
      style={styles.input}
      placeholder="Kitap Yazarını Girin"
      onChangeText={text => setYazar(text)}
      value={yazar}
    />

    <TextInput
      style={styles.inputDesc}
      placeholder="Kitap Açıklamasını Girin"
      onChangeText={text => setBookDesc(text)}
      value={bookDesc}
      multiline={true}
    />

    {(blobFile && blobFileimage && bookName && bookDesc && yazar && kategoriler && yayinevi) ? (
    <TouchableOpacity onPress={() => {handleUpload(); Keyboard.dismiss()}} style={[styles.button, { backgroundColor: 'green' }]}>
      <Text style={styles.buttonText}>Dosyayı Yükle</Text>
    </TouchableOpacity>) : (<View></View>) }

    <View style={styles.buttonContainer}>
    <TouchableOpacity style={[styles.button,{backgroundColor:'red',width:180}]} onPress={handleReset}>
      <Text style={[styles.buttonText,{textAlign:'center'}]}>Sıfırla</Text>
    </TouchableOpacity>
  </View>

    {loading && (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={60} color="blue" />
      <Text style={{fontWeight:"900", fontSize:18}}>Dosyanız Yükleniyor Lütfen Bekleyin</Text>
    </View>
)}
  

  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:70,
  },
  containerimageselection:{
    width:'85%',
    borderWidth:1,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    marginBottom:10,
    borderRadius: 5,
    borderColor: 'gray',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    justifyContent:'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    width: '85%',
  },
  inputDesc: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal:15,
    marginTop: 10,
    marginBottom: 10,
    width: '85%',
  },
  fileName: {
    marginTop: 20,
    fontSize: 16,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject, // Tüm alanı kaplamak için
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Opak bir beyaz arka plan ekleyebilirsiniz
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
