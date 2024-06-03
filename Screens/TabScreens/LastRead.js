import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { auth, db } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';

export default function LastRead({ navigation }) {

  const [book_id, setBook_id] = useState('');
  const [pdf_book_name, setPdf_book_name] = useState('');
  const [pdf_desc, setPdf_desc] = useState('');
  const [pdf_kategoriler, setPdf_kategoriler] = useState('');
  const [pdf_resim_url, setPdf_resim_url] = useState('');
  const [pdf_url, setPdf_url] = useState('');
  const [pdf_yayinevi, setPdf_yayinevi] = useState('');
  const [pdf_yazar, setPdf_yazar] = useState('');
  const [pdf_LastPage, setPdf_LastPage] = useState('');
  const [pdf_numberOfPages, setPdf_numberOfPages] = useState('');
  const [loading, setLoading] = useState(true);
  const [isThere, setIsThere] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getLastReadBookField = async () => {
        try {
          const user = auth.currentUser;

          if (user) {
            const doc = await db.collection(`users`).doc(user.uid).collection('users_books').doc('LastReadBook').get();

            if (doc.exists) {
              const data = doc.data();
              const usershave = await db.collection(`users`).doc(user.uid).collection('users_books').doc(`${data.bookid}`).get();
              const usershavedata = usershave.data();

              if (usershavedata && usershavedata.book_id === data.bookid) {
                const books = await db.collection(`books`).doc(data.bookid).get();

                if (books.exists) {
                  const booksdata = books.data();
                  setIsThere(true);
                  setBook_id(booksdata.book_id);
                  setPdf_book_name(booksdata.pdf_book_name);
                  setPdf_desc(booksdata.pdf_desc);
                  setPdf_kategoriler(booksdata.pdf_kategoriler);
                  setPdf_resim_url(booksdata.pdf_resim_url);
                  setPdf_url(booksdata.pdf_url);
                  setPdf_yayinevi(booksdata.pdf_yayinevi);
                  setPdf_yazar(booksdata.pdf_yazar);
                  setPdf_LastPage(data.pdf_LastPage);
                  setPdf_numberOfPages(data.pdf_numberOfPages);
                  setLoading(false);
                }
              } else {
                setIsThere(false);
                setLoading(false);
                console.log("Son okunan kitap kullanıcının kitapları arasında bulunmuyor.");
              }
            } else {
              setIsThere(false);
              setLoading(false);
              console.log("Son okunan kitap bulunamadı.");
              return null;
            }
          } else {
            console.error('Kullanıcı oturumu açmamış.');
            return null;
          }
        } catch (error) {
          console.error('Son okunan kitap alanı alınırken bir hata oluştu: ', error);
          setLoading(false);
          return null;
        }
      }
      getLastReadBookField();
    }, [])
  );

  const handleRead = (bookid, pdf_url, pdf_LastPage, isThere, bookname) => {
    navigation.navigate('ReadingBook', { bookid: bookid, pdf_url: pdf_url, pdf_LastPage: pdf_LastPage, isThere: isThere, headerTitle: bookname });
  }

  const completionPercentage = (pdf_LastPage / pdf_numberOfPages) * 100;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {isThere ? (
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                {pdf_resim_url && <Image source={{ uri: pdf_resim_url }} resizeMode="cover" style={styles.image}></Image>}
              </View>
              <View style={styles.textlabel}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 20, textAlign: 'center', marginBottom: 10 }}>{pdf_book_name}</Text>
              </View>
              <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 15, paddingHorizontal: 25, paddingVertical: 10 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Yayınevi : </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', maxWidth: '90%' }}>{pdf_yayinevi}</Text>
                </View>
                <View style={{ borderBottomWidth: 3, marginVertical: 4, borderColor: '#ADD8E6' }}></View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Kategoriler : </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', maxWidth: '90%' }}>{pdf_kategoriler}</Text>
                </View>
                <View style={{ borderBottomWidth: 3, marginVertical: 4, borderColor: '#ADD8E6' }}></View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Yazar : </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', maxWidth: '90%' }}>{pdf_yazar}</Text>
                </View>
              </View>
              <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 15, paddingHorizontal: 25, paddingVertical: 10, marginTop: 20 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Kitap Id : </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', maxWidth: '95%' }}>{book_id}</Text>
                </View>
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.text, { lineHeight: 22 }]}>{pdf_desc}</Text>
              </View>
              <View style={styles.completionContainer}>
                {completionPercentage === 100 ? (
                  <Text style={{ fontSize: 19, fontWeight: 'bold', marginTop: 10 }}>Tebrikler Kitabı Bitirdiniz!</Text>
                ) : (
                  <>
                    <Text style={{ fontSize: 19, fontWeight: 'bold', marginTop: 10 }}>{`${parseInt(pdf_numberOfPages) - parseInt(pdf_LastPage)} Sayfa Kaldı`}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: '80%' }}>
                      <View style={{ flex: 1, height: 10, backgroundColor: '#E0E0E0', borderRadius: 5 }}>
                        <View style={{ width: `${completionPercentage}%`, height: 10, backgroundColor: '#2196F3', borderRadius: 5 }} />
                      </View>
                    </View>
                    <Text style={{ fontSize: 19, fontWeight: 'bold', marginBottom: 10 }}>{`% ${completionPercentage.toFixed(2)}`}</Text>
                  </>
                )}
              </View>
              {(book_id && pdf_url && pdf_LastPage && isThere) ? <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleRead(book_id, pdf_url, pdf_LastPage, isThere, pdf_book_name)}>
                  <Text style={styles.buttonText}>{pdf_LastPage > 1 ? "Okumaya Devam Et" : "Okumaya Başla"}</Text>
                </TouchableOpacity>
              </View> : <>
                <TouchableOpacity style={styles.button} activeOpacity={1}>
                  <Text style={styles.buttonText}>{"Kitaplığınızda Mevcut Değil"}</Text>
                </TouchableOpacity>
              </>}
            </View>
          ) : (
            <View style={styles.noBookContainer}>
              <View style={{ alignItems: 'center' }}>
                <Image source={require('../../assets/Images/nobook.png')} resizeMode="cover" style={{ height: 180, width: 300 }}></Image>
              </View>
              <Text style={{ fontSize: 25, marginTop: 25, fontWeight: 'bold' }}>Son Okunanlarda Kitap Yok !!</Text>
            </View>
          )}
        </>
      )}
      <View style={{ marginBottom: 50 }}></View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBookContainer: {
    alignItems: 'center',
    marginTop: 50,
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
  textContainer: {
    width: '85%',
    marginTop: 20,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  },
  completionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
  },
});
