import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function TermsAndPrivacyPolicy() {
  return (
    <View style={styles.container}>
      <Text>TermsAndPrivacyPolicy</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})