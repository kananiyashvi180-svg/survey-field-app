import React, { useState, useEffect } from 'react';
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
import { surveyStore } from './Survey';

export default function PreviewScreen() {
  const router = useRouter();
  const [survey, setSurvey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (surveyStore.length > 0) {
      setSurvey({ ...surveyStore[0] });
    }
  }, []);

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
    const idx = surveyStore.findIndex((s) => s.id === editDraft.id);
    if (idx !== -1) {
      surveyStore[idx] = { ...editDraft };
    }
    setSurvey({ ...editDraft });
    setIsEditing(false);
    setEditDraft(null);
  };

  const handleSubmit = () => {
    Alert.alert(
      'Submit Survey',
      'Are you sure you want to submit this survey?',
      [
        { text: 'Cancel' },
        {
          text: 'Submit',
          onPress: () => {
            const now = new Date().toLocaleString();
            const updated = { ...survey, status: 'Submitted', submittedAt: now };
            const idx = surveyStore.findIndex((s) => s.id === survey.id);
            if (idx !== -1) {
              surveyStore[idx] = updated;
            }
            setSurvey(updated);
            setShowSuccessModal(true);
          },
        },
      ]
    );
  };

  if (!survey) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Survey to Preview</Text>
        <Text style={styles.emptyText}>Create a survey first to see it here.</Text>
        <Pressable style={styles.btn} onPress={() => router.push('/Survey')}>
          <Text style={styles.btnText}>Create Survey</Text>
        </Pressable>
      </View>
    );
  }

  if (isEditing && editDraft) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Survey</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Site Name *</Text>
          <TextInput
            style={styles.input}
            value={editDraft.siteName}
            onChangeText={(v) => setEditDraft({ ...editDraft, siteName: v })}
          />

          <Text style={styles.label}>Client Name *</Text>
          <TextInput
            style={styles.input}
            value={editDraft.clientName}
            onChangeText={(v) => setEditDraft({ ...editDraft, clientName: v })}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={editDraft.description}
            onChangeText={(v) => setEditDraft({ ...editDraft, description: v })}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Priority</Text>
          <TextInput
            style={styles.input}
            value={editDraft.priority}
            onChangeText={(v) => setEditDraft({ ...editDraft, priority: v })}
          />

          <Text style={styles.label}>Survey Date</Text>
          <TextInput
            style={styles.input}
            value={editDraft.date}
            onChangeText={(v) => setEditDraft({ ...editDraft, date: v })}
          />

          <Text style={styles.label}>Field Notes</Text>
          <TextInput
            style={styles.input}
            value={editDraft.notes}
            onChangeText={(v) => setEditDraft({ ...editDraft, notes: v })}
            multiline
            numberOfLines={3}
          />

          <View style={styles.btnRow}>
            <Pressable style={styles.btnSecondary} onPress={handleCancelEdit}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={handleSaveEdit}>
              <Text style={styles.btnText}>Save Changes</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Survey Submitted!</Text>
            <Text style={styles.text}>Survey submitted successfully.</Text>
            <Pressable
              style={styles.btn}
              onPress={() => {
                setShowSuccessModal(false);
                router.push('/(drawer)/(tabs)/Dashboard');
              }}
            >
              <Text style={styles.btnText}>Back to Dashboard</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Survey Preview</Text>
          <Text style={[
            styles.statusBadge,
            survey.status === 'Submitted' ? styles.statusSubmitted : styles.statusPending,
          ]}>
            {survey.status}
          </Text>
        </View>
        <Text style={styles.text}>ID: {survey.id}</Text>
        {survey.submittedAt ? (
          <Text style={styles.text}>Submitted: {survey.submittedAt}</Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Site Details</Text>
        <Text style={styles.text}>Site Name: {survey.siteName}</Text>
        <Text style={styles.text}>Client: {survey.clientName}</Text>
        <Text style={styles.text}>Date: {survey.date}</Text>
        <Text style={styles.text}>Priority: {survey.priority}</Text>
        <Text style={styles.text}>Description: {survey.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Site Photo</Text>
        {survey.photo ? (
          <Image source={{ uri: survey.photo }} style={styles.image} />
        ) : (
          <Text style={styles.mutedText}>No photo attached. Go to Camera to add a photo.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location</Text>
        {survey.location ? (
          <View>
            <Text style={styles.text}>Latitude: {survey.location.latitude}</Text>
            <Text style={styles.text}>Longitude: {survey.location.longitude}</Text>
            {survey.location.accuracy ? (
              <Text style={styles.text}>Accuracy: {survey.location.accuracy}m</Text>
            ) : null}
          </View>
        ) : (
          <Text style={styles.mutedText}>No location recorded. Go to Location to capture GPS.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Field Notes</Text>
        <Text style={styles.text}>{survey.notes || 'No notes added.'}</Text>
      </View>

      {survey.status !== 'Submitted' ? (
        <View style={styles.btnRow}>
          <Pressable style={styles.btnSecondary} onPress={handleEdit}>
            <Text style={styles.btnText}>Edit Survey</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Submit Survey</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.btn}
          onPress={() => router.push('/(drawer)/(tabs)/Dashboard')}
        >
          <Text style={styles.btnText}>Back to Dashboard</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0d12',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#0b0d12',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 4,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 4,
  },
  mutedText: {
    color: '#9ca3af',
    fontSize: 13,
  },
  input: {
    backgroundColor: '#0b0d12',
    color: '#ffffff',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 5,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 6,
  },
  statusSubmitted: {
    color: '#22c55e',
    backgroundColor: '#14532d',
  },
  statusPending: {
    color: '#f97316',
    backgroundColor: '#431407',
  },
  btnRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 14,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnSecondary: {
    backgroundColor: '#374151',
    padding: 14,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa',
    padding: 20,
  },
});
