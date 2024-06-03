import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { db, saveSuggestionAndComplaint } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function OneriSikayet({navigation}) {
  const [feedback, setFeedback] = useState('');

  const handleSendFeedback = async () => {
    if(feedback.length < 10){
      Alert.alert('Hata', 'Lütfen istek veya şikayetinizi biraz daha uzun yazarak belirtin.');
      return;
    }
    try {
      saveSuggestionAndComplaint(feedback);
      setFeedback("");
      Alert.alert('İsteğiniz veya Şikayetiniz Yönetici tarafına iletildi. Teşekkürler :)');
    } catch (error) {
      Alert.alert('Hata', 'İstek veya şikayetiniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
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
      <Text style={styles.header}>Öneri ve Şikayetler</Text>
      <TextInput
        style={styles.input}
        placeholder="İstek veya şikayetinizi yazın..."
        value={feedback}
        onChangeText={(text) => setFeedback(text)}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSendFeedback}>
        <Text style={styles.buttonText}>Gönder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});