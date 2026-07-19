import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export const surveyStore = [];

let surveyCounter = 1;

function generateId() {
  const id = 'SRV-' + new Date().getFullYear() + '-' + String(surveyCounter).padStart(3, '0');
  surveyCounter++;
  return id;
}

export default function SurveyScreen() {
  const router = useRouter();

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return dd + '/' + mm + '/' + yyyy;
  };

  const [form, setForm] = useState({
    siteName: '',
    clientName: '',
    description: '',
    priority: 'Medium',
    date: getTodayDateString(),
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const tempErrors = {};
    let isValid = true;

    if (!form.siteName.trim()) {
      tempErrors.siteName = 'Site Name is required';
      isValid = false;
    }
    if (!form.clientName.trim()) {
      tempErrors.clientName = 'Client Name is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newSurvey = {
      id: generateId(),
      siteName: form.siteName.trim(),
      clientName: form.clientName.trim(),
      description: form.description.trim() || 'No description provided.',
      priority: form.priority,
      date: form.date,
      status: 'Submitted',
      submittedAt: new Date().toLocaleString(),
      notes: '',
      photo: null,
      contact: { name: '', number: '' },
      location: null,
    };

    surveyStore.unshift(newSurvey);

    Alert.alert('Success', 'Survey for ' + form.siteName.trim() + ' has been created.');

    setForm({
      siteName: '',
      clientName: '',
      description: '',
      priority: 'Medium',
      date: getTodayDateString(),
    });
    setErrors({});

    router.navigate('/History');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionHeaderTitle}>Survey Information</Text>

        <Text style={styles.label}>Site Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Metro Station Construction"
          placeholderTextColor="#4b5563"
          value={form.siteName}
          onChangeText={(val) => setForm({ ...form, siteName: val })}
        />
        {errors.siteName ? <Text style={styles.errorText}>{errors.siteName}</Text> : null}

        <Text style={styles.label}>Client Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Infrastructure Dept"
          placeholderTextColor="#4b5563"
          value={form.clientName}
          onChangeText={(val) => setForm({ ...form, clientName: val })}
        />
        {errors.clientName ? <Text style={styles.errorText}>{errors.clientName}</Text> : null}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Provide a brief description of the site survey..."
          placeholderTextColor="#4b5563"
          value={form.description}
          onChangeText={(val) => setForm({ ...form, description: val })}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Priority Level</Text>
        <View style={styles.priorityRow}>
          {['Low', 'Medium', 'High'].map((level) => (
            <Pressable
              key={level}
              style={form.priority === level ? styles.chipSelected : styles.chip}
              onPress={() => setForm({ ...form, priority: level })}
            >
              <Text style={styles.chipText}>{level}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Survey Date</Text>
        <TextInput
          style={styles.input}
          value={form.date}
          onChangeText={(val) => setForm({ ...form, date: val })}
        />
      </View>

      <Text style={styles.sectionTitle}>Attach Site Artifacts</Text>

      <View style={styles.btnRow}>
        <Pressable style={styles.btnSecondary} onPress={() => router.navigate('/Dashboard')}>
          <Text style={styles.btnText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Create Survey</Text>
        </Pressable>
      </View>
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
  card: {
    backgroundColor: '#151821',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
  },
  sectionHeaderTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    paddingLeft: 4,
  },
  label: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0b0d12',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
  },
  priorityRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#1c1f2b',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: '#f97316',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnRow: {
    flexDirection: 'row',
    marginVertical: 20,
    marginBottom: 40,
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
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
});
