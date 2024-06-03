import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminSuggestionAndComplaint = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [confirmedFeedbackList, setConfirmedFeedbackList] = useState([]);
  const [showConfirmedFeedback, setShowConfirmedFeedback] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const feedbackRef = collection(db, 'feedback');
      const q = query(feedbackRef, orderBy('timestamp', 'asc')); // Ascending sıralama
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedFeedback = [];
        querySnapshot.forEach((doc) => {
          fetchedFeedback.push({ id: doc.id, ...doc.data() });
        });
        setFeedbackList(fetchedFeedback);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const fetchConfirmedFeedback = async () => {
    try {
      const confirmedFeedbackRef = collection(db, 'confirmed_Feedback');
      const q = query(confirmedFeedbackRef, orderBy('timestamp', 'desc')); // Descending sıralama
      const querySnapshot = await getDocs(q);
      const fetchedConfirmedFeedback = [];
      querySnapshot.forEach((doc) => {
        fetchedConfirmedFeedback.push({ id: doc.id, ...doc.data() });
      });
      setConfirmedFeedbackList(fetchedConfirmedFeedback);
    } catch (error) {
      console.error('Error fetching confirmed feedback:', error);
    }
  };

  const confirmFeedback = async (id) => {
    try {
      const confirmedFeedbackRef = collection(db, 'confirmed_Feedback');
      const feedbackToConfirm = feedbackList.find((item) => item.id === id);
      await addDoc(confirmedFeedbackRef, { ...feedbackToConfirm });
      // Feedback'i onayla ve orijinal listeden kaldır
      await deleteFeedback(id);
      console.log('Feedback confirmed and moved to ConfirmedFeedback collection!');
    } catch (error) {
      console.error('Error confirming feedback:', error);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      const feedbackRef = doc(db, 'feedback', id);
      await deleteDoc(feedbackRef);
      console.log('Feedback deleted successfully!');
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const renderFeedbackItem = (item) => {
    const timestamp = item.timestamp.toDate().toString();
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          Alert.alert(
            'Yapılacak İşlemi Seçin',
            '',
            [
              { text: 'Vazgeç', style: 'cancel' },
              { text: 'Onayla', onPress: () => confirmFeedback(item.id) },
              { text: 'Sil', onPress: () => deleteFeedback(item.id), style: 'destructive' },
            ],
            { cancelable: true }
          )
        }
      >
        <View style={styles.feedbackContainer}>
          <Text>{item.text}</Text>
          <Text>User ID: {item.userid}</Text>
          <Text>Tarih: {timestamp}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderConfirmedFeedbackItem = (item) => {
    const timestamp = item.timestamp.toDate().toString();
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          Alert.alert(
            'Onaylanmış Geri Bildirimi Sil',
            'Bu geri bildirimi silmek istediğinizden emin misiniz?',
            [
              { text: 'İptal', style: 'cancel' },
              { text: 'Sil', onPress: () => deleteFeedback(item.id), style: 'destructive' },
            ],
            { cancelable: true }
          )
        }
      >
        <View style={styles.feedbackContainer}>
          <Text>{item.text}</Text>
          <Text>User ID: {item.userid}</Text>
          <Text>Tarih: {timestamp}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const refreshData = () => {
    fetchFeedback();
    fetchConfirmedFeedback();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={refreshData}>
        <Text style={styles.refreshButton}>Yenile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          fetchConfirmedFeedback();
          setShowConfirmedFeedback(true);
        }}
      >
        <Text style={styles.confirmedFeedbackButton}>Onaylanmış Geri Bildirimler</Text>
      </TouchableOpacity>
      <View>
        {feedbackList.map((item) => renderFeedbackItem(item))}
      </View>
      {showConfirmedFeedback && (
        <View style={styles.confirmedFeedbackPanel}>
          <Text style={styles.confirmedFeedbackTitle}>Onaylanmış Geri Bildirimler</Text>
          <View>
            {confirmedFeedbackList.map((item) => renderConfirmedFeedbackItem(item))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop:20,
    alignItems:'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  feedbackContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  confirmedFeedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confirmedFeedbackButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  confirmedFeedbackPanel: {
    marginTop: 20,
  },
  refreshButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default AdminSuggestionAndComplaint;
