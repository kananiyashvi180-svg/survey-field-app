import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function SurveyScreen() {
  const router = useRouter();

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  };

  const [form, setForm] = useState({
    siteName: '',
    clientName: '',
    description: '',
    priority: '',
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
    if (!form.description.trim()) {
      tempErrors.description = 'Description is required';
      isValid = false;
    }
    if (!form.priority) {
      tempErrors.priority = 'Priority selection is required';
      isValid = false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!form.date.trim()) {
      tempErrors.date = 'Date is required';
      isValid = false;
    } else if (!dateRegex.test(form.date)) {
      tempErrors.date = 'Enter date in YYYY-MM-DD format';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert('Success', 'Survey for ' + form.siteName + ' has been created.');
      setForm({
        siteName: '',
        clientName: '',
        description: '',
        priority: '',
        date: getTodayDateString(),
      });
      setErrors({});
      router.navigate('/Dashboard');
    }
  };

  const selectPriority = (level) => {
    setForm({ ...form, priority: level });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Survey</Text>
        <Text style={styles.text}>Fill in the required information to record the field survey.</Text>

        <View style={styles.card}>
          <Text style={styles.text}>Site Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter project site name"
            placeholderTextColor="#6b7280"
            value={form.siteName}
            onChangeText={(val) => setForm({ ...form, siteName: val })}
          />
          {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.text}>Client Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter client name"
            placeholderTextColor="#6b7280"
            value={form.clientName}
            onChangeText={(val) => setForm({ ...form, clientName: val })}
          />
          {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.text}>Description *</Text>
          <TextInput
            style={styles.input}
            placeholder="Provide a detailed description..."
            placeholderTextColor="#6b7280"
            value={form.description}
            onChangeText={(val) => setForm({ ...form, description: val })}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.text}>Priority *</Text>
          <View style={styles.row}>
            {['Low', 'Medium', 'High'].map((level) => (
              <Pressable
                key={level}
                style={styles.chip}
                onPress={() => selectPriority(level)}
              >
                <Text style={styles.btnText}>{level}</Text>
              </Pressable>
            ))}
          </View>
          {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.text}>Survey Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#6b7280"
            value={form.date}
            onChangeText={(val) => setForm({ ...form, date: val })}
          />
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        <View style={styles.row}>
          <Pressable style={styles.btn} onPress={() => router.navigate('/Dashboard')}>
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Create Survey</Text>
          </Pressable>
        </View>
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  },
  chip: {
    backgroundColor: '#f97316',
    padding: 8,
    borderRadius: 15,
    margin: 5,
    flex: 1,
    alignItems: 'center',
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
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    margin: 5,
  },
});
