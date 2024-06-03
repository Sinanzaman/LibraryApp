import { StyleSheet, View, Dimensions, TextInput, TouchableOpacity, Text, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';
import FavoriteCards from '../Signedin/FavoriteCards';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function AnonymousSearch({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Kitap Adı');
  const [modalVisible, setModalVisible] = useState(false);
  const [books, setBooks] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setBooks([]);
      setSelectedCategory('Kitap Adı');
    }, [])
  );

  useEffect(() => {
    if (searchText.length > 0) {
      handleSearch(selectedCategory, searchText);
    } else {
      setBooks([]); // Boş arama metni varsa kitap listesini temizle
    }
  }, [searchText, selectedCategory]);

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

  const handleSearch = async (selectedCategory, searchText) => {
    try {
      let fieldToSearch;
      switch (selectedCategory) {
        case 'pdf_book_name':
          fieldToSearch = 'pdf_book_name';
          break;
        case 'pdf_yayinevi':
          fieldToSearch = 'pdf_yayinevi';
          break;
        case 'pdf_kategoriler':
          fieldToSearch = 'pdf_kategoriler';
          break;
        case 'pdf_yazar':
          fieldToSearch = 'pdf_yazar';
          break;
        case 'pdf_desc':
          fieldToSearch = 'pdf_desc';
          break;
        case 'book_id':
          fieldToSearch = 'book_id';
          break;
        default:
          fieldToSearch = 'pdf_book_name';
      }

      const userBooksRef = collection(db, 'books');
      const userBooksSnapshot = await getDocs(userBooksRef);
      const searchedBooks = userBooksSnapshot.docs
        .filter(doc => {
          const dataField = doc.data()[fieldToSearch];
          return dataField && dataField.toLowerCase().includes(searchText.toLowerCase()) && doc.data().pdf_visibility === true;
        })
        .map(doc => doc.data());

      setBooks(searchedBooks);
      console.log(searchedBooks);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ height: 45, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="filter-circle" size={26} style={{ color: 'black', marginRight: 10 }} />
        </TouchableOpacity>
        <TextInput
          style={{ height: 50, width: '70%', fontSize: 15, marginRight:30 }}
          placeholder={categories.find(category => category.value === selectedCategory)?.label || 'Kitap Ara...'}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={() => {setSearchText(""); setBooks([])}} style={{ height: 45, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="delete" size={26} style={{ color: 'black'}} />
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
      <ScrollView contentContainerStyle={styles.searchedBooksContainer} >
      {chunkArray(books, 2).map((chunk, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {chunk.map((book, bookIndex) => (
            <View key={`${rowIndex}-${bookIndex}`} style={{ padding: 3 }}>
              <FavoriteCards
                pdf_resim_url={book.pdf_resim_url}
                navigation={navigation}
                book_id={book.book_id}
                showcomments={true}
                anonymous={true}
              />
            </View>
          ))}
        </View>
      ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: screenWidth * 0.88,
    height: screenHeight * 0.06,
    borderWidth: 1,
    borderRadius: 15,
    marginTop: screenHeight * 0.04,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  categoryItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
  searchedBooksContainer: {
    marginTop: 20,
    flexDirection:'column',
    justifyContent:'space-between',
    width: screenWidth*0.95,
  },
  searchedBookText: {
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});
