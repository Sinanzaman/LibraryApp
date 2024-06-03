import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions} from 'react-native'
import React, { useEffect, useState } from 'react'

export default function FavoriteCards({pdf_resim_url, navigation, book_id, showcomments, anonymous}) {

  const handleBookScreen = () => {
    navigation.navigate('BookScreen', {book_id: book_id, showcomments: showcomments || false, anonymous: false});
  }

  const handleAnonymousBookScreen = () => {
    navigation.navigate('AnonymousBookScreen', {book_id: book_id, showcomments: showcomments || false });
  }

  return (
    <View style={styles.container}>
      { anonymous ?
      <TouchableOpacity style={styles.Touchableopacity} onPress={handleAnonymousBookScreen}>
        <View style={styles.view}>
          <Image source={{uri : pdf_resim_url}} resizeMode="cover" style={styles.image}></Image>
        </View>
      </TouchableOpacity>
      :
      <TouchableOpacity style={styles.Touchableopacity} onPress={handleBookScreen}>
        <View style={styles.view}>
          <Image source={{uri : pdf_resim_url}} resizeMode="cover" style={styles.image}></Image>
        </View>
      </TouchableOpacity>}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
  image:{
    height: '100%',
    width: '100%',
    borderRadius:15,
  },
  Touchableopacity:{
    justifyContent:'center',
    alignItems:'flex-start',
  },
  view:{
    height: 300,
    width: Dimensions.get('window').width*0.46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  }
})
