import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SurveyScreen() {
  const router = useRouter();

  // Helper to format today's date as YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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
      alert(`Success! Survey for "${form.siteName}" has been created.`);
      
      // Reset form
      setForm({
        siteName: '',
        clientName: '',
        description: '',
        priority: '',
        date: getTodayDateString(),
      });
      setErrors({});
      
      // Navigate back to Dashboard
      router.navigate('/(drawer)/(tabs)/Dashboard');
    }
  };

  const selectPriority = (level) => {
    setForm((prev) => ({ ...prev, priority: level }));
    if (errors.priority) {
      setErrors((prev) => ({ ...prev, priority: undefined }));
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>Create Survey</ThemedText>
        <ThemedText style={styles.subtitle}>Fill in the required information to record the field survey.</ThemedText>

        {/* Site Name Field */}
        <View style={styles.inputContainer}>
          <ThemedText type="defaultSemiBold" style={styles.label}>Site Name *</ThemedText>
          <TextInput
            style={[styles.input, errors.siteName ? styles.inputError : null]}
            placeholder="Enter project site name"
            placeholderTextColor="#6b7280"
            value={form.siteName}
            onChangeText={(val) => handleInputChange('siteName', val)}
          />
          {errors.siteName && <ThemedText style={styles.errorText}>{errors.siteName}</ThemedText>}
        </View>

        {/* Client Name Field */}
        <View style={styles.inputContainer}>
          <ThemedText type="defaultSemiBold" style={styles.label}>Client Name *</ThemedText>
          <TextInput
            style={[styles.input, errors.clientName ? styles.inputError : null]}
            placeholder="Enter client's full name"
            placeholderTextColor="#6b7280"
            value={form.clientName}
            onChangeText={(val) => handleInputChange('clientName', val)}
          />
          {errors.clientName && <ThemedText style={styles.errorText}>{errors.clientName}</ThemedText>}
        </View>

        {/* Description Field */}
        <View style={styles.inputContainer}>
          <ThemedText type="defaultSemiBold" style={styles.label}>Description *</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea, errors.description ? styles.inputError : null]}
            placeholder="Provide a detailed description of the survey task..."
            placeholderTextColor="#6b7280"
            multiline
            numberOfLines={4}
            value={form.description}
            onChangeText={(val) => handleInputChange('description', val)}
          />
          {errors.description && <ThemedText style={styles.errorText}>{errors.description}</ThemedText>}
        </View>

        {/* Priority Field */}
        <View style={styles.inputContainer}>
          <ThemedText type="defaultSemiBold" style={styles.label}>Priority *</ThemedText>
          <View style={styles.priorityGroup}>
            {['Low', 'Medium', 'High'].map((level) => {
              const isSelected = form.priority === level;
              let selectedColor = '#22c55e'; // Green for Low
              if (level === 'Medium') selectedColor = '#eab308'; // Yellow for Medium
              if (level === 'High') selectedColor = '#ef4444'; // Red for High

              return (
                <Pressable
                  key={level}
                  style={[
                    styles.priorityButton,
                    isSelected ? { backgroundColor: selectedColor, borderColor: selectedColor } : null,
                  ]}
                  onPress={() => selectPriority(level)}
                >
                  <ThemedText style={[styles.priorityButtonText, isSelected ? styles.selectedPriorityText : null]}>
                    {level}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          {errors.priority && <ThemedText style={styles.errorText}>{errors.priority}</ThemedText>}
        </View>

        {/* Date Field */}
        <View style={styles.inputContainer}>
          <ThemedText type="defaultSemiBold" style={styles.label}>Survey Date *</ThemedText>
          <TextInput
            style={[styles.input, errors.date ? styles.inputError : null]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#6b7280"
            value={form.date}
            onChangeText={(val) => handleInputChange('date', val)}
          />
          {errors.date && <ThemedText style={styles.errorText}>{errors.date}</ThemedText>}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.cancelButton} onPress={() => router.navigate('/(drawer)/(tabs)/Dashboard')}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </Pressable>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>Create Survey</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
  },
  scrollContainer: {
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  title: {
    color: '#f1f5f9',
    fontSize: 26,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#f1f5f9',
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#0f1117',
    color: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  priorityGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: '#0f1117',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    paddingVertical: 12,
    alignItems: 'center',
  },
  priorityButtonText: {
    color: '#9ca3af',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedPriorityText: {
    color: '#fff',
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2a2d3a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#f1f5f9',
    fontWeight: '600',
    fontSize: 15,
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#f97316',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
