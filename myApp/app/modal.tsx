import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is a modal</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.text}>Go to home screen</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0f1117',
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  text: {
    color: '#f97316',
    fontSize: 16,
  },
  link: {
    padding: 15,
    margin: 10,
  },
});
