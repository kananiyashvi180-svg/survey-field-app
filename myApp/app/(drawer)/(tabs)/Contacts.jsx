import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, TextInput,
  Pressable, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

function avatarColor(name) {
  if (!name) return '#f97316';
  const colors = ['#0ea5e9', '#f97316', '#a855f7', '#22c55e', '#ef4444'];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return colors[sum % colors.length];
}

export default function ContactsScreen() {
  const [permission, setPermission] = useState(null);
  const [allContacts, setAllContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await Contacts.getPermissionsAsync();
        setPermission(result);
        if (result.granted) loadContacts();
      } catch (_err) { setPermission({ granted: false }); }
    };
    if (typeof document !== 'undefined') {
      setPermission({ granted: false, webPlatform: true });
    } else {
      checkPermission();
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Contacts.requestPermissionsAsync();
      setPermission(result);
      if (result.granted) loadContacts();
      else Alert.alert('Permission Denied', 'Contacts access is required.');
    } catch (_err) { Alert.alert('Error', 'Failed to request permission.'); }
  };

  const loadContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers] });
      const sorted = data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setAllContacts(sorted);
      setFiltered(sorted);
      setQuery('');
    } catch (_err) { Alert.alert('Error', 'Failed to load contacts.'); }
  };

  const handleSearch = (text) => {
    setQuery(text);
    const q = text.toLowerCase().trim();
    if (!q) { setFiltered(allContacts); return; }
    setFiltered(allContacts.filter(c => {
      const matchName = c.name && c.name.toLowerCase().includes(q);
      const matchNum = c.phoneNumbers && c.phoneNumbers.some(p => p.number && p.number.includes(q));
      return matchName || matchNum;
    }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };

  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  if (typeof document !== 'undefined') {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permIcon}>👥</Text>
        <Text style={styles.permTitle}>Contacts Unavailable</Text>
        <Text style={styles.permSubtitle}>
          Contacts access is not available in the web browser.{'\n'}
          Run this app on a real device to sync contacts.
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permIcon}>👥</Text>
        <Text style={styles.permTitle}>Contacts Access Required</Text>
        <Text style={styles.permSubtitle}>Allow access to load and sync your contacts.</Text>
        <Pressable style={styles.btnPrimary} onPress={requestPermission}>
          <Text style={styles.btnPrimaryText}>Grant Contacts Access</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageIcon}>👥</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Contacts</Text>
          <Text style={styles.pageSubtitle}>{allContacts.length} contacts synced</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchCard}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearch}
          placeholder="Search by name or number..."
          placeholderTextColor="#4b5563"
        />
      </View>

      {/* Contact List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id || item.name}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No contacts found</Text>
            <Text style={styles.emptyText}>Pull down to refresh your contacts list.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const name = item.name || 'Unknown';
          const number = item.phoneNumbers && item.phoneNumbers[0] ? item.phoneNumbers[0].number : null;

          const handleCopy = async () => {
            if (!number) { Alert.alert('No Number', 'This contact has no phone number.'); return; }
            await Clipboard.setStringAsync(number);
            Alert.alert('✅ Copied', number + ' copied to clipboard.');
          };

          return (
            <View style={styles.contactCard}>
              <View style={[styles.avatar, { backgroundColor: avatarColor(name) + '33' }]}>
                <Text style={[styles.avatarText, { color: avatarColor(name) }]}>{getInitials(name)}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{name}</Text>
                <Text style={styles.contactNumber}>{number || 'No Number'}</Text>
              </View>
              <Pressable style={styles.copyBtn} onPress={handleCopy}>
                <Text style={styles.copyBtnText}>Copy</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0d12', paddingHorizontal: 16, paddingTop: 16 },
  centeredContainer: { flex: 1, backgroundColor: '#0b0d12', justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { color: '#9ca3af', fontSize: 14, marginTop: 12 },
  permIcon: { fontSize: 48, marginBottom: 12 },
  permTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  permSubtitle: { color: '#9ca3af', fontSize: 14, marginBottom: 20, textAlign: 'center', lineHeight: 22 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  pageIcon: { fontSize: 28, marginRight: 12 },
  pageTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  pageSubtitle: { color: '#9ca3af', fontSize: 13, marginTop: 2 },
  searchCard: { backgroundColor: '#151821', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, backgroundColor: '#0b0d12', color: '#ffffff', padding: 10, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#1e293b' },
  contactCard: { backgroundColor: '#151821', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 15, fontWeight: 'bold' },
  contactInfo: { flex: 1 },
  contactName: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  contactNumber: { color: '#9ca3af', fontSize: 13 },
  copyBtn: { backgroundColor: '#0ea5e922', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 8 },
  copyBtnText: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold' },
  emptyCard: { backgroundColor: '#151821', borderRadius: 12, padding: 32, alignItems: 'center', marginTop: 12 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  emptyText: { color: '#9ca3af', fontSize: 13, textAlign: 'center' },
  btnPrimary: { backgroundColor: '#f97316', padding: 14, borderRadius: 10, alignItems: 'center', width: 220, marginTop: 8 },
  btnPrimaryText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});
