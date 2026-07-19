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

  const loadSurveys = () => setSurveys([...surveyStore]);

  useEffect(() => { loadSurveys(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadSurveys();
    setRefreshing(false);
  };

  const handleDelete = (item) => {
    if (typeof window !== 'undefined' && typeof window.confirm !== 'undefined') {
      const ok = window.confirm('Delete "' + item.siteName + '"?');
      if (ok) { surveyStore.splice(surveyStore.findIndex(s => s.id === item.id), 1); loadSurveys(); }
      return;
    }
    Alert.alert('Delete Survey', 'Delete "' + item.siteName + '"?\n\nThis cannot be undone.', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        surveyStore.splice(surveyStore.findIndex(s => s.id === item.id), 1);
        loadSurveys();
      }},
    ]);
  };

  const filteredSurveys = surveys.filter(s => {
    const matchFilter = activeFilter === 'All' || s.priority === activeFilter;
    const q = query.trim().toLowerCase();
    const matchQuery = !q || s.siteName.toLowerCase().includes(q) || s.clientName.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  const totalCount = surveys.length;
  const submittedCount = surveys.filter(s => s.status === 'Submitted').length;
  const pendingCount = totalCount - submittedCount;

  const priorityColor = (p) => {
    if (p === 'High') return '#ef4444';
    if (p === 'Medium') return '#f97316';
    return '#22c55e';
  };

  return (
    <View style={styles.container}>
      {/* Detail Modal */}
      <Modal transparent visible={selectedSurvey !== null} animationType="fade">
        {selectedSurvey && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{selectedSurvey.siteName}</Text>
              <View style={styles.modalDivider} />
              {[
                ['🆔 ID', selectedSurvey.id],
                ['👤 Client', selectedSurvey.clientName],
                ['📅 Date', selectedSurvey.date],
                ['⚡ Priority', selectedSurvey.priority],
                ['📊 Status', selectedSurvey.status],
                ['📝 Description', selectedSurvey.description],
              ].map(([label, value]) => (
                <View key={label} style={styles.modalRow}>
                  <Text style={styles.modalLabel}>{label}</Text>
                  <Text style={styles.modalValue}>{value}</Text>
                </View>
              ))}
              {selectedSurvey.submittedAt
                ? <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>✅ Submitted</Text>
                    <Text style={styles.modalValue}>{selectedSurvey.submittedAt}</Text>
                  </View>
                : null
              }
              <Pressable style={styles.btnPrimary} onPress={() => setSelectedSurvey(null)}>
                <Text style={styles.btnPrimaryText}>Close</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageIcon}>📋</Text>
        <View>
          <Text style={styles.pageTitle}>Survey History</Text>
          <Text style={styles.pageSubtitle}>All recorded field surveys</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#0ea5e9' }]}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#22c55e' }]}>{submittedCount}</Text>
          <Text style={styles.statLabel}>Submitted</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#f97316' }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchCard}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by site, client, or ID..."
          placeholderTextColor="#4b5563"
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {['All', 'High', 'Medium', 'Low'].map((p) => (
          <Pressable
            key={p}
            style={activeFilter === p ? styles.chipActive : styles.chip}
            onPress={() => setActiveFilter(p)}
          >
            <Text style={activeFilter === p ? styles.chipTextActive : styles.chipText}>{p}</Text>
          </Pressable>
        ))}
      </View>

      {/* Survey List */}
      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No surveys found</Text>
            <Text style={styles.emptyText}>
              {surveys.length === 0
                ? 'Create your first survey from the Survey tab.'
                : 'Try changing your search or filter.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.surveyCard}>
            <View style={styles.surveyCardHeader}>
              <Text style={styles.surveyTitle} numberOfLines={1}>{item.siteName}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColor(item.priority) + '22' }]}>
                <Text style={[styles.priorityBadgeText, { color: priorityColor(item.priority) }]}>{item.priority}</Text>
              </View>
            </View>
            <Text style={styles.surveyMeta}>👤 {item.clientName}</Text>
            <Text style={styles.surveyMeta} numberOfLines={1}>📝 {item.description}</Text>
            <View style={styles.surveyFooter}>
              <Text style={styles.surveyDate}>📅 {item.date}</Text>
              <View style={styles.surveyActions}>
                <Pressable style={styles.btnView} onPress={() => setSelectedSurvey(item)}>
                  <Text style={styles.btnViewText}>View</Text>
                </Pressable>
                <Pressable style={styles.btnDelete} onPress={() => handleDelete(item)}>
                  <Text style={styles.btnDeleteText}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          </View>
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
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageIcon: { fontSize: 28, marginRight: 12 },
  pageTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  pageSubtitle: { color: '#9ca3af', fontSize: 13, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginBottom: 12 },
  statCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#9ca3af', fontSize: 11, marginTop: 2 },
  searchCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    flex: 1,
    backgroundColor: '#0b0d12',
    color: '#ffffff',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  filterRow: { flexDirection: 'row', marginBottom: 12 },
  chip: {
    backgroundColor: '#151821',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  chipActive: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: { color: '#9ca3af', fontSize: 13, fontWeight: 'bold' },
  chipTextActive: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  surveyCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  surveyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  surveyTitle: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', flex: 1, marginRight: 8 },
  priorityBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  priorityBadgeText: { fontSize: 11, fontWeight: 'bold' },
  surveyMeta: { color: '#9ca3af', fontSize: 13, marginBottom: 3 },
  surveyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  surveyDate: { color: '#9ca3af', fontSize: 12 },
  surveyActions: { flexDirection: 'row', alignItems: 'center' },
  btnView: {
    backgroundColor: '#0ea5e922',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  btnViewText: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold' },
  btnDelete: {
    backgroundColor: '#ef444422',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  btnDeleteText: { fontSize: 14 },
  emptyCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginTop: 12,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  emptyText: { color: '#9ca3af', fontSize: 13, textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000bb',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#151821',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  modalTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalDivider: { height: 1, backgroundColor: '#1e293b', marginBottom: 12 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  modalLabel: { color: '#9ca3af', fontSize: 13, flex: 1 },
  modalValue: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', flex: 1.5, textAlign: 'right' },
  btnPrimary: {
    backgroundColor: '#f97316',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  btnPrimaryText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});
