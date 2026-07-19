import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { surveyStore } from './Survey';

export const profileStore = {
  name: 'Yashvi Kanani',
  rollNo: 'SUK250054CE037',
  role: 'Active Surveyor',
  email: 'kananiyashvi.cg@gmail.com',
  phone: '+91 90165 22930',
  organization: 'GeoSpace Solutions Ltd.',
  assignment: 'Mini Project Assignment',
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState(profileStore);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({ ...profileStore });
  const [stats, setStats] = useState({ total: 0, high: 0, med: 0, low: 0 });

  useEffect(() => {
    // Calculate real stats from surveyStore
    let total = surveyStore.length;
    let high = 0;
    let med = 0;
    let low = 0;
    for (let i = 0; i < surveyStore.length; i++) {
      const s = surveyStore[i];
      if (s.priority === 'High') high++;
      else if (s.priority === 'Medium') med++;
      else if (s.priority === 'Low') low++;
    }
    setStats({ total, high, med, low });
  }, []);

  const handleSave = () => {
    if (!draft.name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    if (!draft.email.trim() || !draft.email.includes('@')) {
      Alert.alert('Validation Error', 'Enter a valid email.');
      return;
    }
    // Update global store
    profileStore.name = draft.name.trim();
    profileStore.rollNo = draft.rollNo.trim();
    profileStore.role = draft.role.trim();
    profileStore.email = draft.email.trim();
    profileStore.phone = draft.phone.trim();
    profileStore.organization = draft.organization.trim();

    setProfile({ ...profileStore });
    setEditMode(false);
    Alert.alert('Success', 'Profile updated successfully.');
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setEditMode(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>JP</Text>
          </View>
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraBadgeIcon}>📷</Text>
          </View>
        </View>

        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileRoll}>Roll No: {profile.rollNo}</Text>
        <Text style={styles.profileEmail}>{profile.email}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{profile.role}</Text>
        </View>

        {!editMode ? (
          <Pressable style={styles.outlineEditBtn} onPress={() => { setDraft({ ...profile }); setEditMode(true); }}>
            <Text style={styles.editBtnText}>✏️ Edit Profile</Text>
          </Pressable>
        ) : null}
      </View>

      {editMode ? (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Edit Profile Info</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={draft.name}
            onChangeText={(v) => setDraft({ ...draft, name: v })}
          />

          <Text style={styles.label}>Roll Number</Text>
          <TextInput
            style={styles.input}
            value={draft.rollNo}
            onChangeText={(v) => setDraft({ ...draft, rollNo: v })}
          />

          <Text style={styles.label}>Role</Text>
          <TextInput
            style={styles.input}
            value={draft.role}
            onChangeText={(v) => setDraft({ ...draft, role: v })}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={draft.email}
            onChangeText={(v) => setDraft({ ...draft, email: v })}
          />

          <View style={styles.btnRow}>
            <Pressable style={styles.btnSecondary} onPress={handleCancel}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={handleSave}>
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.sectionHeaderTitle}>Survey Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statsCard}>
                <Text style={[styles.statsNumber, { color: '#0ea5e9' }]}>{stats.total}</Text>
                <Text style={styles.statsLabel}>Total Audits</Text>
              </View>
              <View style={styles.statsCard}>
                <Text style={[styles.statsNumber, { color: '#ef4444' }]}>{stats.high}</Text>
                <Text style={styles.statsLabel}>High Priority</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statsCard}>
                <Text style={[styles.statsNumber, { color: '#f59e0b' }]}>{stats.med}</Text>
                <Text style={styles.statsLabel}>Med Priority</Text>
              </View>
              <View style={styles.statsCard}>
                <Text style={[styles.statsNumber, { color: '#10b981' }]}>{stats.low}</Text>
                <Text style={styles.statsLabel}>Low Priority</Text>
              </View>
            </View>
          </View>
        </View>
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
  profileCard: {
    backgroundColor: '#151821',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginVertical: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    // We mock the border color like the screenshot
    padding: 4,
  },
  avatarInitials: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0ea5e9',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadgeIcon: {
    fontSize: 14,
  },
  profileName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  profileRoll: {
    color: '#9ca3af',
    fontSize: 14,
    marginVertical: 2,
  },
  profileEmail: {
    color: '#9ca3af',
    fontSize: 13,
    marginVertical: 2,
  },
  roleBadge: {
    backgroundColor: '#0f2735',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginVertical: 12,
  },
  roleBadgeText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  outlineEditBtn: {
    borderColor: '#1e293b',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeaderTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    paddingLeft: 4,
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  statsLabel: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#151821',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
  },
  formTitle: {
    color: '#f97316',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0b0d12',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 14,
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnSecondary: {
    backgroundColor: '#374151',
    padding: 14,
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
