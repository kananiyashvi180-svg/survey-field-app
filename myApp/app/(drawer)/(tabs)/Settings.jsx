import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    gpsHighAccuracy: true,
    offlineSync: false,
    autoSaveDraft: true,
  });

  const [syncing, setSyncing] = useState(false);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      Alert.alert('Sync Complete', 'Reports synced successfully.');
    }, 2000);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will delete cached maps and drafts. Proceed?',
      [
        { text: 'Cancel' },
        {
          text: 'Clear',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.text}>Customize your application settings</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.text}>Dark Mode</Text>
            <Text style={styles.text}>Use high contrast theme</Text>
          </View>
          <Pressable style={styles.toggleBtn} onPress={() => toggleSetting('darkMode')}>
            <Text style={styles.btnText}>{settings.darkMode ? 'ON' : 'OFF'}</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.text}>Push Notifications</Text>
            <Text style={styles.text}>Receive alerts for assigned surveys</Text>
          </View>
          <Pressable style={styles.toggleBtn} onPress={() => toggleSetting('notifications')}>
            <Text style={styles.btnText}>{settings.notifications ? 'ON' : 'OFF'}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location & GPS Settings</Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.text}>High Accuracy GPS</Text>
            <Text style={styles.text}>Enable high precision location tracking</Text>
          </View>
          <Pressable style={styles.toggleBtn} onPress={() => toggleSetting('gpsHighAccuracy')}>
            <Text style={styles.btnText}>{settings.gpsHighAccuracy ? 'ON' : 'OFF'}</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.text}>Offline Mode & Sync</Text>
            <Text style={styles.text}>Save surveys locally when offline</Text>
          </View>
          <Pressable style={styles.toggleBtn} onPress={() => toggleSetting('offlineSync')}>
            <Text style={styles.btnText}>{settings.offlineSync ? 'ON' : 'OFF'}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>System Actions</Text>
        <Pressable style={styles.btn} onPress={handleSync} disabled={syncing}>
          {syncing ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.btnText}>Sync Data Now</Text>
          )}
        </Pressable>

        <Pressable style={styles.btn} onPress={handleClearCache}>
          <Text style={styles.btnText}>Clear Local Cache</Text>
        </Pressable>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    padding: 10,
  },
  toggleBtn: {
    backgroundColor: '#f97316',
    padding: 10,
    borderRadius: 8,
    width: 60,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 12,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
