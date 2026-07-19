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
  const parts = name.split(' ');
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
      setPermission({ granted: true });
      loadContacts();
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
        Alert.alert('Permission Denied', 'Contacts access is required.');
      }
    } catch (_err) {
      Alert.alert('Error', 'Failed to request permission.');
    }
  };

  const loadContacts = async () => {
    try {
      if (typeof document !== 'undefined') {
        const dummy = [
          { id: '1', name: 'Alice Smith', phoneNumbers: [{ number: '123-456-7890' }] },
          { id: '2', name: 'Bob Jones', phoneNumbers: [{ number: '987-654-3210' }] },
          { id: '3', name: 'Charlie Brown', phoneNumbers: [{ number: '555-555-5555' }] }
        ];
        setAllContacts(dummy);
        setFiltered(dummy);
        return;
      }
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
    } else {
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
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };

  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Contacts Access Required</Text>
        <Pressable style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryBtnText}>Grant Contacts Access</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
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
          const number = item.phoneNumbers && item.phoneNumbers[0] ? item.phoneNumbers[0].number : null;
          const initials = getInitials(name);
          const bgColor = avatarColor(name);

          const handleCopy = async () => {
            if (!number) {
              Alert.alert('No Number', 'This contact has no number.');
              return;
            }
            await Clipboard.setStringAsync(number);
            Alert.alert('Copied', 'Phone number copied.');
          };

          return (
            <View style={styles.row}>
              <View style={[styles.avatar, { backgroundColor: bgColor }]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.contactName}>{name}</Text>
                <Text style={styles.contactNumber}>{number || 'No Number'}</Text>
              </View>
              <Pressable style={styles.copyBtn} onPress={handleCopy}>
                <Text style={styles.copyBtnText}>📋</Text>
              </Pressable>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    padding: 10,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#0f1117',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 15,
    margin: 14,
    fontWeight: 'bold',
  },
  title: {
    color: '#f1f5f9',
    fontSize: 22,
    fontWeight: 'bold',
    margin: 8,
  },
  primaryBtn: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
    width: 200,
    margin: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  searchRow: {
    padding: 14,
  },
  searchInput: {
    backgroundColor: '#1c1f2b',
    color: '#f1f5f9',
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1f2b',
    borderRadius: 12,
    margin: 10,
    padding: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rowInfo: {
    flex: 1,
  },
  contactName: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 2,
  },
  contactNumber: {
    color: '#9ca3af',
    fontSize: 13,
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2a2d3a',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  copyBtnText: {
    fontSize: 16,
  },
});
