import React, { useState, useCallback } from 'react';
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

// ── Helper: get initials from name ───────────────────────────────────────────
function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── Avatar color palette ──────────────────────────────────────────────────────
const AVATAR_COLORS = [
  '#f97316', '#3b82f6', '#8b5cf6', '#10b981',
  '#ef4444', '#f59e0b', '#06b6d4', '#ec4899',
];
function avatarColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ── Contact Row Component ─────────────────────────────────────────────────────
function ContactRow({ contact }) {
  const name = contact.name || 'Unknown';
  const number = contact.phoneNumbers?.[0]?.number || null;
  const initials = getInitials(name);
  const bgColor = avatarColor(name);

  const handleCopy = async () => {
    if (!number) {
      Alert.alert('No Number', 'This contact has no phone number to copy.');
      return;
    }
    await Clipboard.setStringAsync(number);
    Alert.alert('✅ Copied', `${number} copied to clipboard.`);
  };

  return (
    <View style={styles.row}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: bgColor }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Info */}
      <View style={styles.rowInfo}>
        <Text style={styles.contactName} numberOfLines={1}>{name}</Text>
        <Text style={[styles.contactNumber, !number && styles.noNumber]}>
          {number ?? 'No Number'}
        </Text>
      </View>

      {/* Copy Button */}
      <Pressable
        style={({ pressed }) => [styles.copyBtn, pressed && styles.copyBtnPressed, !number && styles.copyBtnDisabled]}
        onPress={handleCopy}
        disabled={!number}
      >
        <Text style={styles.copyBtnText}>📋</Text>
      </Pressable>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ContactsScreen() {
  const [permission, requestPermission] = Contacts.usePermissions();
  const [allContacts, setAllContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadContacts = useCallback(async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });
      const sorted = [...data].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      );
      setAllContacts(sorted);
      setFiltered(sorted);
      setQuery('');
    } catch {
      Alert.alert('Error', 'Failed to load contacts.');
    }
  }, []);

  const handleGrantPermission = async () => {
    setLoading(true);
    const response = await requestPermission();
    if (response.granted) {
      await loadContacts();
    } else {
      Alert.alert('Permission Denied', 'Contacts access is required to use this feature.');
    }
    setLoading(false);
  };

  const handleSearch = (text) => {
    setQuery(text);
    const q = text.toLowerCase().trim();
    if (!q) {
      setFiltered(allContacts);
    } else {
      setFiltered(
        allContacts.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.phoneNumbers?.some((p) => p.number?.includes(q))
        )
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };

  // ── State: permission not loaded yet
  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Checking permissions…</Text>
      </View>
    );
  }

  // ── State: permission denied / not asked
  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.permCard}>
          <Text style={styles.permEmoji}>👥</Text>
          <Text style={styles.title}>Contacts Access Required</Text>
          <Text style={styles.subtitle}>
            Allow access to your contacts to sync, search, and copy field client numbers directly within the app.
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#f97316" />
          ) : (
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
              onPress={handleGrantPermission}
            >
              <Text style={styles.primaryBtnText}>Grant Contacts Access</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  // ── State: contacts not loaded yet after permission granted
  if (allContacts.length === 0 && !loading && !refreshing) {
    // First load
    loadContacts();
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading Contacts…</Text>
      </View>
    );
  }

  // ── Main Contacts View ────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Search Bar + Counter */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearch}
          placeholder="Search by name or number…"
          placeholderTextColor="#6b7280"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Counter Badge */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {query
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`
            : `${allContacts.length} Contact${allContacts.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {/* Contact List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id ?? item.name}
        renderItem={({ item }) => <ContactRow contact={item} />}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#f97316"
            colors={['#f97316']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No Contacts Found</Text>
            <Text style={styles.emptySubtitle}>
              {query
                ? `No contacts match "${query}". Try a different search.`
                : 'Your contact list appears to be empty. Pull down to refresh.'}
            </Text>
            {!query && (
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, styles.retryBtn, pressed && styles.primaryBtnPressed]}
                onPress={handleRefresh}
              >
                <Text style={styles.primaryBtnText}>🔄  Refresh</Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
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
    marginTop: 14,
    fontWeight: '500',
  },

  // Permission Card
  permCard: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  permEmoji: { fontSize: 48, marginBottom: 14 },
  title: { color: '#f1f5f9', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#9ca3af', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },

  // Buttons
  primaryBtn: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  primaryBtnPressed: { opacity: 0.82 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  retryBtn: { width: 'auto', paddingHorizontal: 32, marginTop: 16 },

  // Search
  searchRow: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
  },
  searchInput: {
    backgroundColor: '#1c1f2b',
    color: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },

  // Counter
  counterRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  counterText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },

  // List
  listContainer: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },

  // Contact Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1f2b',
    borderRadius: 12,
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    fontWeight: '600',
    marginBottom: 2,
  },
  contactNumber: {
    color: '#9ca3af',
    fontSize: 13,
  },
  noNumber: {
    color: '#4b5563',
    fontStyle: 'italic',
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2a2d3a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b3f54',
  },
  copyBtnPressed: { backgroundColor: '#374151' },
  copyBtnDisabled: { opacity: 0.35 },
  copyBtnText: { fontSize: 16 },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { color: '#f1f5f9', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { color: '#6b7280', fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
