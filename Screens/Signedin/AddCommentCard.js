import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { auth, saveUserComment } from '../../firebase';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function AddCommentCard({bookid, handleGetComment}) {
  const [userEmail, setUserEmail] = useState(null);
  const [userComment, setUserComment] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email);
      }
    };
    fetchUser();
  }, []);
  
  const handleSaveComment = async (anonymousComment) => {
    try {
      await saveUserComment(bookid, userComment, anonymousComment);
      setUserComment("");
      handleGetComment();
    } catch (error) {
      console.error('Yorum kaydedilemedi: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row'}}>
        <View>
          <Image style={styles.profilePicture} source={require('../../assets/Images/userphoto.jpg')} />
        </View>
        <View style={styles.rightContainer}>
          <View style={{marginBottom:6}}>
            <Text style={styles.userMail}>{userEmail || 'Loading...'}</Text>
          </View>
          <View style={{maxWidth:'90%', justifyContent: 'center'}}>
            <TextInput
              style={styles.input}
              placeholder="Yorum Giriniz..."
              onChangeText={text => setUserComment(text)}
              value={userComment}
              multiline={true}
              numberOfLines={3}
              maxLength={600}
            />
          </View>
        </View>
      </View>
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:40, marginTop:10}}>
      {userComment && <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={() => handleSaveComment(true)} >
          <Entypo name="share-alternative" size={18} style={{marginTop:10}}/>
          <Text style={{marginTop:10, marginLeft:3, fontSize:14, fontWeight:'bold'}}>Anonim Yayınla</Text>
        </TouchableOpacity>}
      {userComment && <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={() => handleSaveComment(false)} >
          <Entypo name="share-alternative" size={18} style={{marginTop:10}}/>
          <Text style={{marginTop:10, marginLeft:3, fontSize:14, fontWeight:'bold'}}>Normal Yayınla</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    width: screenWidth * 0.90,
    padding: 6,
    marginBottom: 10,
    borderRadius: 15,
  },
  leftContainer: {
  },
  userMail: {
    fontWeight: 'bold',
  },
  rightContainer: {
  },
  profilePicture: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ddd', // Gri arka plan rengi
    marginRight: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    width: screenWidth*0.65,
    textAlignVertical: 'top', // Ensure text is aligned at the top for multiline
  },
});
