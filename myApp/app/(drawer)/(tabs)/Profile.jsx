import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    name: 'Yashvi Kanani',
    rollNo: 'SUK250054CE037',
    role: 'Lead Field Surveyor',
    email: 'yashvi.kanani@surveyfield.org',
    phone: '+91 98765 43210',
    organization: 'GeoSpace Solutions Ltd.',
  });

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({ ...profile });

  const handleSave = () => {
    if (!draft.name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    if (!draft.email.trim() || !draft.email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email.');
      return;
    }

    setProfile({ ...draft });
    setEditMode(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setEditMode(false);
  };

  const getInitials = (name) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Header Profile Section */}
      <View style={styles.avatarCard}>
        <View style={styles.avatarBg}>
          <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
        </View>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileRole}>{profile.role}</Text>
        <View style={styles.idBadge}>
          <Text style={styles.idBadgeText}>{profile.rollNo}</Text>
        </View>
      </View>

      {/* Info Form / Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>👤 Personal Information</Text>

        {editMode ? (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={draft.name}
                onChangeText={(v) => setDraft((p) => ({ ...p, name: v }))}
                placeholder="Enter full name"
                placeholderTextColor="#6b7280"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Role</Text>
              <TextInput
                style={styles.input}
                value={draft.role}
                onChangeText={(v) => setDraft((p) => ({ ...p, role: v }))}
                placeholder="Enter role"
                placeholderTextColor="#6b7280"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={draft.email}
                onChangeText={(v) => setDraft((p) => ({ ...p, email: v }))}
                placeholder="Enter email"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={draft.phone}
                onChangeText={(v) => setDraft((p) => ({ ...p, phone: v }))}
                placeholder="Enter phone number"
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Organization</Text>
              <TextInput
                style={styles.input}
                value={draft.organization}
                onChangeText={(v) => setDraft((p) => ({ ...p, organization: v }))}
                placeholder="Enter organization"
                placeholderTextColor="#6b7280"
              />
            </View>

            <View style={styles.btnRow}>
              <Pressable style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Organization</Text>
              <Text style={styles.infoValue}>{profile.organization}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile.phone}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Roll Number</Text>
              <Text style={styles.infoValue}>{profile.rollNo}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.editBtn, pressed && styles.editBtnPressed]}
              onPress={() => {
                setDraft({ ...profile });
                setEditMode(true);
              }}
            >
              <Text style={styles.editBtnText}>✏️  Edit Profile</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* App details card */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>⚙️ Assignment Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Assignment</Text>
          <Text style={styles.infoValue}>Mini Project Assignment</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </View>
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
    paddingBottom: 32,
  },
  avatarCard: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 16,
  },
  avatarBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#2a2d3a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
  },
  idBadge: {
    backgroundColor: '#2a2d3a',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#3b3f54',
  },
  idBadgeText: {
    color: '#f97316',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailsCard: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2d3a',
    paddingBottom: 8,
  },
  infoList: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f1117',
  },
  infoLabel: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '500',
  },
  editBtn: {
    backgroundColor: '#2a2d3a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#3b3f54',
  },
  editBtnPressed: {
    opacity: 0.85,
  },
  editBtnText: {
    color: '#f1f5f9',
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0f1117',
    color: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#2a2d3a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b3f54',
  },
  cancelBtnText: {
    color: '#f1f5f9',
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#f97316',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
