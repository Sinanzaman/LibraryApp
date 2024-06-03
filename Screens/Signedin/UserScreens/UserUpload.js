import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, TextInput, Keyboard } from 'react-native';
import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker'; // Expo için belge seçme kütüphanesi
import * as ImagePicker from 'expo-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { UploadPdfUser, UploadPdfImageUser, savePdfUser, savePdfImageUser,
   savePdfDescUser, saveLastOpened, saveYayinEvi, saveKategoriler, saveYazar, saveVisibility, addBookToUser,
   savePdfBookNameUser, saveLastPage} from '../../../firebase.js'

export default function UserUpload({navigation}) {
  const [fileName, setFileName] = useState(''); // Seçilen dosyanın adı
  const [imageName, setImageName] = useState(''); // Seçilen dosyanın adı
  const [blobFile, setBlobFile] = useState(null); // Seçilen dosyanın blob verisi
  const [blobFileimage, setBlobFileimage] = useState(null); // Seçilen dosyanın blob verisi
  const [loading, setLoading] = useState(false); // Yükleme durumu
  const [bookName, setBookName] = useState('');

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
    UploadPdfUser(blobFile, randomFileName, (isUploadCompleted) => {
      if (isUploadCompleted) {
        savePdfUser(randomFileName);
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
    UploadPdfImageUser(blobFileimage, randomFileName, (isUploadCompleted) => {
      if (isUploadCompleted) {
        savePdfImageUser(randomFileName);
        const desc = "Bu Dosya Cihazdan Yüklenmiştir";
        savePdfDescUser(desc,randomFileName);
        saveLastOpened(randomFileName);
        saveYayinEvi("---",randomFileName);
        saveKategoriler("---",randomFileName);
        saveYazar("---",randomFileName);
        saveVisibility(false,randomFileName);
        saveLastPage(1,randomFileName);
        savePdfBookNameUser(bookName,randomFileName);
        addBookToUser(randomFileName);
        setBookName('');
        setImageName('');
        setBlobFileimage(null);
        Alert.alert("Yükleme işlemi başarılı");
        // Yükleme tamamlandığında gerekli işlemleri yapabilirsiniz
      } else {
        Alert.alert('Resim yükleme sırasında bir hata oluştu.');
      }
      setLoading(false); // Yükleme tamamlandığında loading state'ini false yap
    });
  };

  const backNavigate = () => {
    navigation.navigate('User');
}

  return (
    <View style={styles.container}>
      <View style={{marginBottom:50}}>
      <TouchableOpacity style={{flexDirection:'row', alignItems:'center',gap:10}} onPress ={backNavigate}>
        <View style={{width:30, height:30, borderWidth:1, borderColor:'black', alignItems:'center', justifyContent:'center', borderRadius:10}}>
          <AntDesign name="left" size={20} style={{color:'black'}}/>
        </View>
        <Text style={{fontWeight:'bold'}}>Geri Dön</Text>
      </TouchableOpacity>
      </View>

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

      {(blobFile && blobFileimage && bookName) ? (
      <TouchableOpacity onPress={() => {handleUpload(); Keyboard.dismiss()}} style={[styles.button, { backgroundColor: 'green' }]}>
        <Text style={styles.buttonText}>Dosyayı Yükle</Text>
      </TouchableOpacity>) : (<View></View>) }

      {loading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={60} color="blue" />
        <Text style={{fontWeight:"900", fontSize:18}}>Dosyanız Yükleniyor Lütfen Bekleyin</Text>
      </View>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerimageselection:{
    width:'85%',
    borderWidth:1,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    marginBottom:20,
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
});
