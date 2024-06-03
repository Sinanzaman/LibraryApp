import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../../firebase';
import { updateDoc, doc } from 'firebase/firestore';

export default function AdminEditBookScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params;

  const [bookName, setBookName] = useState(book.pdf_book_name);
  const [bookAuthor, setBookAuthor] = useState(book.pdf_yazar);
  const [bookPublisher, setBookPublisher] = useState(book.pdf_yayinevi);
  const [bookCategory, setBookCategory] = useState(book.pdf_kategoriler);
  const [bookDesc, setBookDesc] = useState(book.pdf_desc);

  const handleUpdate = async () => {
    try {
      const bookRef = doc(db, 'books', book.book_id);
      await updateDoc(bookRef, {
        pdf_book_name: bookName,
        pdf_yazar: bookAuthor,
        pdf_yayinevi: bookPublisher,
        pdf_kategoriler: bookCategory,
        pdf_desc: bookDesc,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Kitap güncellenirken hata oluştu:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Kitap Adı</Text>
        <TextInput
          style={styles.input}
          value={bookName}
          onChangeText={setBookName}
        />
        <Text style={styles.label}>Yazar</Text>
        <TextInput
          style={styles.input}
          value={bookAuthor}
          onChangeText={setBookAuthor}
        />
        <Text style={styles.label}>Yayınevi</Text>
        <TextInput
          style={styles.input}
          value={bookPublisher}
          onChangeText={setBookPublisher}
        />
        <Text style={styles.label}>Kategoriler</Text>
        <TextInput
          style={styles.input}
          value={bookCategory}
          onChangeText={setBookCategory}
        />
        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={bookDesc}
          onChangeText={setBookDesc}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Güncelle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
  },
  formContainer: {
    width: '80%',
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});