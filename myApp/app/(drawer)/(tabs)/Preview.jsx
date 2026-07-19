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

const INITIAL_SURVEY = {
  id: 'SRV-2026-001',
  siteName: 'Field Survey – Plot A',
  clientName: 'Rajesh Patel',
  description: 'Comprehensive soil and crop assessment of Plot A.',
  priority: 'High',
  date: '2026-07-19',
  photo: null,
  contact: {
    name: 'Rajesh Patel',
    number: '+91 98765 43210',
  },
  location: {
    latitude: 23.0225,
    longitude: 72.5713,
    accuracy: 4.8,
  },
  notes: 'Soil moisture adequate. Irrigation pumps working.',
  status: 'Pending',
  submittedAt: null,
};

export default function PreviewScreen() {
  const router = useRouter();
  const [survey, setSurvey] = useState(INITIAL_SURVEY);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleSubmit = () => {
    Alert.alert(
      'Submit Survey',
      'Are you sure you want to submit?',
      [
        { text: 'Cancel' },
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

  if (isEditing && editDraft) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Survey</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.text}>Site Name *</Text>
          <TextInput
            style={styles.input}
            value={editDraft.siteName}
            onChangeText={(v) => setEditDraft({ ...editDraft, siteName: v })}
          />

          <Text style={styles.text}>Client Name *</Text>
          <TextInput
            style={styles.input}
            value={editDraft.clientName}
            onChangeText={(v) => setEditDraft({ ...editDraft, clientName: v })}
          />

          <Text style={styles.text}>Description</Text>
          <TextInput
            style={styles.input}
            value={editDraft.description}
            onChangeText={(v) => setEditDraft({ ...editDraft, description: v })}
          />

          <Text style={styles.text}>Priority</Text>
          <TextInput
            style={styles.input}
            value={editDraft.priority}
            onChangeText={(v) => setEditDraft({ ...editDraft, priority: v })}
          />

          <Text style={styles.text}>Survey Date</Text>
          <TextInput
            style={styles.input}
            value={editDraft.date}
            onChangeText={(v) => setEditDraft({ ...editDraft, date: v })}
          />

          <Text style={styles.text}>Contact Name</Text>
          <TextInput
            style={styles.input}
            value={editDraft.contact.name}
            onChangeText={(v) => setEditDraft({ ...editDraft, contact: { ...editDraft.contact, name: v } })}
          />

          <Text style={styles.text}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={editDraft.contact.number}
            onChangeText={(v) => setEditDraft({ ...editDraft, contact: { ...editDraft.contact, number: v } })}
          />

          <Text style={styles.text}>Field Notes</Text>
          <TextInput
            style={styles.input}
            value={editDraft.notes}
            onChangeText={(v) => setEditDraft({ ...editDraft, notes: v })}
          />

          <Pressable style={styles.btn} onPress={handleSaveEdit}>
            <Text style={styles.btnText}>Save Changes</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={handleCancelEdit}>
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Modal transparent visible={showSuccessModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Survey Submitted!</Text>
            <Text style={styles.text}>Submitted successfully.</Text>
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
        <Text style={styles.title}>Survey Preview</Text>
        <Text style={styles.text}>Status: {survey.status}</Text>
        <Text style={styles.text}>ID: {survey.id}</Text>
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
          <Text style={styles.text}>No photo attached</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.text}>Name: {survey.contact.name}</Text>
        <Text style={styles.text}>Number: {survey.contact.number}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location</Text>
        {survey.location ? (
          <View>
            <Text style={styles.text}>Lat: {survey.location.latitude}</Text>
            <Text style={styles.text}>Lon: {survey.location.longitude}</Text>
            <Text style={styles.text}>Accuracy: {survey.location.accuracy}m</Text>
          </View>
        ) : (
          <Text style={styles.text}>No location recorded</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Field Notes</Text>
        <Text style={styles.text}>{survey.notes || 'No notes'}</Text>
      </View>

      {!submitted ? (
        <View style={styles.row}>
          <Pressable style={styles.btn} onPress={handleEdit}>
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
    backgroundColor: '#0f1117',
    padding: 10,
  },
  card: {
    backgroundColor: '#1c1f2b',
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  title: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    margin: 5,
  },
  input: {
    backgroundColor: '#0f1117',
    color: '#ffffff',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 12,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    margin: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1117',
    padding: 20,
  },
});
