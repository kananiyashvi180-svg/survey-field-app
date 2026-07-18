import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';

// ── Sample survey history data ────────────────────────────────────────────────
const SAMPLE_HISTORY = [
  {
    id: 'SRV-2026-001',
    siteName: 'Field Survey – Plot A',
    clientName: 'Rajesh Patel',
    description:
      'Comprehensive soil and crop assessment of Plot A. Checked irrigation channels, estimated yield potential, and documented weed growth patterns.',
    priority: 'High',
    date: '2026-07-19',
    status: 'Submitted',
    contact: { name: 'Rajesh Patel', number: '+91 98765 43210' },
    location: { latitude: 23.022505, longitude: 72.571362, accuracy: 4.8 },
    notes:
      'Soil moisture adequate. Two irrigation pumps non-functional. Recommend immediate maintenance.',
    submittedAt: '19/07/2026, 09:14:32 AM',
  },
  {
    id: 'SRV-2026-002',
    siteName: 'Soil Inspection – Zone B',
    clientName: 'Meena Shah',
    description:
      'Detailed soil pH and nutrient test in Zone B. Identified potassium deficiency in southern plots.',
    priority: 'Medium',
    date: '2026-07-18',
    status: 'Submitted',
    contact: { name: 'Meena Shah', number: '+91 91234 56789' },
    location: { latitude: 23.033100, longitude: 72.585230, accuracy: 6.2 },
    notes: 'Recommend potassium-rich fertiliser application before next season.',
    submittedAt: '18/07/2026, 04:45:10 PM',
  },
  {
    id: 'SRV-2026-003',
    siteName: 'Crop Assessment – Block C',
    clientName: 'Arjun Mehta',
    description:
      'Crop yield estimation for cotton Block C. Compared with previous season benchmarks.',
    priority: 'Low',
    date: '2026-07-17',
    status: 'Submitted',
    contact: { name: 'Arjun Mehta', number: '+91 99887 76655' },
    location: { latitude: 23.010780, longitude: 72.560910, accuracy: 3.1 },
    notes: 'Yield estimated at 85% of target. Pest pressure low.',
    submittedAt: '17/07/2026, 11:22:00 AM',
  },
  {
    id: 'SRV-2026-004',
    siteName: 'Water Source Check – Sector D',
    clientName: 'Priya Desai',
    description:
      'Evaluated borewell depth and water quality for agricultural use in Sector D.',
    priority: 'High',
    date: '2026-07-16',
    status: 'Pending',
    contact: { name: 'Priya Desai', number: '+91 93456 78901' },
    location: { latitude: 22.998400, longitude: 72.544600, accuracy: 5.5 },
    notes: 'Water salinity slightly above threshold. Requires filtration system.',
    submittedAt: null,
  },
  {
    id: 'SRV-2026-005',
    siteName: 'Fertiliser Audit – Farm E',
    clientName: 'Suresh Joshi',
    description:
      'Audited fertiliser usage and storage practices across Farm E. Cross-verified with usage records.',
    priority: 'Medium',
    date: '2026-07-15',
    status: 'Submitted',
    contact: { name: 'Suresh Joshi', number: '+91 98001 12345' },
    location: { latitude: 23.045200, longitude: 72.598700, accuracy: 7.0 },
    notes: 'Excess urea stockpiled. Advised redistribution before monsoon.',
    submittedAt: '15/07/2026, 03:10:55 PM',
  },
  {
    id: 'SRV-2026-006',
    siteName: 'Pest Control – Orchard F',
    clientName: 'Kavita Rao',
    description:
      'Inspected mango orchard F for fruit fly infestation. Mapped affected zones.',
    priority: 'High',
    date: '2026-07-14',
    status: 'Pending',
    contact: { name: 'Kavita Rao', number: '+91 77889 90011' },
    location: { latitude: 23.060100, longitude: 72.612300, accuracy: 4.3 },
    notes: 'Heavy infestation in north-east quadrant. Immediate fumigation required.',
    submittedAt: null,
  },
];

const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function priorityColor(p) {
  if (p === 'High') return '#ef4444';
  if (p === 'Medium') return '#eab308';
  return '#22c55e';
}

