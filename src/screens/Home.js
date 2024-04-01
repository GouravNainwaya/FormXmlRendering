import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Navigation from '../Navigation/Navigation'

const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Button title="Render Form from XML File" onPress={() => navigation.navigate("Form", {fromFirstBtn: true})} />
      <Button
        title="Render Form from XML Input"
        onPress={() => navigation.navigate("Form", {fromFirstBtn: true})}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
      padding: 20,
    },
    formContainer: {
      marginTop: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
    },
    formTitle: {
      fontWeight: 'bold',
      marginBottom: 10,
    },
    loader: {
      marginTop: 20,
    },
  });