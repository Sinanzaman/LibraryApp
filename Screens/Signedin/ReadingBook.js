import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { useFocusEffect } from '@react-navigation/native';
import { saveBookLastPage, saveLastPage, saveLastReadBook, saveTotalPage } from '../../firebase';

export default function ReadingBook({ route, navigation }) {
  const [loading, setLoading] = useState(true);
  const [pdfurl, setPdfurl] = useState(null);
  const [isThere, setIsThere] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [bookid, setBookid] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPdfData = async () => {
        try {
          const { bookid, pdf_url, pdf_LastPage, isThere, headerTitle } = route.params;
          setBookid(bookid); // bookid'yi state'e ata
          setLastPage(pdf_LastPage);
          setPdfurl(pdf_url);
          setIsThere(isThere);
          navigation.setOptions({
            title: headerTitle,
          });
          if (isThere) {
            saveLastReadBook(bookid);
            saveLastPage(pdf_LastPage);
          }
          if (pdf_url && pdf_LastPage) {
            setLoading(false);
          }

        } catch (error) {
          console.error('Hata oluştu:', error);
        }
      };
      fetchPdfData();
    }, [route.params]) // route.params'ı bağımlılık olarak ekle
  );

  return (
    <View style={styles.container}>
      {!loading && pdfurl &&
      <Pdf
        trustAllCerts={false}
        source={{ uri: pdfurl, cache: true }}
        onLoadComplete={(numberOfPages, filePath) => {
          saveTotalPage(numberOfPages);
        }}
        onPageChanged={(currentPage, numberOfPages) => {
          console.log(currentPage);
          if (isThere) {
            saveLastPage(currentPage);
            saveBookLastPage(bookid, currentPage);
          }
        }}
        page={lastPage ? lastPage : 1}
        style={styles.pdf}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});