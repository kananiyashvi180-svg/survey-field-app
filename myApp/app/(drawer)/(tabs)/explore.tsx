import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.text}>This app includes example code to help you get started.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>File-based routing</Text>
        <Text style={styles.text}>This app has screens inside the tabs directory.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Android, iOS, and web support</Text>
        <Text style={styles.text}>You can open this project on Android, iOS, and the web.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    padding: 10,
  },
  card: {
    backgroundColor: '#1c1f2b',
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  title: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    margin: 5,
  },
});
