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
    phone: '+91 91064 54707',
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
      Alert.alert('Validation Error', 'Enter a valid email.');
      return;
    }
    setProfile({ ...draft });
    setEditMode(false);
    Alert.alert('Success', 'Profile updated.');
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setEditMode(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>YK</Text>
        </View>
        <Text style={styles.title}>{profile.name}</Text>
        <Text style={styles.text}>{profile.role}</Text>
        <Text style={styles.text}>{profile.rollNo}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        {editMode ? (
          <View>
            <Text style={styles.text}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={draft.name}
              onChangeText={(v) => setDraft({ ...draft, name: v })}
            />

            <Text style={styles.text}>Role</Text>
            <TextInput
              style={styles.input}
              value={draft.role}
              onChangeText={(v) => setDraft({ ...draft, role: v })}
            />

            <Text style={styles.text}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={draft.email}
              onChangeText={(v) => setDraft({ ...draft, email: v })}
            />

            <Text style={styles.text}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={draft.phone}
              onChangeText={(v) => setDraft({ ...draft, phone: v })}
            />

            <Text style={styles.text}>Organization</Text>
            <TextInput
              style={styles.input}
              value={draft.organization}
              onChangeText={(v) => setDraft({ ...draft, organization: v })}
            />

            <View style={styles.row}>
              <Pressable style={styles.btn} onPress={handleCancel}>
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.btn} onPress={handleSave}>
                <Text style={styles.btnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.text}>Organization: {profile.organization}</Text>
            <Text style={styles.text}>Email: {profile.email}</Text>
            <Text style={styles.text}>Phone: {profile.phone}</Text>
            <Text style={styles.text}>Roll Number: {profile.rollNo}</Text>

            <Pressable style={styles.btn} onPress={() => { setDraft({ ...profile }); setEditMode(true); }}>
              <Text style={styles.btnText}>Edit Profile</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Assignment Details</Text>
        <Text style={styles.text}>Assignment: Mini Project Assignment</Text>
        <Text style={styles.text}>App Version: 1.0.0</Text>
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
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
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
    width: 250,
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
    width: 250,
  },
});
