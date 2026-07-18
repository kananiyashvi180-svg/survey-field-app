import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
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
      Alert.alert('✅ Sync Complete', 'All local field survey reports have been synced with the central server.');
    }, 2000);
  };

  const handleClearCache = () => {
    Alert.alert(
      '⚠️ Clear Cache',
      'This will delete cached map data and drafts. Are you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully.');
          },
        },
      ]
    );
  };

  const SettingRow = ({ label, description, value, onToggle }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#2a2d3a', true: '#f97316' }}
        thumbColor={value ? '#ffffff' : '#9ca3af'}
        ios_backgroundColor="#2a2d3a"
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Settings</Text>
        <Text style={styles.headerSub}>Customize field survey application options</Text>
      </View>

      {/* Preferences Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingRow
          label="Dark Mode"
          description="Use high contrast dark theme"
          value={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
        />
        <SettingRow
          label="Push Notifications"
          description="Receive alerts for assigned surveys"
          value={settings.notifications}
          onToggle={() => toggleSetting('notifications')}
        />
      </View>

      {/* Location/GPS Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location & GPS Settings</Text>
        <SettingRow
          label="High Accuracy GPS"
          description="Enable high precision location tracking (uses more battery)"
          value={settings.gpsHighAccuracy}
          onToggle={() => toggleSetting('gpsHighAccuracy')}
        />
        <SettingRow
          label="Offline Mode & Sync"
          description="Save surveys locally when connection is lost"
          value={settings.offlineSync}
          onToggle={() => toggleSetting('offlineSync')}
        />
      </View>

      {/* Auto Save Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Drafts & Files</Text>
        <SettingRow
          label="Auto-Save Drafts"
          description="Periodically save survey progress"
          value={settings.autoSaveDraft}
          onToggle={() => toggleSetting('autoSaveDraft')}
        />
      </View>

      {/* Utility Actions */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>System Actions</Text>
        
        {/* Sync Button */}
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && styles.actionBtnPressed,
            syncing && styles.actionBtnDisabled,
          ]}
          onPress={handleSync}
          disabled={syncing}
        >
          {syncing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.actionBtnText}>🔄  Sync Data Now</Text>
          )}
        </Pressable>

        {/* Clear Cache Button */}
        <Pressable
          style={({ pressed }) => [styles.dangerBtn, pressed && styles.dangerBtnPressed]}
          onPress={handleClearCache}
        >
          <Text style={styles.dangerBtnText}>🗑️  Clear Local Cache</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f97316',
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 13,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2d3a',
    paddingBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0f1117',
  },
  settingText: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  actionBtn: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 48,
  },
  actionBtnPressed: {
    opacity: 0.85,
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  dangerBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    minHeight: 48,
  },
  dangerBtnPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  dangerBtnText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 15,
  },
});
