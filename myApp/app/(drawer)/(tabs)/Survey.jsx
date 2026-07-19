import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, View, Text, Alert, ActivityIndicator } from 'react-native';
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
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
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
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const tempErrors = {};
    let isValid = true;
    if (!form.siteName.trim()) { tempErrors.siteName = 'Site Name is required'; isValid = false; }
    if (!form.clientName.trim()) { tempErrors.clientName = 'Client Name is required'; isValid = false; }
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setSubmitting(true);
    setTimeout(() => {
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
      setSubmitting(false);
      Alert.alert('✅ Survey Created', 'Survey for ' + form.siteName.trim() + ' has been saved.');
      setForm({ siteName: '', clientName: '', description: '', priority: 'Medium', date: getTodayDateString() });
      setErrors({});
      router.navigate('/History');
    }, 400);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageIcon}>📝</Text>
        <View>
          <Text style={styles.pageTitle}>Create Survey</Text>
          <Text style={styles.pageSubtitle}>Fill in the field survey details below</Text>
        </View>
      </View>

      {/* Survey Information Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>📋 Survey Information</Text>

        <Text style={styles.fieldLabel}>Site Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Metro Station Construction"
          placeholderTextColor="#4b5563"
          value={form.siteName}
          onChangeText={(val) => setForm({ ...form, siteName: val })}
        />
        {errors.siteName ? <Text style={styles.errorText}>{errors.siteName}</Text> : null}

        <Text style={styles.fieldLabel}>Client Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Infrastructure Dept"
          placeholderTextColor="#4b5563"
          value={form.clientName}
          onChangeText={(val) => setForm({ ...form, clientName: val })}
        />
        {errors.clientName ? <Text style={styles.errorText}>{errors.clientName}</Text> : null}

        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Provide a brief description of the site survey..."
          placeholderTextColor="#4b5563"
          value={form.description}
          onChangeText={(val) => setForm({ ...form, description: val })}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Priority Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>⚡ Priority Level</Text>
        <View style={styles.priorityRow}>
          {['Low', 'Medium', 'High'].map((level) => (
            <Pressable
              key={level}
              style={form.priority === level ? styles.chipSelected : styles.chip}
              onPress={() => setForm({ ...form, priority: level })}
            >
              <Text style={form.priority === level ? styles.chipTextSelected : styles.chipText}>{level}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Date Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>📅 Survey Date</Text>
        <TextInput
          style={styles.input}
          value={form.date}
          onChangeText={(val) => setForm({ ...form, date: val })}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#4b5563"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.btnRow}>
        <Pressable style={styles.btnSecondary} onPress={() => router.navigate('/Dashboard')}>
          <Text style={styles.btnSecondaryText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.btnPrimary} onPress={handleSubmit} disabled={submitting}>
          {submitting
            ? <ActivityIndicator size="small" color="#ffffff" />
            : <Text style={styles.btnPrimaryText}>Create Survey</Text>
          }
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
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  pageSubtitle: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardLabel: {
    color: '#0ea5e9',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  fieldLabel: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#0b0d12',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#0b0d12',
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  chipSelected: {
    backgroundColor: '#f97316',
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f97316',
  },
  chipText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chipTextSelected: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    marginVertical: 20,
    marginBottom: 40,
  },
  btnPrimary: {
    backgroundColor: '#f97316',
    padding: 14,
    marginLeft: 6,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnSecondary: {
    backgroundColor: '#151821',
    padding: 14,
    marginRight: 6,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  btnSecondaryText: {
    color: '#9ca3af',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
