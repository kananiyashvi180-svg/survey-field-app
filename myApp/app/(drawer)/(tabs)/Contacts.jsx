import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

function avatarColor(name) {
  if (!name) return '#f97316';
  const colors = ['#f97316', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
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
        if (result.granted) {
          loadContacts();
        }
      } catch (_err) {
        setPermission({ granted: false });
      }
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
      if (result.granted) {
        loadContacts();
      } else {
        Alert.alert('Permission Denied', 'Contacts access is required to display contacts.');
      }
    } catch (_err) {
      Alert.alert('Error', 'Failed to request permission.');
    }
  };

  const loadContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });
      const sorted = data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setAllContacts(sorted);
      setFiltered(sorted);
      setQuery('');
    } catch (_err) {
      Alert.alert('Error', 'Failed to load contacts.');
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
    const q = text.toLowerCase().trim();
    if (!q) {
      setFiltered(allContacts);
      return;
    }
    const temp = [];
    for (let i = 0; i < allContacts.length; i++) {
      const c = allContacts[i];
      const matchName = c.name && c.name.toLowerCase().includes(q);
      let matchNumber = false;
      if (c.phoneNumbers) {
        for (let j = 0; j < c.phoneNumbers.length; j++) {
          if (c.phoneNumbers[j].number && c.phoneNumbers[j].number.includes(q)) {
            matchNumber = true;
          }
        }
      }
      if (matchName || matchNumber) {
        temp.push(c);
      }
    }
    setFiltered(temp);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };

  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  if (typeof document !== 'undefined') {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Contacts</Text>
        <Text style={styles.webMsg}>
          Contacts access is not available in the web browser.
        </Text>
        <Text style={styles.webSubMsg}>
          Please run this app on a real Android or iOS device to access your contacts.
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Contacts Access Required</Text>
        <Text style={styles.text}>Allow access to load your contacts.</Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Contacts Access</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Contacts</Text>
        <Text style={styles.countText}>{allContacts.length} contacts</Text>
      </View>

      <View style={styles.searchCard}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearch}
          placeholder="Search by name or number..."
          placeholderTextColor="#6b7280"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id || item.name}
        renderItem={({ item }) => {
          const name = item.name || 'Unknown';
          const number =
            item.phoneNumbers && item.phoneNumbers[0] ? item.phoneNumbers[0].number : null;
          const initials = getInitials(name);
          const bgColor = avatarColor(name);

          const handleCopy = async () => {
            if (!number) {
              Alert.alert('No Number', 'This contact has no phone number.');
              return;
            }
            await Clipboard.setStringAsync(number);
            Alert.alert('Copied', number + ' copied to clipboard.');
          };

          return (
            <View style={styles.contactRow}>
              <View style={[styles.avatar, { backgroundColor: bgColor }]}>
                <Text style={styles.avatarText}>{initials}</Text>
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
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No contacts found.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0d12',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#0b0d12',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  headerCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
  },
  countText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 15,
    marginTop: 14,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  webMsg: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  webSubMsg: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  searchCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
  },
  searchInput: {
    backgroundColor: '#0b0d12',
    color: '#f1f5f9',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151821',
    borderRadius: 12,
    marginVertical: 6,
    padding: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  contactNumber: {
    color: '#9ca3af',
    fontSize: 13,
  },
  copyBtn: {
    backgroundColor: '#f97316',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  btn: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    width: 220,
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
  },
});
