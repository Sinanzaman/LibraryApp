import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, TextInput, Modal, TouchableWithoutFeedback, ScrollView, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, startAfter, limit, where } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PAGE_SIZE = 5; // Bir seferde kaç kitap yükleneceğini belirler
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function AdminBookScreen() {
  const [books, setBooks] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moreAvailable, setMoreAvailable] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('pdf_book_name');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const categories = [
    { value: 'pdf_book_name', label: 'Kitap Adı' },
    { value: 'pdf_yayinevi', label: 'Yayınevi' },
    { value: 'pdf_kategoriler', label: 'Kategori' },
    { value: 'pdf_yazar', label: 'Yazar' },
    { value: 'pdf_desc', label: 'Açıklama' },
    { value: 'book_id', label: 'Kitap Id' }
  ];

  const renderCategories = () => {
    return categories.map((category, index) => (
      <TouchableOpacity key={index} onPress={() => handleCategorySelect(category.value)} >
        <Text style={styles.categoryItem}>{category.label}</Text>
      </TouchableOpacity>
    ));
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setModalVisible(false);
  }

  const getBooks = async (loadMore = false) => {
    if (loading) return; // Halihazırda yükleniyorsa yeni istek yapma

    setLoading(true);
    try {
      let booksRef = collection(db, 'books');
      let booksQuery = query(booksRef, orderBy('pdf_book_name'), limit(PAGE_SIZE));

      if (loadMore && lastVisible) {
        booksQuery = query(booksRef, orderBy('pdf_book_name'), startAfter(lastVisible), limit(PAGE_SIZE));
      }

      const booksSnapshot = await getDocs(booksQuery);
      const fetchedBooks = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lastVisibleDoc = booksSnapshot.docs[booksSnapshot.docs.length - 1];

      if (loadMore) {
        setBooks(prevBooks => [...prevBooks, ...fetchedBooks]);
      } else {
        setBooks(fetchedBooks);
      }

      setLastVisible(lastVisibleDoc);
      setMoreAvailable(fetchedBooks.length === PAGE_SIZE);
    } catch (error) {
      console.error("Kitaplar alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchText.length === 0) {
      getBooks();
      return;
    }

    setLoading(true);
    try {
      const booksRef = collection(db, 'books');
      const booksSnapshot = await getDocs(booksRef);
      const searchedBooks = booksSnapshot.docs
        .filter(doc => {
          const dataField = doc.data()[selectedCategory];
          return dataField && dataField.toLowerCase().includes(searchText.toLowerCase());
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));

      setBooks(searchedBooks);
      setMoreAvailable(false); // Arama sonuçları için daha fazla yükle butonu göstermemek için
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getBooks();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.bookContainer} onPress={() => navigation.navigate('AdminBookDetailScreen', { book: item })}>
      <Image source={{ uri: item.pdf_resim_url }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.pdf_book_name}</Text>
        <Text style={styles.bookAuthor}>{item.pdf_yazar}</Text>
        <Text style={styles.bookPublisher}>{item.pdf_yayinevi}</Text>
        <Text style={styles.bookCategory}>{item.pdf_kategoriler}</Text>
      </View>
    </TouchableOpacity>
  );

  const closeModal = () => {
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Kitap Ekranı</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ height: 45, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="filter-circle" size={26} style={{ color: 'black', marginRight: 10 }} />
        </TouchableOpacity>
        <TextInput
          style={{ height: 50, width: '70%', fontSize: 15 }}
          placeholder={categories.find(category => category.value === selectedCategory)?.label || 'Kitap Ara...'}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={handleSearch} style={{ height: 45, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="search" size={26} style={{ color: 'black', marginRight: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setSearchText(''); setBooks([]); getBooks(); }} style={{ height: 45, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="delete" size={26} style={{ color: 'black' }} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {renderCategories()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={!searchText && moreAvailable ? (
          <TouchableOpacity onPress={() => getBooks(true)} style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Daha Fazla Yükle</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noMoreText}>{books.length > 0 ? '' : 'Kitap bulunamadı'}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookImage: {
    width: 90,
    height: 160,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
  },
  bookPublisher: {
    fontSize: 14,
    color: '#999',
  },
  bookCategory: {
    fontSize: 14,
    color: '#999',
  },
  loadMoreButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginVertical: 20,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
  },
  noMoreText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: screenWidth * 0.8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  categoryItem: {
    fontSize: 18,
    padding: 10,
  },
});
