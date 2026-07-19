import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, StyleSheet, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { surveyStore } from './Survey';

export default function PreviewScreen() {
  const router = useRouter();
  const [survey, setSurvey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (surveyStore.length > 0) setSurvey({ ...surveyStore[0] });
  }, []);

  const handleSaveEdit = () => {
    if (!editDraft.siteName.trim()) { Alert.alert('Error', 'Site Name cannot be empty.'); return; }
    if (!editDraft.clientName.trim()) { Alert.alert('Error', 'Client Name cannot be empty.'); return; }
    const idx = surveyStore.findIndex(s => s.id === editDraft.id);
    if (idx !== -1) surveyStore[idx] = { ...editDraft };
    setSurvey({ ...editDraft });
    setIsEditing(false);
    setEditDraft(null);
  };

  const handleSubmit = () => {
    Alert.alert('Submit Survey', 'Are you sure you want to submit?', [
      { text: 'Cancel' },
      {
        text: 'Submit', onPress: () => {
          const now = new Date().toLocaleString();
          const updated = { ...survey, status: 'Submitted', submittedAt: now };
          const idx = surveyStore.findIndex(s => s.id === survey.id);
          if (idx !== -1) surveyStore[idx] = updated;
          setSurvey(updated);
          setShowSuccessModal(true);
        }
      },
    ]);
  };

  if (!survey) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>No Survey to Preview</Text>
        <Text style={styles.emptySubtext}>Create a survey first to see a preview here.</Text>
        <Pressable style={styles.btnPrimary} onPress={() => router.push('/Survey')}>
          <Text style={styles.btnPrimaryText}>📝 Create Survey</Text>
        </Pressable>
      </View>
    );
  }

  if (isEditing && editDraft) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageIcon}>✏️</Text>
          <View>
            <Text style={styles.pageTitle}>Edit Survey</Text>
            <Text style={styles.pageSubtitle}>Update the survey details</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>📋 Survey Details</Text>
          {[
            ['Site Name *', 'siteName', 'e.g. Metro Station'],
            ['Client Name *', 'clientName', 'e.g. City Infrastructure'],
            ['Description', 'description', 'Brief description...'],
            ['Priority', 'priority', 'Low / Medium / High'],
            ['Survey Date', 'date', 'DD/MM/YYYY'],
          ].map(([label, key, placeholder]) => (
            <View key={key}>
              <Text style={styles.fieldLabel}>{label}</Text>
              <TextInput
                style={styles.input}
                value={editDraft[key]}
                onChangeText={(v) => setEditDraft({ ...editDraft, [key]: v })}
                placeholder={placeholder}
                placeholderTextColor="#4b5563"
              />
            </View>
          ))}
          <Text style={styles.fieldLabel}>Field Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={editDraft.notes}
            onChangeText={(v) => setEditDraft({ ...editDraft, notes: v })}
            placeholder="Additional notes..."
            placeholderTextColor="#4b5563"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.btnRow}>
          <Pressable style={styles.btnSecondary} onPress={() => { setIsEditing(false); setEditDraft(null); }}>
            <Text style={styles.btnSecondaryText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.btnPrimary} onPress={handleSaveEdit}>
            <Text style={styles.btnPrimaryText}>💾 Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const statusColor = survey.status === 'Submitted' ? '#22c55e' : '#f97316';

  return (
    <ScrollView style={styles.container}>
      {/* Success Modal */}
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalIcon}>✅</Text>
            <Text style={styles.modalTitle}>Survey Submitted!</Text>
            <Text style={styles.modalSubtitle}>Survey successfully submitted and recorded.</Text>
            <Pressable style={styles.btnPrimary} onPress={() => { setShowSuccessModal(false); router.push('/Dashboard'); }}>
              <Text style={styles.btnPrimaryText}>Back to Dashboard</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageIcon}>👁️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Survey Preview</Text>
          <Text style={styles.pageSubtitle}>Review before submitting</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>{survey.status}</Text>
        </View>
      </View>

      {/* Survey ID Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>🆔 Survey ID</Text>
        <Text style={styles.idText}>{survey.id}</Text>
        {survey.submittedAt && <Text style={styles.bodyText}>Submitted: {survey.submittedAt}</Text>}
      </View>

      {/* Site Details Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>📋 Site Details</Text>
        {[
          ['Site Name', survey.siteName],
          ['Client', survey.clientName],
          ['Date', survey.date],
          ['Priority', survey.priority],
          ['Description', survey.description],
        ].map(([label, value]) => (
          <View key={label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Site Photo Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>📷 Site Photo</Text>
        {survey.photo
          ? <Image source={{ uri: survey.photo }} style={styles.image} />
          : <Text style={styles.mutedText}>No photo attached. Go to Camera to add a photo.</Text>
        }
      </View>

      {/* Location Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>📍 Location</Text>
        {survey.location ? (
          <View>
            {[
              ['Latitude', survey.location.latitude],
              ['Longitude', survey.location.longitude],
              ...(survey.location.accuracy ? [['Accuracy', survey.location.accuracy + ' m']] : []),
            ].map(([label, value]) => (
              <View key={label} style={styles.coordRow}>
                <Text style={styles.coordLabel}>{label}</Text>
                <Text style={styles.coordValue}>{value}</Text>
              </View>
            ))}
          </View>
        ) : <Text style={styles.mutedText}>No location recorded. Go to Location to capture GPS.</Text>}
      </View>

      {/* Notes Card */}
      {survey.notes ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>📝 Field Notes</Text>
          <Text style={styles.bodyText}>{survey.notes}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      {survey.status !== 'Submitted' ? (
        <View style={styles.btnRow}>
          <Pressable style={styles.btnSecondary} onPress={() => { setEditDraft({ ...survey }); setIsEditing(true); }}>
            <Text style={styles.btnSecondaryText}>✏️ Edit</Text>
          </Pressable>
          <Pressable style={styles.btnPrimary} onPress={handleSubmit}>
            <Text style={styles.btnPrimaryText}>✅ Submit Survey</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={[styles.btnSecondary, { marginBottom: 40 }]} onPress={() => router.push('/Dashboard')}>
          <Text style={styles.btnSecondaryText}>← Back to Dashboard</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0d12', paddingHorizontal: 16, paddingTop: 16 },
  centeredContainer: { flex: 1, backgroundColor: '#0b0d12', justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  emptySubtext: { color: '#9ca3af', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  pageIcon: { fontSize: 28, marginRight: 12 },
  pageTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  pageSubtitle: { color: '#9ca3af', fontSize: 13, marginTop: 2 },
  card: { backgroundColor: '#151821', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardLabel: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
  idText: { color: '#f97316', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  bodyText: { color: '#9ca3af', fontSize: 13, lineHeight: 20 },
  mutedText: { color: '#9ca3af', fontSize: 13 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#0b0d12' },
  detailLabel: { color: '#9ca3af', fontSize: 13, flex: 1 },
  detailValue: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', flex: 1.5, textAlign: 'right' },
  coordRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0b0d12', borderRadius: 8, padding: 10, marginBottom: 6 },
  coordLabel: { color: '#9ca3af', fontSize: 13 },
  coordValue: { color: '#f97316', fontSize: 13, fontWeight: 'bold' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold' },
  image: { width: '100%', height: 220, borderRadius: 8 },
  fieldLabel: { color: '#9ca3af', fontSize: 13, fontWeight: 'bold', marginTop: 12, marginBottom: 5 },
  input: { backgroundColor: '#0b0d12', color: '#ffffff', padding: 12, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#1e293b' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  btnRow: { flexDirection: 'row', marginVertical: 10, marginBottom: 16 },
  btnPrimary: { backgroundColor: '#f97316', padding: 14, borderRadius: 10, alignItems: 'center', flex: 1, marginLeft: 6 },
  btnPrimaryText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  btnSecondary: { backgroundColor: '#151821', padding: 14, borderRadius: 10, alignItems: 'center', flex: 1, marginRight: 6, borderWidth: 1, borderColor: '#1e293b' },
  btnSecondaryText: { color: '#9ca3af', fontSize: 15, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000bb', padding: 24 },
  modalCard: { backgroundColor: '#151821', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center' },
  modalIcon: { fontSize: 48, marginBottom: 12 },
  modalTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  modalSubtitle: { color: '#9ca3af', fontSize: 14, textAlign: 'center', marginBottom: 20 },
});
