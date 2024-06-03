import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { db, deleteFolderContents, storage } from '../../firebase';
import { deleteDoc, doc, getDocs, collection } from 'firebase/firestore';

export default function AdminBookDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params;
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(false);
    }, [book])
  );

  const deleteBook = async (id) => {
    try {
      await deleteDoc(doc(db, 'books', id));
      await deleteFolderContents(storage, `books/${id}`);
      navigation.goBack();
    } catch (error) {
      console.error("Kitap silinirken hata oluştu:", error);
    }
  };

  const handleDeleteAlert = () => {
    Alert.alert(
      'Sil',
      'Kitabı silmek istediğinize emin misiniz? Kitaba ait tüm bilgiler silinecek!',
      [
        { text: 'Hayır', style: 'cancel' },
        { text: 'Evet', onPress: () => deleteBook(book.book_id) }
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('AdminEditBookScreen', { book });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {!loading && book &&
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {book.pdf_resim_url && <Image source={{ uri: book.pdf_resim_url }} resizeMode="cover" style={styles.image}></Image>}
        </View>
        <View style={styles.textlabel}>
          <Text style={styles.bookTitle}>{book.pdf_book_name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Yayınevi: </Text>
            <Text style={styles.infoText}>{book.pdf_yayinevi}</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kategoriler: </Text>
            <Text style={styles.infoText}>{book.pdf_kategoriler}</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Yazar: </Text>
            <Text style={styles.infoText}>{book.pdf_yazar}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kitap Id: </Text>
            <Text style={styles.infoText}>{book.book_id}</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>{book.pdf_desc}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAlert}>
            <Text style={styles.buttonText}>Sil</Text>
          </TouchableOpacity>
        </View>
      </View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textlabel: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 20,
  },
  imageContainer: {
    height: 450,
    width: 270,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    margin: 4,
    marginTop: 70,
  },
  image: {
    height: '101%',
    width: '101%',
    borderRadius: 15,
  },
  bookTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginTop: 20,
  },
  infoRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    maxWidth: '90%',
  },
  divider: {
    borderBottomWidth: 3,
    marginVertical: 4,
    borderColor: '#ADD8E6',
  },
  textContainer: {
    width: '85%',
    marginTop: 20,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    marginBottom:30,
  },
  editButton: {
    backgroundColor: 'orange',
    borderRadius: 15,
    marginHorizontal: 10,
    width:120,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 15,
    marginHorizontal: 10,
    width:120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    padding: 8,
    marginHorizontal: 5,
  },
});
