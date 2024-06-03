import { StyleSheet, Text, View, ScrollView, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import FavoriteCards from '../Signedin/FavoriteCards'
import { db, auth, } from '../../firebase';
import { collection, doc, getDocs } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';

export default function Favorite({ navigation }) {
  const [books, setBooks] = useState([]);
  const screenheight = Dimensions.get('window').height;

  useFocusEffect(
  React.useCallback(() => {
    const getUserBooks = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userBooksRef = collection(db, `users/${user.uid}/users_books`);
          const userBooksSnapshot = await getDocs(userBooksRef);
          const userBookIds = userBooksSnapshot.docs.map(doc => doc.data().book_id); // Kullanıcının sahip olduğu kitapların book_id değerlerini al
          const allBooksRef = collection(db, "books");
          const allBooksSnapshot = await getDocs(allBooksRef);
          const fetchedBooks = allBooksSnapshot.docs
            .filter(doc => userBookIds.includes(doc.id)) // Kullanıcının sahip olduğu kitapların book_id değerlerine sahip olan kitapları seç
            .map(doc => doc.data()); // Her belgenin verilerini diziye ekle
          setBooks(fetchedBooks); // Diziyi books state'ine atar
          console.log(books);
        } catch (error) {
          console.error("Error getting user books:", error);
        }
      } else {
        console.error('Kullanıcı oturumu açmamış.');
      }
    };
    getUserBooks();
  }, [])
);

  // Diziyi ikişerli gruplara bölen fonksiyon
  const chunkArray = (arr, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  return (
    <ScrollView style={{ backgroundColor: "#ADD8E6" }}>
      <Text style={{ padding: 15, fontSize: 27, fontWeight: "bold", marginTop: 10 }}>Kitaplığım</Text>
      <View style={styles.container}>
        {books.length === 0 ? (
          <>
          <Image 
          source={require('../../assets/Images/nobook.png')}
          resizeMode="cover" 
          style={{height:180, width:300, alignSelf:'center', marginTop:screenheight*0.2}}
          />
          <Text style={{alignSelf:'center', fontSize:25, fontWeight:'bold', marginTop: screenheight*0.03}}>Kitaplık Boş</Text>
          </>
        ) : (
          chunkArray(books, 2).map((chunk, index) => (
            <View key={index} style={styles.row}>
              {chunk.map((book, subIndex) => (
                <View key={subIndex} style={{ flex: 1 }}>
                  <FavoriteCards
                    pdf_resim_url={book.pdf_resim_url}
                    pdf_url={book.pdf_url}
                    navigation={navigation}
                    book_id={book.book_id}
                  />
                </View>
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});
