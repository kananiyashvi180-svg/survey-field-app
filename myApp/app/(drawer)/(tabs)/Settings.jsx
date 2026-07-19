import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    gpsHighAccuracy: true,
    offlineSync: false,
    autoSaveDraft: true,
  });
  const [syncing, setSyncing] = useState(false);

  const toggleSetting = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      Alert.alert('✅ Sync Complete', 'All reports synced successfully.');
    }, 2000);
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'This will delete cached maps and drafts. Proceed?', [
      { text: 'Cancel' },
      { text: 'Clear', onPress: () => Alert.alert('✅ Cleared', 'Cache cleared successfully.') },
    ]);
  };

  const settingRows = [
    { key: 'darkMode', label: 'Dark Mode', desc: 'Use high contrast dark theme', icon: '🌙' },
    { key: 'notifications', label: 'Push Notifications', desc: 'Receive alerts for surveys', icon: '🔔' },
    { key: 'gpsHighAccuracy', label: 'High Accuracy GPS', desc: 'Enable precise location tracking', icon: '📍' },
    { key: 'offlineSync', label: 'Offline Mode', desc: 'Save surveys locally when offline', icon: '📡' },
    { key: 'autoSaveDraft', label: 'Auto Save Draft', desc: 'Automatically save form drafts', icon: '💾' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageIcon}>⚙️</Text>
        <View>
          <Text style={styles.pageTitle}>Settings</Text>
          <Text style={styles.pageSubtitle}>Customize your app preferences</Text>
        </View>
      </View>

      {/* Preferences Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>🎛️ Preferences</Text>
        {settingRows.map((row, idx) => (
          <View key={row.key} style={[styles.settingRow, idx < settingRows.length - 1 && styles.settingRowBorder]}>
            <View style={styles.settingIconBox}>
              <Text style={styles.settingRowIcon}>{row.icon}</Text>
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{row.label}</Text>
              <Text style={styles.settingDesc}>{row.desc}</Text>
            </View>
            <Pressable
              style={settings[row.key] ? styles.toggleOn : styles.toggleOff}
              onPress={() => toggleSetting(row.key)}
            >
              <Text style={settings[row.key] ? styles.toggleTextOn : styles.toggleTextOff}>
                {settings[row.key] ? 'ON' : 'OFF'}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* System Actions Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>🛠️ System Actions</Text>
        <Pressable style={styles.actionRow} onPress={handleSync} disabled={syncing}>
          <View style={[styles.settingIconBox, { backgroundColor: '#0ea5e922' }]}>
            <Text style={styles.settingRowIcon}>🔄</Text>
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Sync Data Now</Text>
            <Text style={styles.settingDesc}>Upload all pending survey data</Text>
          </View>
          {syncing
            ? <ActivityIndicator size="small" color="#0ea5e9" />
            : <Text style={styles.actionArrow}>›</Text>
          }
        </Pressable>

        <View style={styles.settingRowBorder} />

        <Pressable style={styles.actionRow} onPress={handleClearCache}>
          <View style={[styles.settingIconBox, { backgroundColor: '#ef444422' }]}>
            <Text style={styles.settingRowIcon}>🗑️</Text>
          </View>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: '#ef4444' }]}>Clear Local Cache</Text>
            <Text style={styles.settingDesc}>Delete cached maps and drafts</Text>
          </View>
          <Text style={[styles.actionArrow, { color: '#ef4444' }]}>›</Text>
        </Pressable>
      </View>

      {/* About Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>ℹ️ About</Text>
        {[
          ['App Name', 'Smart Field Survey'],
          ['Version', '1.0.0'],
          ['Assignment', 'Mini Project'],
          ['Platform', 'React Native (Expo)'],
        ].map(([label, value]) => (
          <View key={label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0d12', paddingHorizontal: 16, paddingTop: 16 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  pageIcon: { fontSize: 28, marginRight: 12 },
  pageTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  pageSubtitle: { color: '#9ca3af', fontSize: 13, marginTop: 2 },
  card: { backgroundColor: '#151821', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardLabel: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold', marginBottom: 14 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: '#0b0d12' },
  settingIconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#0b0d12', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingRowIcon: { fontSize: 16 },
  settingInfo: { flex: 1, marginRight: 12 },
  settingLabel: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  settingDesc: { color: '#9ca3af', fontSize: 12 },
  toggleOn: { backgroundColor: '#1cbdddff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, minWidth: 52, alignItems: 'center' },
  toggleOff: { backgroundColor: '#0b0d12', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, minWidth: 52, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  toggleTextOn: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  toggleTextOff: { color: '#9ca3af', fontSize: 12, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  actionArrow: { color: '#9ca3af', fontSize: 22, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#0b0d12' },
  infoLabel: { color: '#9ca3af', fontSize: 13 },
  infoValue: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
});