function statusColor(s) {
  return s === 'Submitted' ? '#22c55e' : '#f97316';
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ survey, onClose }) {
  if (!survey) return null;

  const InfoRow = ({ label, value, accent, mono }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[
          styles.detailValue,
          mono && { fontFamily: 'monospace', color: '#f97316', fontSize: 13 },
          accent && { color: '#f97316' },
        ]}
        numberOfLines={0}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <Modal transparent animationType="slide" visible={!!survey}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {survey.siteName}
              </Text>
              <View style={styles.modalBadgeRow}>
                <View
                  style={[
                    styles.badge,
                    { borderColor: priorityColor(survey.priority) },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: priorityColor(survey.priority) },
                    ]}
                  >
                    {survey.priority}
                  </Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    { borderColor: statusColor(survey.status) },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: statusColor(survey.status) },
                    ]}
                  >
                    {survey.status}
                  </Text>
                </View>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Survey ID */}
            <View style={styles.idRow}>
              <Text style={styles.idLabel}>SURVEY ID</Text>
              <Text style={styles.idValue}>{survey.id}</Text>
            </View>

            {/* Section: Site Details */}
            <Text style={styles.sectionLabel}>📋 Site Details</Text>
            <View style={styles.detailCard}>
              <InfoRow label="Site Name" value={survey.siteName} />
              <InfoRow label="Client" value={survey.clientName} />
              <InfoRow label="Date" value={survey.date} mono />
            </View>

            {/* Description */}
            <Text style={styles.sectionLabel}>📄 Description</Text>
            <View style={styles.detailCard}>
              <Text style={styles.descText}>{survey.description}</Text>
            </View>

            {/* Contact */}
            <Text style={styles.sectionLabel}>📞 Contact</Text>
            <View style={styles.detailCard}>
              <InfoRow label="Name" value={survey.contact.name} />
              <InfoRow label="Number" value={survey.contact.number} accent />
            </View>

            {/* Location */}
            <Text style={styles.sectionLabel}>📍 Location</Text>
            <View style={styles.coordRow}>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>LATITUDE</Text>
                <Text style={styles.coordValue}>
                  {survey.location.latitude.toFixed(6)}°
                </Text>
              </View>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>LONGITUDE</Text>
                <Text style={styles.coordValue}>
                  {survey.location.longitude.toFixed(6)}°
                </Text>
              </View>
            </View>

            {/* Notes */}
            <Text style={styles.sectionLabel}>📝 Field Notes</Text>
            <View style={styles.detailCard}>
              <Text style={styles.descText}>{survey.notes}</Text>
            </View>

            {/* Submitted At */}
            {survey.submittedAt && (
              <View style={styles.submittedRow}>
                <Text style={styles.submittedText}>
                  ✅ Submitted on {survey.submittedAt}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Survey Card (FlatList item) ───────────────────────────────────────────────
function SurveyCard({ item, onView, onDelete }) {
  const pColor = priorityColor(item.priority);
  const sColor = statusColor(item.status);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onView(item)}
    >
      {/* Priority stripe */}
      <View style={[styles.priorityStripe, { backgroundColor: pColor }]} />

      <View style={styles.cardBody}>
        {/* Top Row */}
        <View style={styles.cardTopRow}>
          <Text style={styles.cardId}>{item.id}</Text>
          <View style={[styles.badge, { borderColor: sColor }]}>
            <Text style={[styles.badgeText, { color: sColor }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Site Name */}
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.siteName}
        </Text>

        {/* Client + Date Row */}
        <View style={styles.cardMeta}>
          <Text style={styles.cardMetaText}>👤 {item.clientName}</Text>
          <Text style={styles.cardMetaText}>📅 {item.date}</Text>
        </View>

        {/* Priority + Delete Row */}
        <View style={styles.cardFooter}>
          <View
            style={[
              styles.priorityPill,
              { backgroundColor: pColor + '20', borderColor: pColor },
            ]}
          >
            <Text style={[styles.priorityPillText, { color: pColor }]}>
              {item.priority} Priority
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.deleteBtnPressed,
            ]}
            onPress={() => onDelete(item)}
          >
            <Text style={styles.deleteBtnText}>🗑️</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function HistoryScreen() {
  const [surveys, setSurveys] = useState(SAMPLE_HISTORY);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // ── Filtered + searched list ──────────────────────────────────────────────
  const filteredSurveys = useMemo(() => {
    let list = surveys;

    // Priority filter
    if (activeFilter !== 'All') {
      list = list.filter((s) => s.priority === activeFilter);
    }

    // Search
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.siteName.toLowerCase().includes(q) ||
          s.clientName.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.date.includes(q)
      );
    }

    return list;
  }, [surveys, query, activeFilter]);

  // ── Delete with confirmation ──────────────────────────────────────────────
  const handleDelete = (item) => {
    Alert.alert(
      '🗑️ Delete Survey',
      `Are you sure you want to delete:\n\n"${item.siteName}" (${item.id})?\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSurveys((prev) => prev.filter((s) => s.id !== item.id));
          },
        },
      ]
    );
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const total = surveys.length;
  const submitted = surveys.filter((s) => s.status === 'Submitted').length;
  const pending = surveys.filter((s) => s.status === 'Pending').length;

  return (
    <View style={styles.container}>
      <DetailModal
        survey={selectedSurvey}
        onClose={() => setSelectedSurvey(null)}
      />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📂 Survey History</Text>
        <Text style={styles.headerSub}>
          All recorded field surveys
        </Text>
      </View>

      {/* ── Stats Row ── */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxMid]}>
          <Text style={[styles.statCount, { color: '#22c55e' }]}>
            {submitted}
          </Text>
          <Text style={styles.statLabel}>Submitted</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statCount, { color: '#f97316' }]}>
            {pending}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by site, client, ID or date…"
          placeholderTextColor="#4b5563"
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* ── Priority Filter Pills ── */}
      <View style={styles.filterRow}>
        {PRIORITIES.map((p) => {
          const isActive = activeFilter === p;
          const col = p === 'All' ? '#f97316' : priorityColor(p);
          return (
            <Pressable
              key={p}
              style={[
                styles.filterPill,
                isActive && {
                  backgroundColor: col + '22',
                  borderColor: col,
                },
              ]}
              onPress={() => setActiveFilter(p)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isActive && { color: col, fontWeight: '700' },
                ]}
              >
                {p}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Result Count ── */}
      <Text style={styles.resultCount}>
        {filteredSurveys.length === 0
          ? 'No surveys found'
          : `${filteredSurveys.length} survey${filteredSurveys.length !== 1 ? 's' : ''}${
              query || activeFilter !== 'All' ? ' matched' : ''
            }`}
      </Text>

      {/* ── FlatList ── */}
      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SurveyCard
            item={item}
            onView={setSelectedSurvey}
            onDelete={handleDelete}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredSurveys.length === 0
            ? styles.emptyContainer
            : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>No Surveys Found</Text>
            <Text style={styles.emptySubtitle}>
              {query
                ? `No results for "${query}". Try a different search.`
                : activeFilter !== 'All'
                ? `No ${activeFilter} priority surveys.`
                : 'Your survey history is empty.'}
            </Text>
            {(query || activeFilter !== 'All') && (
              <Pressable
                style={({ pressed }) => [
                  styles.resetBtn,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => {
                  setQuery('');
                  setActiveFilter('All');
                }}
              >
                <Text style={styles.resetBtnText}>🔄  Reset Filters</Text>
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
    paddingHorizontal: 14,
  },

  // Header
  header: {
    paddingTop: 22,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f97316',
    marginBottom: 2,
  },
  headerSub: { fontSize: 13, color: '#6b7280' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1c1f2b',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 14,
    overflow: 'hidden',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statBoxMid: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#2a2d3a',
  },
  statCount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f1f5f9',
    lineHeight: 32,
  },
  statLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600', marginTop: 2 },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1f2b',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    color: '#f1f5f9',
    fontSize: 15,
    padding: 0,
  },
  clearIcon: { color: '#6b7280', fontSize: 14, fontWeight: '700' },

  // Filter Pills
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    backgroundColor: '#1c1f2b',
    alignItems: 'center',
  },
  filterPillText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },

  // Result Count
  resultCount: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 10,
  },

  // List
  listContent: { paddingBottom: 30 },

  // Survey Card
  card: {
    flexDirection: 'row',
    backgroundColor: '#1c1f2b',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: '#252836',
    borderColor: '#f97316',
  },
  priorityStripe: {
    width: 4,
    borderRadius: 2,
  },
  cardBody: {
    flex: 1,
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardId: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 10,
  },
  cardMetaText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  priorityPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnPressed: { opacity: 0.7 },
  deleteBtnText: { fontSize: 16 },

  // Badge
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 9,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyState: { alignItems: 'center', paddingHorizontal: 24 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  resetBtn: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 28,
  },
  resetBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // ── Detail Modal ────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#1c1f2b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2d3a',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  modalBadgeRow: { flexDirection: 'row', gap: 8 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2d3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  closeBtnText: { color: '#9ca3af', fontWeight: '800', fontSize: 13 },

  // ID row in modal
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1117',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 16,
    gap: 10,
  },
  idLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  idValue: {
    fontSize: 13,
    color: '#f97316',
    fontWeight: '700',
    fontFamily: 'monospace',
  },

  // Section Label
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Detail Card
  detailCard: {
    backgroundColor: '#0f1117',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2130',
    gap: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    color: '#e2e8f0',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  descText: {
    fontSize: 13,
    color: '#d1d5db',
    lineHeight: 20,
  },

  // Coordinates
  coordRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  coordBox: {
    flex: 1,
    backgroundColor: '#0f1117',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  coordLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  coordValue: { fontSize: 15, fontWeight: '700', color: '#f97316' },

  // Submitted banner
  submittedRow: {
    backgroundColor: '#052e16',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#16a34a44',
    alignItems: 'center',
    marginTop: 4,
  },
  submittedText: { color: '#4ade80', fontSize: 13, fontWeight: '700' },
});
