import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';

// ── Fake survey data (simulates what would come from a real store) ─────────────
const SAMPLE_SURVEYS = [
  { id: 'SRV-2026-001', site: 'Field Survey – Plot A', client: 'Rajesh Patel' },
  { id: 'SRV-2026-002', site: 'Soil Inspection – Zone B', client: 'Meena Shah' },
  { id: 'SRV-2026-003', site: 'Crop Assessment – Block C', client: 'Arjun Mehta' },
];

const SAMPLE_CONTACTS = [
  { name: 'Rajesh Patel', number: '+91 98765 43210' },
  { name: 'Meena Shah', number: '+91 91234 56789' },
  { name: 'Arjun Mehta', number: '+91 99887 76655' },
];

// ── Reusable Action Card ───────────────────────────────────────────────────────
function ActionCard({ icon, iconBg, title, subtitle, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconCircle, { backgroundColor: iconBg }]}>
          <Text style={styles.cardIconText}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ClipboardScreen() {
  // ── Survey ID state ──────────────────────────────────────────────────────────
  const [selectedSurvey, setSelectedSurvey] = useState(SAMPLE_SURVEYS[0]);
  const [surveyCopied, setSurveyCopied] = useState(false);

  // ── Contact state ────────────────────────────────────────────────────────────
  const [selectedContact, setSelectedContact] = useState(SAMPLE_CONTACTS[0]);
  const [contactCopied, setContactCopied] = useState(false);

  // ── Location state ───────────────────────────────────────────────────────────
  const [locationStr, setLocationStr] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationCopied, setLocationCopied] = useState(false);

  // ── Notes state ──────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState('');
  const [pastedText, setPastedText] = useState('');

  // ── Clipboard history ────────────────────────────────────────────────────────
  const [history, setHistory] = useState([]);

  // ── Helper: push to history ──────────────────────────────────────────────────
  const pushHistory = useCallback((label, value) => {
    setHistory((prev) => [
      { id: Date.now().toString(), label, value, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9), // keep last 10
    ]);
  }, []);

  // ── Helper: brief flash feedback ────────────────────────────────────────────
  const flash = (setter) => {
    setter(true);
    setTimeout(() => setter(false), 1500);
  };

  // ── Copy Survey ID ───────────────────────────────────────────────────────────
  const handleCopySurveyId = async () => {
    await Clipboard.setStringAsync(selectedSurvey.id);
    pushHistory('Survey ID', selectedSurvey.id);
    flash(setSurveyCopied);
  };

  // ── Copy Contact Number ──────────────────────────────────────────────────────
  const handleCopyContact = async () => {
    await Clipboard.setStringAsync(selectedContact.number);
    pushHistory(`Contact (${selectedContact.name})`, selectedContact.number);
    flash(setContactCopied);
  };

  // ── Copy Current Location ────────────────────────────────────────────────────
  const handleCopyLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to copy coordinates.');
        setLocationLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const str = `Lat: ${loc.coords.latitude.toFixed(6)}, Lon: ${loc.coords.longitude.toFixed(6)}`;
      setLocationStr(str);
      await Clipboard.setStringAsync(str);
      pushHistory('Current Location', str);
      flash(setLocationCopied);
    } catch {
      Alert.alert('Error', 'Could not fetch location. Please try again.');
    }
    setLocationLoading(false);
  };

  // ── Paste Notes ──────────────────────────────────────────────────────────────
  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (!text) {
      Alert.alert('Clipboard Empty', 'Nothing found on the clipboard to paste.');
      return;
    }
    setPastedText(text);
    setNotes((prev) => (prev ? prev + '\n' + text : text));
  };

  // ── Clear Clipboard Data ─────────────────────────────────────────────────────
  const handleClear = () => {
    Alert.alert(
      'Clear Clipboard Data',
      'This will clear your notes, pasted content, and the clipboard history. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await Clipboard.setStringAsync('');
            setNotes('');
            setPastedText('');
            setHistory([]);
            setLocationStr(null);
            setSurveyCopied(false);
            setContactCopied(false);
            setLocationCopied(false);
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 36 }}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>📋 Clipboard</Text>
        <Text style={styles.headerSub}>Copy, paste and manage field data</Text>
      </View>

      {/* ── 1. Copy Survey ID ──────────────────────────────────────────────── */}
      <ActionCard
        icon="📋"
        iconBg="#1e3a5f"
        title="Copy Survey ID"
        subtitle="Select a survey and copy its unique ID"
      >
        <View style={styles.selectorRow}>
          {SAMPLE_SURVEYS.map((s) => (
            <Pressable
              key={s.id}
              style={[
                styles.selectorChip,
                selectedSurvey.id === s.id && styles.selectorChipActive,
              ]}
              onPress={() => { setSelectedSurvey(s); setSurveyCopied(false); }}
            >
              <Text
                style={[
                  styles.selectorChipText,
                  selectedSurvey.id === s.id && styles.selectorChipTextActive,
                ]}
                numberOfLines={1}
              >
                {s.id}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.previewBox}>
          <Text style={styles.previewLabel}>Site:</Text>
          <Text style={styles.previewValue}>{selectedSurvey.site}</Text>
          <Text style={styles.previewLabel}>Client:</Text>
          <Text style={styles.previewValue}>{selectedSurvey.client}</Text>
          <Text style={styles.previewLabel}>ID:</Text>
          <Text style={[styles.previewValue, styles.monoText]}>{selectedSurvey.id}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.copyBtn,
            surveyCopied && styles.copyBtnSuccess,
            pressed && styles.copyBtnPressed,
          ]}
          onPress={handleCopySurveyId}
        >
          <Text style={styles.copyBtnText}>
            {surveyCopied ? '✅  Copied!' : '📋  Copy Survey ID'}
          </Text>
        </Pressable>
      </ActionCard>

      {/* ── 2. Copy Contact Number ─────────────────────────────────────────── */}
      <ActionCard
        icon="👥"
        iconBg="#2e1a4a"
        title="Copy Contact Number"
        subtitle="Select a field contact and copy their number"
      >
        <View style={styles.selectorRow}>
          {SAMPLE_CONTACTS.map((c) => (
            <Pressable
              key={c.number}
              style={[
                styles.selectorChip,
                selectedContact.number === c.number && styles.selectorChipActive,
              ]}
              onPress={() => { setSelectedContact(c); setContactCopied(false); }}
            >
              <Text
                style={[
                  styles.selectorChipText,
                  selectedContact.number === c.number && styles.selectorChipTextActive,
                ]}
                numberOfLines={1}
              >
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.previewBox}>
          <Text style={styles.previewLabel}>Name:</Text>
          <Text style={styles.previewValue}>{selectedContact.name}</Text>
          <Text style={styles.previewLabel}>Number:</Text>
          <Text style={[styles.previewValue, styles.monoText]}>{selectedContact.number}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.copyBtn,
            contactCopied && styles.copyBtnSuccess,
            pressed && styles.copyBtnPressed,
          ]}
          onPress={handleCopyContact}
        >
          <Text style={styles.copyBtnText}>
            {contactCopied ? '✅  Copied!' : '📞  Copy Number'}
          </Text>
        </Pressable>
      </ActionCard>

      {/* ── 3. Copy Current Location ───────────────────────────────────────── */}
      <ActionCard
        icon="📍"
        iconBg="#3d2a10"
        title="Copy Current Location"
        subtitle="Fetch GPS coordinates and copy to clipboard"
      >
        {locationStr && (
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Coordinates:</Text>
            <Text style={[styles.previewValue, styles.monoText]}>{locationStr}</Text>
          </View>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.copyBtn,
            locationCopied && styles.copyBtnSuccess,
            pressed && styles.copyBtnPressed,
            locationLoading && styles.copyBtnDisabled,
          ]}
          onPress={handleCopyLocation}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.copyBtnText}>
              {locationCopied ? '✅  Copied!' : '📍  Copy Location'}
            </Text>
          )}
        </Pressable>
      </ActionCard>

      {/* ── 4. Paste Notes ─────────────────────────────────────────────────── */}
      <ActionCard
        icon="📝"
        iconBg="#1a3d3d"
        title="Paste Notes"
        subtitle="Paste clipboard content into field notes"
      >
        <TextInput
          style={styles.notesInput}
          placeholder="Field notes appear here after pasting…"
          placeholderTextColor="#4b5563"
          multiline
          numberOfLines={5}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
        {pastedText !== '' && (
          <View style={styles.pastedBadge}>
            <Text style={styles.pastedBadgeText}>📌 Last pasted: "{pastedText.slice(0, 40)}{pastedText.length > 40 ? '…' : ''}"</Text>
          </View>
        )}
        <Pressable
          style={({ pressed }) => [styles.pasteBtn, pressed && styles.pasteBtnPressed]}
          onPress={handlePaste}
        >
          <Text style={styles.pasteBtnText}>📥  Paste from Clipboard</Text>
        </Pressable>
      </ActionCard>

      {/* ── 5. Clipboard History + Clear ───────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconCircle, { backgroundColor: '#3d1a1a' }]}>
            <Text style={styles.cardIconText}>🗑️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Clipboard History</Text>
            <Text style={styles.cardSubtitle}>Recent copies · last 10 items</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.clearBtn, pressed && styles.clearBtnPressed]}
            onPress={handleClear}
          >
            <Text style={styles.clearBtnText}>Clear All</Text>
          </Pressable>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Text style={styles.emptyHistoryEmoji}>📭</Text>
            <Text style={styles.emptyHistoryText}>No items copied yet</Text>
          </View>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyLabel}>{item.label}</Text>
                <Text style={styles.historyValue} numberOfLines={1}>{item.value}</Text>
              </View>
              <Text style={styles.historyTime}>{item.time}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
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
  headerSection: {
    paddingTop: 22,
    paddingBottom: 18,
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

  // Card
  card: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  cardIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: { fontSize: 22 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Selector chips
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selectorChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    backgroundColor: '#0f1117',
  },
  selectorChipActive: {
    borderColor: '#f97316',
    backgroundColor: '#2a1500',
  },
  selectorChipText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  selectorChipTextActive: {
    color: '#f97316',
  },

  // Preview box
  previewBox: {
    backgroundColor: '#0f1117',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    gap: 2,
  },
  previewLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  previewValue: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  monoText: {
    fontFamily: 'monospace',
    color: '#f97316',
    fontSize: 13,
  },

  // Copy button
  copyBtn: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  copyBtnSuccess: {
    backgroundColor: '#16a34a',
  },
  copyBtnPressed: { opacity: 0.82 },
  copyBtnDisabled: { opacity: 0.5 },
  copyBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // Notes input
  notesInput: {
    backgroundColor: '#0f1117',
    color: '#f1f5f9',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    minHeight: 110,
    marginBottom: 10,
    lineHeight: 20,
  },

  // Pasted badge
  pastedBadge: {
    backgroundColor: '#1a3d2b',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#16a34a44',
  },
  pastedBadgeText: {
    color: '#4ade80',
    fontSize: 12,
  },

  // Paste button
  pasteBtn: {
    backgroundColor: '#2a2d3a',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b3f54',
  },
  pasteBtnPressed: { backgroundColor: '#374151' },
  pasteBtnText: {
    color: '#f1f5f9',
    fontWeight: '700',
    fontSize: 15,
  },

  // Clear button
  clearBtn: {
    backgroundColor: '#3d1a1a',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ef444444',
  },
  clearBtnPressed: { opacity: 0.75 },
  clearBtnText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 13,
  },

  // History
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 22,
  },
  emptyHistoryEmoji: { fontSize: 36, marginBottom: 8 },
  emptyHistoryText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#2a2d3a',
    gap: 10,
  },
  historyLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  historyValue: {
    fontSize: 13,
    color: '#e2e8f0',
    fontFamily: 'monospace',
  },
  historyTime: {
    fontSize: 11,
    color: '#4b5563',
  },
});
