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
            Alert.alert('Success', 'Cache cleared successfully.');
          },
        },
      ]
    );
  };

  const settingRows = [
    { key: 'darkMode', label: 'Dark Mode', desc: 'Use dark background theme' },
    { key: 'notifications', label: 'Push Notifications', desc: 'Receive alerts for surveys' },
    { key: 'gpsHighAccuracy', label: 'High Accuracy GPS', desc: 'Enable precise location tracking' },
    { key: 'offlineSync', label: 'Offline Mode', desc: 'Save surveys locally when offline' },
    { key: 'autoSaveDraft', label: 'Auto Save Draft', desc: 'Automatically save form drafts' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.text}>Customize your application preferences.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {settingRows.map((row) => (
          <View key={row.key} style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{row.label}</Text>
              <Text style={styles.settingDesc}>{row.desc}</Text>
            </View>
            <Pressable
              style={settings[row.key] ? styles.toggleOn : styles.toggleOff}
              onPress={() => toggleSetting(row.key)}
            >
              <Text style={styles.toggleText}>{settings[row.key] ? 'ON' : 'OFF'}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>System Actions</Text>
        <Pressable style={styles.btn} onPress={handleSync} disabled={syncing}>
          {syncing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.btnText}>Sync Data Now</Text>
          )}
        </Pressable>
        <Pressable style={styles.btnSecondary} onPress={handleClearCache}>
          <Text style={styles.btnText}>Clear Local Cache</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0d12',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    color: '#9ca3af',
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0b0d12',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  settingDesc: {
    color: '#9ca3af',
    fontSize: 12,
  },
  toggleOn: {
    backgroundColor: '#f97316',
    padding: 10,
    borderRadius: 8,
    width: 65,
    alignItems: 'center',
  },
  toggleOff: {
    backgroundColor: '#374151',
    padding: 10,
    borderRadius: 8,
    width: 65,
    alignItems: 'center',
  },
  toggleText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 14,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: '#374151',
    padding: 14,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
