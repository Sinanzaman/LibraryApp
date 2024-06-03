import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { auth, db, deleteFolderContents } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import CommentCards from '../Signedin/CommentCards';

export default function AnonymousBookScreen(props) {
  const { navigation } = props;
  const { book_id, showcomments } = props.route.params;
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState();
  const [comments, setComments] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const getBookAndUsersBook = async () => {
        try {
          const BooksRef = collection(db, `books`);
          const BooksSnapshot = await getDocs(BooksRef);
          const fetchedBook = BooksSnapshot.docs
            .filter(doc => doc.data().book_id === book_id)
            .map(doc => doc.data()); 
          setBook(fetchedBook[0]);
        } catch (error) {
          console.error("Error getting user book:", error);
        }
      };
      getBookAndUsersBook();
    }, [book_id])
  );
  
  useEffect(() => {
    setLoading(false);
  }, [book]);
  
  const handleRead = (bookid, pdf_url, pdf_LastPage, bookname) => {
    navigation.navigate('ReadingBook', {bookid: bookid, pdf_url: pdf_url, pdf_LastPage: pdf_LastPage, isThere: false, headerTitle: bookname});
  }

  useEffect(() => {
    handleGetComment();
  }, [book_id]);

  const handleGetComment = () => {
    const fetchBookComments = async () => {
      try {
        const bookRef = db.collection('book_comments').doc(book_id);
        const doc = await bookRef.get();
        if (doc.exists) {
          const data = doc.data();
          const comments = [];
          // Yorum alanlarını diziye dönüştür ve tarihe göre sırala
          for (const commentId in data) {
            if (data.hasOwnProperty(commentId)) {
              comments.push({
                id: commentId,
                ...data[commentId]
              });
            }
          }
          // Yorumları tarihe göre ters sırala
          comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setComments(comments);  // Sıralanmış yorumları state'e kaydet
        } else {
          console.log('Belirtilen kitap bulunamadı.');
        }
      } catch (error) {
        console.error('Yorumlar çekilirken bir hata oluştu: ', error);
      } finally {
        setLoading(false); // Yükleme durumunu false yap
      }
    };
    fetchBookComments();
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {!loading && book &&
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {book.pdf_resim_url && <Image source={{ uri: book.pdf_resim_url }} resizeMode="cover" style={styles.image}></Image>}
        </View>
        <View style={styles.textlabel}>
          <Text style={{fontSize:30, fontWeight:'bold', marginTop:20, textAlign:'center', marginBottom:10}}>{book.pdf_book_name}</Text>
        </View>
        <View style={{backgroundColor:'white', padding:5, borderRadius:15, paddingHorizontal:25,paddingVertical:10}}>
          <View style={{justifyContent:'center', alignItems: 'center',flexDirection:'row'}}>
            <Text style={{fontSize:18, fontWeight:'bold'}}>Yayınevi : </Text>
            <Text style={{fontSize:18, fontWeight:'bold',maxWidth:'90%'}}>{book.pdf_yayinevi}</Text>
          </View>
          <View style={{borderBottomWidth:3,marginVertical:4, borderColor: '#ADD8E6'}}></View>
          <View style={{justifyContent:'center', alignItems: 'center',flexDirection:'row'}}>
            <Text style={{fontSize:18, fontWeight:'bold'}}>Kategoriler : </Text>
            <Text style={{fontSize:18, fontWeight:'bold',maxWidth:'90%'}}>{book.pdf_kategoriler}</Text>
          </View>
          <View style={{borderBottomWidth:3,marginVertical:4, borderColor: '#ADD8E6'}}></View>
          <View style={{justifyContent:'center', alignItems: 'center',flexDirection:'row'}}>
            <Text style={{fontSize:18, fontWeight:'bold'}}>Yazar : </Text>
            <Text style={{fontSize:18, fontWeight:'bold',maxWidth:'90%'}}>{book.pdf_yazar}</Text>
          </View>
        </View>

        <View style={{backgroundColor:'white', padding:5, borderRadius:15, paddingHorizontal:25,paddingVertical:10,marginTop:20}}>
          <View style={{justifyContent:'center', alignItems: 'center',flexDirection:'row'}}>
            <Text style={{fontSize:18, fontWeight:'bold'}}>Kitap Id : </Text>
            <Text style={{fontSize:18, fontWeight:'bold',maxWidth:'95%'}}>{book.book_id}</Text>
          </View>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.text,{lineHeight: 22}]}>{book.pdf_desc}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleRead(book.book_id, book.pdf_url, 1,  book.pdf_book_name)}>
            <Text style={styles.buttonText}>{"Okumaya Başla"}</Text>
          </TouchableOpacity>
        </View>
      </View>}
      {!loading && book && showcomments && comments &&
      <>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Yorumlar</Text>
      </View>
      <View>
      {comments.length > 0 ? (
          comments
          .sort((a, b) => parseInt(b.commentId) - parseInt(a.commentId))
          .map((comment) => {
              const numberOfReports = Object.keys(comment.reporters).length;
              if (numberOfReports > 20) {
                  return null; // Rapor sayısı 20'den fazla ise bileşeni oluşturma
              }
              return (
                  <CommentCards
                  key={comment.id}
                  bookid={book.book_id}
                  usermail={comment.useremail}
                  useremailanonymous={comment.useremailanonymous}
                  usercomment={comment.comment}
                  date={comment.timestamp}
                  likes={Object.keys(comment.likes).length}
                  dislikes={Object.keys(comment.dislikes).length}
                  reporters={numberOfReports}
                  commentId={comment.commentId}
                  handleGetComment={handleGetComment}
                  user={auth.currentUser}
                  anonymous={true}
                  />
              );
          })
      ) : (
          <Text>Yorum bulunamadı.</Text>
      )}
      </View>
      </>
      }
      <View style={{marginBottom:50}}></View>
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
  label: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  labelContainer: {
    alignItems:'center', 
    backgroundColor:'#0A6847', 
    width:'100%', 
    marginVertical:20, 
    height:50, 
    justifyContent:'center',
    marginBottom:20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textlabel:{
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
    marginBottom:20,
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
  textContainer: {
    width: '85%',
    marginTop: 20,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 8,
    marginHorizontal:5,
  },
});