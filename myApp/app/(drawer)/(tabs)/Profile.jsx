import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
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
    const total = surveyStore.length;
    let high = 0, med = 0, low = 0;
    for (let i = 0; i < surveyStore.length; i++) {
      const s = surveyStore[i];
      if (s.priority === 'High') high++;
      else if (s.priority === 'Medium') med++;
      else if (s.priority === 'Low') low++;
    }
    setStats({ total, high, med, low });
  }, []);

  const handleSave = () => {
    if (!draft.name.trim()) { Alert.alert('Error', 'Name cannot be empty.'); return; }
    if (!draft.email.trim() || !draft.email.includes('@')) { Alert.alert('Error', 'Enter a valid email.'); return; }
    profileStore.name = draft.name.trim();
    profileStore.rollNo = draft.rollNo.trim();
    profileStore.role = draft.role.trim();
    profileStore.email = draft.email.trim();
    profileStore.phone = draft.phone.trim();
    profileStore.organization = draft.organization.trim();
    setProfile({ ...profileStore });
    setEditMode(false);
    Alert.alert('✅ Saved', 'Profile updated successfully.');
  };

  const initials = profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
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
        {!editMode && (
          <Pressable style={styles.editBtn} onPress={() => { setDraft({ ...profile }); setEditMode(true); }}>
            <Text style={styles.editBtnText}>✏️ Edit Profile</Text>
          </Pressable>
        )}
      </View>

      {/* Survey Statistics */}
      {!editMode && (
        <View>
          <Text style={styles.sectionTitle}>Survey Statistics</Text>
          <View style={styles.statsGrid}>
            {[
              { label: 'Total Audits', value: stats.total, color: '#0ea5e9' },
              { label: 'High Priority', value: stats.high, color: '#ef4444' },
              { label: 'Med Priority', value: stats.med, color: '#f97316' },
              { label: 'Low Priority', value: stats.low, color: '#22c55e' },
            ].map(item => (
              <View key={item.label} style={styles.statCard}>
                <Text style={[styles.statNumber, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>📋 Personal Information</Text>
            {[
              ['📱 Phone', profile.phone],
              ['🏢 Organization', profile.organization],
              ['📚 Assignment', profile.assignment],
            ].map(([label, value]) => (
              <View key={label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Edit Form */}
      {editMode && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>✏️ Edit Profile</Text>
          {[
            ['Full Name', 'name'],
            ['Roll Number', 'rollNo'],
            ['Role', 'role'],
            ['Email Address', 'email'],
            ['Phone Number', 'phone'],
            ['Organization', 'organization'],
          ].map(([label, key]) => (
            <View key={key}>
              <Text style={styles.fieldLabel}>{label}</Text>
              <TextInput
                style={styles.input}
                value={draft[key]}
                onChangeText={(v) => setDraft({ ...draft, [key]: v })}
                placeholder={label}
                placeholderTextColor="#4b5563"
              />
            </View>
          ))}
          <View style={styles.btnRow}>
            <Pressable style={styles.btnSecondary} onPress={() => { setDraft({ ...profile }); setEditMode(false); }}>
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.btnPrimary} onPress={handleSave}>
              <Text style={styles.btnPrimaryText}>💾 Save</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0d12', paddingHorizontal: 16, paddingTop: 16 },
  profileCard: { backgroundColor: '#151821', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  avatarContainer: { position: 'relative', marginBottom: 14 },
  avatarCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#0ea5e922', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0ea5e9' },
  avatarInitials: { color: '#0ea5e9', fontSize: 30, fontWeight: 'bold' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#f97316', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  cameraBadgeIcon: { fontSize: 12 },
  profileName: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  profileRoll: { color: '#9ca3af', fontSize: 13, marginBottom: 2 },
  profileEmail: { color: '#9ca3af', fontSize: 13, marginBottom: 10 },
  roleBadge: { backgroundColor: '#0ea5e922', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 12, borderWidth: 1, borderColor: '#0ea5e944' },
  roleBadgeText: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold' },
  editBtn: { borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  editBtnText: { color: '#9ca3af', fontSize: 14, fontWeight: 'bold' },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  statCard: { backgroundColor: '#151821', borderRadius: 12, padding: 16, width: '47%', margin: '1.5%', alignItems: 'center' },
  statNumber: { fontSize: 32, fontWeight: 'bold' },
  statLabel: { color: '#9ca3af', fontSize: 12, marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: '#151821', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardLabel: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#0b0d12' },
  infoLabel: { color: '#9ca3af', fontSize: 13 },
  infoValue: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', textAlign: 'right', flex: 1, marginLeft: 10 },
  fieldLabel: { color: '#9ca3af', fontSize: 13, fontWeight: 'bold', marginTop: 12, marginBottom: 5 },
  input: { backgroundColor: '#0b0d12', color: '#ffffff', padding: 12, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#1e293b' },
  btnRow: { flexDirection: 'row', marginTop: 16 },
  btnPrimary: { backgroundColor: '#f97316', padding: 14, borderRadius: 10, alignItems: 'center', flex: 1, marginLeft: 6 },
  btnPrimaryText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  btnSecondary: { backgroundColor: '#0b0d12', padding: 14, borderRadius: 10, alignItems: 'center', flex: 1, marginRight: 6, borderWidth: 1, borderColor: '#1e293b' },
  btnSecondaryText: { color: '#9ca3af', fontSize: 15, fontWeight: 'bold' },
});
