import React, { useEffect, useState } from "react";
import { db } from '../../firebase';
import { collection, getDocs } from "firebase/firestore";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const Explore = ({ navigation }) => {
    const [books, setBooks] = useState([]);

    const getBooks = async () => {
        try {
            const userBooksRef = collection(db, `books`);
            const userBooksSnapshot = await getDocs(userBooksRef);
            const fetchedBooks = userBooksSnapshot.docs
                .filter(doc => doc.data().pdf_visibility === true)
                .map(doc => doc.data());

            // Rastgele sıralama
            const shuffledBooks = fetchedBooks.sort(() => 0.5 - Math.random());
            // İlk 10 kitabı al
            const randomBooks = shuffledBooks.slice(0, 10);

            setBooks(randomBooks);
        } catch (error) {
            console.error("Error getting user books:", error);
        }
    };

    useEffect(() => {
        getBooks();
    }, [])
    
    const handleRead = (book_id) => {
        navigation.navigate('AnonymousBookScreen', { book_id: book_id, showcomments: true });
    }

    const handleRefresh = () => {
        getBooks();
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <Text style={styles.label}>Kitapları Keşfet</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                        <Text style={styles.refreshButtonText}>Kitapları Yenile</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    {books.map((book, index) => (
                        <TouchableOpacity onPress={() => handleRead(book.book_id)} key={index} style={styles.bookContainer}>
                            <Image source={{ uri: book.pdf_resim_url }} resizeMode="cover" style={styles.bookImage} />
                            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{book.pdf_book_name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: "#ADD8E6"
    },
    wrapper: {
        marginTop: 25,
        marginBottom: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 22,
        fontWeight: "bold",
        color: "black",
    },
    refreshButton: {
        backgroundColor: '#4682B4',
        paddingVertical: 8,
        borderRadius: 15,
        width: Dimensions.get('window').width*0.7,
        marginLeft: Dimensions.get('window').width*0.165,
        marginBottom:20,
        alignItems:'center',
    },
    refreshButtonText: {
        color: 'white',
        fontSize: 24,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        marginBottom: 20,
    },
    bookContainer: {
        height: 300,
        width: Dimensions.get('window').width * 0.48 - 2, // Kartlar arasındaki boşlukları hesaba katıyoruz
        marginBottom: 50,
        alignItems: 'center',
    },
    bookImage: {
        height: '100%',
        width: '100%',
        borderRadius: 15,
    },
});

export default Explore;
