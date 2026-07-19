import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import { surveyStore } from './Survey';

export default function HistoryScreen() {
  const [surveys, setSurveys] = useState([]);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadSurveys = () => {
    setSurveys([...surveyStore]);
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadSurveys();
    setRefreshing(false);
  };

  const filteredSurveys = [];
  for (let i = 0; i < surveys.length; i++) {
    const s = surveys[i];
    const matchesFilter = activeFilter === 'All' || s.priority === activeFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      s.siteName.toLowerCase().includes(q) ||
      s.clientName.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.date.includes(q);

    if (matchesFilter && matchesQuery) {
      filteredSurveys.push(s);
    }
  }

  const handleDelete = (item) => {
    if (typeof window !== 'undefined' && typeof window.confirm !== 'undefined') {
      const confirmed = window.confirm(
        'Delete survey "' + item.siteName + '" (' + item.id + ')? This cannot be undone.'
      );
      if (confirmed) {
        const idx = surveyStore.findIndex((s) => s.id === item.id);
        if (idx !== -1) surveyStore.splice(idx, 1);
        loadSurveys();
      }
      return;
    }
    Alert.alert(
      'Delete Survey',
      'Delete "' + item.siteName + '" (' + item.id + ')?\n\nThis cannot be undone.',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const idx = surveyStore.findIndex((s) => s.id === item.id);
            if (idx !== -1) surveyStore.splice(idx, 1);
            loadSurveys();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Modal transparent visible={selectedSurvey !== null} animationType="fade">
        {selectedSurvey && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{selectedSurvey.siteName}</Text>
              <Text style={styles.modalText}>ID: {selectedSurvey.id}</Text>
              <Text style={styles.modalText}>Status: {selectedSurvey.status}</Text>
              <Text style={styles.modalText}>Priority: {selectedSurvey.priority}</Text>
              <Text style={styles.modalText}>Client: {selectedSurvey.clientName}</Text>
              <Text style={styles.modalText}>Date: {selectedSurvey.date}</Text>
              <Text style={styles.modalText}>Description: {selectedSurvey.description}</Text>
              {selectedSurvey.notes ? (
                <Text style={styles.modalText}>Notes: {selectedSurvey.notes}</Text>
              ) : null}
              {selectedSurvey.submittedAt ? (
                <Text style={styles.modalText}>Submitted: {selectedSurvey.submittedAt}</Text>
              ) : null}
              <Pressable style={styles.btnClose} onPress={() => setSelectedSurvey(null)}>
                <Text style={styles.btnText}>Close</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>

      <View style={styles.searchCard}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by site or client..."
          placeholderTextColor="#4b5563"
        />
      </View>

      <View style={styles.filterRow}>
        {['All', 'High', 'Medium', 'Low'].map((p) => (
          <Pressable
            key={p}
            style={activeFilter === p ? styles.chipActive : styles.chip}
            onPress={() => setActiveFilter(p)}
          >
            <Text style={styles.chipText}>{p}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No surveys found</Text>
            <Text style={styles.emptyText}>
              {surveys.length === 0
                ? 'Create a survey to see it here.'
                : 'Try changing your search or filter.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.surveyCard} onPress={() => setSelectedSurvey(item)}>
            <View style={styles.cardHeader}>
              <Text style={styles.surveyTitle}>{item.siteName}</Text>
              <View style={[
                styles.badge,
                item.priority === 'High' ? styles.badgeHigh : item.priority === 'Low' ? styles.badgeLow : styles.badgeMedium
              ]}>
                <Text style={styles.badgeText}>{item.priority}</Text>
              </View>
            </View>
            <Text style={styles.cardMeta}>Client: {item.clientName}</Text>
            <Text style={styles.cardMeta} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.footerLeft}>
                <Text style={styles.footerDate}>📅 {item.date}</Text>
                <Text style={[styles.statusIcon, { color: '#22c55e' }]}>📷</Text>
                <Text style={[styles.statusIcon, { color: '#f97316' }]}>📍</Text>
                <Text style={[styles.statusIcon, { color: '#a855f7' }]}>👥</Text>
              </View>
              <Pressable style={styles.deleteIconBtn} onPress={() => handleDelete(item)}>
                <Text style={styles.deleteIconText}>🗑️</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
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
  searchCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
  },
  searchInput: {
    backgroundColor: '#0b0d12',
    color: '#ffffff',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  chip: {
    backgroundColor: '#1c1f2b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  surveyCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  surveyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeHigh: {
    backgroundColor: '#ef4444',
  },
  badgeMedium: {
    backgroundColor: '#f97316',
  },
  badgeLow: {
    backgroundColor: '#22c55e',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardMeta: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 8,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerDate: {
    color: '#9ca3af',
    fontSize: 13,
    marginRight: 12,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  deleteIconBtn: {
    padding: 4,
  },
  deleteIconText: {
    fontSize: 16,
  },
  emptyCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginVertical: 12,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#151821',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    color: '#f97316',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 6,
  },
  btnClose: {
    backgroundColor: '#f97316',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
