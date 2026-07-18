import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';

// ── Sample survey data (simulates data passed from Survey / Camera / Contacts / Location modules) ──
const INITIAL_SURVEY = {
  id: 'SRV-2026-001',
  siteName: 'Field Survey – Plot A',
  clientName: 'Rajesh Patel',
  description:
    'Comprehensive soil and crop assessment of Plot A. Checked irrigation channels, estimated yield potential, and documented weed growth patterns.',
  priority: 'High',
  date: '2026-07-19',
  photo: null, // e.g. a local file URI from Camera module
  contact: {
    name: 'Rajesh Patel',
    number: '+91 98765 43210',
  },
  location: {
    latitude: 23.022505,
    longitude: 72.571362,
    accuracy: 4.8,
  },
  notes:
    'Soil moisture adequate. Two irrigation pumps non-functional. Recommend immediate maintenance. Pest pressure moderate on north boundary.',
  status: 'Pending',
  submittedAt: null,
};

// ── Priority color helper ────────────────────────────────────────────────────────
function priorityColor(p) {
  if (p === 'High') return '#ef4444';
  if (p === 'Medium') return '#eab308';
  return '#22c55e';
}

// ── Section header ────────────────────────────────────────────────────────────────
function SectionHeader({ icon, title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// ── Info row for key-value display ────────────────────────────────────────────────
function InfoRow({ label, value, mono, accent }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text
        style={[
          styles.infoValue,
          mono && styles.monoText,
          accent && { color: '#f97316' },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────────
export default function PreviewScreen() {
  const router = useRouter();
  const [survey, setSurvey] = useState(INITIAL_SURVEY);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ── Edit handlers ─────────────────────────────────────────────────────────────
  const handleEdit = () => {
    setEditDraft({ ...survey });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditDraft(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!editDraft.siteName.trim()) {
      Alert.alert('Validation Error', 'Site Name cannot be empty.');
      return;
    }
    if (!editDraft.clientName.trim()) {
      Alert.alert('Validation Error', 'Client Name cannot be empty.');
      return;
    }
    setSurvey({ ...editDraft });
    setIsEditing(false);
    setEditDraft(null);
  };

  const handleDraftChange = (field, value) => {
    setEditDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectPriority = (p) => {
    setEditDraft((prev) => ({ ...prev, priority: p }));
  };

  // ── Submit handler ────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    Alert.alert(
      '📤 Submit Survey',
      `Are you sure you want to submit "${survey.siteName}"?\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            const now = new Date().toLocaleString();
            setSurvey((prev) => ({
              ...prev,
              status: 'Submitted',
              submittedAt: now,
            }));
            setSubmitted(true);
            setShowSuccessModal(true);
          },
        },
      ]
    );
  };

  // ── Success Modal ─────────────────────────────────────────────────────────────
  const SuccessModal = () => (
    <Modal transparent animationType="fade" visible={showSuccessModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalEmoji}>✅</Text>
          <Text style={styles.modalTitle}>Survey Submitted!</Text>
          <Text style={styles.modalDesc}>
            "{survey.siteName}" has been successfully submitted at{' '}
            {survey.submittedAt}.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.primaryBtnPressed,
            ]}
            onPress={() => {
              setShowSuccessModal(false);
              router.push('/(drawer)/(tabs)/Dashboard');
            }}
          >
            <Text style={styles.primaryBtnText}>Back to Dashboard</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  // ── EDIT MODE ─────────────────────────────────────────────────────────────────
  if (isEditing && editDraft) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Edit Header */}
        <View style={styles.editHeader}>
          <View style={styles.editHeaderLeft}>
            <Text style={styles.editHeaderTitle}>✏️  Edit Survey</Text>
            <Text style={styles.editHeaderSub}>
              Modify the fields below then save.
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.cancelEditBtn,
              pressed && { opacity: 0.75 },
            ]}
            onPress={handleCancelEdit}
          >
            <Text style={styles.cancelEditBtnText}>✕ Cancel</Text>
          </Pressable>
        </View>

        {/* Edit Form */}
        <View style={styles.editCard}>
          {/* Site Name */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Site Name *</Text>
            <TextInput
              style={styles.editInput}
              value={editDraft.siteName}
              onChangeText={(v) => handleDraftChange('siteName', v)}
              placeholder="Enter site name"
              placeholderTextColor="#4b5563"
            />
          </View>

          {/* Client Name */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Client Name *</Text>
            <TextInput
              style={styles.editInput}
              value={editDraft.clientName}
              onChangeText={(v) => handleDraftChange('clientName', v)}
              placeholder="Enter client name"
              placeholderTextColor="#4b5563"
            />
          </View>

          {/* Description */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Description</Text>
            <TextInput
              style={[styles.editInput, styles.editTextArea]}
              value={editDraft.description}
              onChangeText={(v) => handleDraftChange('description', v)}
              placeholder="Enter survey description"
              placeholderTextColor="#4b5563"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Priority */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {['Low', 'Medium', 'High'].map((p) => {
                const selected = editDraft.priority === p;
                const col = priorityColor(p);
                return (
                  <Pressable
                    key={p}
                    style={[
                      styles.priorityChip,
                      selected && {
                        backgroundColor: col + '22',
                        borderColor: col,
                      },
                    ]}
                    onPress={() => handleSelectPriority(p)}
                  >
                    <Text
                      style={[
                        styles.priorityChipText,
                        selected && { color: col, fontWeight: '700' },
                      ]}
                    >
                      {p}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Date */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Survey Date</Text>
            <TextInput
              style={styles.editInput}
              value={editDraft.date}
              onChangeText={(v) => handleDraftChange('date', v)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#4b5563"
            />
          </View>

          {/* Contact */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Contact Name</Text>
            <TextInput
              style={styles.editInput}
              value={editDraft.contact.name}
              onChangeText={(v) =>
                setEditDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, name: v },
                }))
              }
              placeholder="Contact person name"
              placeholderTextColor="#4b5563"
            />
          </View>

          <View style={styles.editField}>
            <Text style={styles.editLabel}>Contact Number</Text>
            <TextInput
              style={styles.editInput}
              value={editDraft.contact.number}
              onChangeText={(v) =>
                setEditDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, number: v },
                }))
              }
              placeholder="+91 XXXXX XXXXX"
              placeholderTextColor="#4b5563"
              keyboardType="phone-pad"
            />
          </View>

          {/* Notes */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Field Notes</Text>
            <TextInput
              style={[styles.editInput, styles.editTextArea]}
              value={editDraft.notes}
              onChangeText={(v) => handleDraftChange('notes', v)}
              placeholder="Add field notes..."
              placeholderTextColor="#4b5563"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              { marginTop: 8 },
              pressed && styles.primaryBtnPressed,
            ]}
            onPress={handleSaveEdit}
          >
            <Text style={styles.primaryBtnText}>💾  Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // ── PREVIEW MODE ──────────────────────────────────────────────────────────────
  return (
    <>
      <SuccessModal />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Page Header ── */}
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderLeft}>
            <Text style={styles.pageTitle}>Survey Preview</Text>
            <Text style={styles.pageSubtitle}>
              Review all details before submitting
            </Text>
          </View>
          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              {
                borderColor:
                  survey.status === 'Submitted' ? '#22c55e' : '#f97316',
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    survey.status === 'Submitted' ? '#22c55e' : '#f97316',
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    survey.status === 'Submitted' ? '#22c55e' : '#f97316',
                },
              ]}
            >
              {survey.status}
            </Text>
          </View>
        </View>

        {/* ── Survey ID Strip ── */}
        <View style={styles.idStrip}>
          <Text style={styles.idStripLabel}>SURVEY ID</Text>
          <Text style={styles.idStripValue}>{survey.id}</Text>
        </View>

        {/* ── 1. Site Details ── */}
        <View style={styles.card}>
          <SectionHeader icon="🏗️" title="Site Details" />
          <InfoRow label="Site Name" value={survey.siteName} />
          <InfoRow label="Survey Date" value={survey.date} mono />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Priority</Text>
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor: priorityColor(survey.priority) + '20',
                  borderColor: priorityColor(survey.priority),
                },
              ]}
            >
              <Text
                style={[
                  styles.priorityBadgeText,
                  { color: priorityColor(survey.priority) },
                ]}
              >
                {survey.priority}
              </Text>
            </View>
          </View>
          <View style={styles.descBox}>
            <Text style={styles.descLabel}>DESCRIPTION</Text>
            <Text style={styles.descValue}>{survey.description}</Text>
          </View>
        </View>

        {/* ── 2. Client ── */}
        <View style={styles.card}>
          <SectionHeader icon="👤" title="Client" />
          <InfoRow label="Client Name" value={survey.clientName} />
        </View>

        {/* ── 3. Photo ── */}
        <View style={styles.card}>
          <SectionHeader icon="📷" title="Site Photo" />
          {survey.photo ? (
            <View style={styles.photoWrapper}>
              <Image
                source={{ uri: survey.photo }}
                style={styles.photoImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.noPhotoBox}>
              <Text style={styles.noPhotoEmoji}>📷</Text>
              <Text style={styles.noPhotoText}>No photo attached</Text>
              <Text style={styles.noPhotoSub}>
                Capture a photo from the Camera module
              </Text>
            </View>
          )}
        </View>

        {/* ── 4. Contact ── */}
        <View style={styles.card}>
          <SectionHeader icon="📞" title="Contact" />
          <InfoRow label="Name" value={survey.contact.name} />
          <InfoRow label="Number" value={survey.contact.number} mono accent />
        </View>

        {/* ── 5. Location ── */}
        <View style={styles.card}>
          <SectionHeader icon="📍" title="Location" />
          {survey.location ? (
            <>
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
              <View style={styles.accuracyRow}>
                <Text style={styles.accuracyLabel}>ACCURACY</Text>
                <Text style={styles.accuracyValue}>
                  ± {survey.location.accuracy.toFixed(1)} m
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.noDataBox}>
              <Text style={styles.noDataText}>
                No location recorded. Visit the Location module to capture GPS
                coordinates.
              </Text>
            </View>
          )}
        </View>

        {/* ── 6. Notes ── */}
        <View style={styles.card}>
          <SectionHeader icon="📝" title="Field Notes" />
          {survey.notes ? (
            <Text style={styles.notesText}>{survey.notes}</Text>
          ) : (
            <View style={styles.noDataBox}>
              <Text style={styles.noDataText}>No notes added.</Text>
            </View>
          )}
        </View>

        {/* ── Submitted timestamp (if submitted) ── */}
        {survey.submittedAt && (
          <View style={styles.submittedBanner}>
            <Text style={styles.submittedBannerText}>
              ✅ Submitted on {survey.submittedAt}
            </Text>
          </View>
        )}

        {/* ── Action Buttons ── */}
        {!submitted ? (
          <View style={styles.actionRow}>
            {/* Edit Survey */}
            <Pressable
              style={({ pressed }) => [
                styles.editBtn,
                pressed && styles.editBtnPressed,
              ]}
              onPress={handleEdit}
            >
              <Text style={styles.editBtnText}>✏️  Edit Survey</Text>
            </Pressable>

            {/* Submit Survey */}
            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.submitBtnPressed,
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>📤  Submit Survey</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.dashboardBtn,
              pressed && { opacity: 0.82 },
            ]}
            onPress={() =>
              router.push('/(drawer)/(tabs)/Dashboard')
            }
          >
            <Text style={styles.dashboardBtnText}>🏠  Back to Dashboard</Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    paddingHorizontal: 14,
  },

  // ── Page Header
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 22,
    paddingBottom: 14,
  },
  pageHeaderLeft: { flex: 1, marginRight: 12 },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f97316',
    marginBottom: 2,
  },
  pageSubtitle: { fontSize: 13, color: '#6b7280' },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    gap: 6,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },

  // ID Strip
  idStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1f2b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 14,
    gap: 10,
  },
  idStripLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  idStripValue: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '700',
    fontFamily: 'monospace',
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

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2d3a',
    paddingBottom: 10,
  },
  sectionIcon: { fontSize: 18 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2130',
  },
  infoLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  monoText: { fontFamily: 'monospace', color: '#f97316', fontSize: 13 },

  // Description Box
  descBox: {
    backgroundColor: '#0f1117',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  descLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  descValue: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },

  // Priority Badge
  priorityBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  priorityBadgeText: { fontSize: 12, fontWeight: '700' },

  // Photo
  photoWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0f1117',
  },
  photoImage: { width: '100%', height: '100%' },
  noPhotoBox: {
    backgroundColor: '#0f1117',
    borderRadius: 12,
    paddingVertical: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2d3a',
    borderStyle: 'dashed',
  },
  noPhotoEmoji: { fontSize: 36, marginBottom: 8, opacity: 0.4 },
  noPhotoText: { color: '#4b5563', fontSize: 14, fontWeight: '600' },
  noPhotoSub: { color: '#374151', fontSize: 12, marginTop: 4 },

  // Coordinates
  coordRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
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
  coordValue: { fontSize: 16, fontWeight: '700', color: '#f97316' },
  accuracyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1117',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    gap: 10,
  },
  accuracyLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  accuracyValue: { fontSize: 14, color: '#e2e8f0', fontWeight: '600' },

  // Notes
  notesText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 22,
  },

  // No Data Box
  noDataBox: {
    backgroundColor: '#0f1117',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  noDataText: { color: '#4b5563', fontSize: 13, lineHeight: 18 },

  // Submitted Banner
  submittedBanner: {
    backgroundColor: '#052e16',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#16a34a44',
    marginBottom: 14,
    alignItems: 'center',
  },
  submittedBannerText: { color: '#4ade80', fontSize: 13, fontWeight: '700' },

  // Action Row
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#2a2d3a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b3f54',
  },
  editBtnPressed: { opacity: 0.8 },
  editBtnText: { color: '#f1f5f9', fontWeight: '700', fontSize: 15 },

  submitBtn: {
    flex: 2,
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnPressed: { opacity: 0.82 },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  dashboardBtn: {
    backgroundColor: '#1c1f2b',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 8,
  },
  dashboardBtnText: { color: '#f1f5f9', fontWeight: '700', fontSize: 15 },

  // ── Primary Button ─────────────────────────────────────────────────────────
  primaryBtn: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  primaryBtnPressed: { opacity: 0.82 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  // ── Edit Mode ──────────────────────────────────────────────────────────────
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 22,
    paddingBottom: 16,
  },
  editHeaderLeft: { flex: 1 },
  editHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f97316',
    marginBottom: 2,
  },
  editHeaderSub: { fontSize: 13, color: '#6b7280' },

  cancelEditBtn: {
    backgroundColor: '#2a2d3a',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#3b3f54',
  },
  cancelEditBtnText: { color: '#9ca3af', fontWeight: '700', fontSize: 13 },

  editCard: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    gap: 4,
  },
  editField: { marginBottom: 14 },
  editLabel: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: '#0f1117',
    color: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  editTextArea: {
    minHeight: 90,
    textAlignVertical: 'top',
    lineHeight: 22,
  },

  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityChip: {
    flex: 1,
    backgroundColor: '#0f1117',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    paddingVertical: 11,
    alignItems: 'center',
  },
  priorityChipText: { color: '#6b7280', fontWeight: '600', fontSize: 14 },

  // ── Success Modal ──────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#1c1f2b',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2d3a',
    width: '100%',
  },
  modalEmoji: { fontSize: 56, marginBottom: 16 },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
});
