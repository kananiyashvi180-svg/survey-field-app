import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';

const SAMPLE_HISTORY = [
  {
    id: 'SRV-2026-001',
    siteName: 'Field Survey – Plot A',
    clientName: 'Rajesh Patel',
    description: 'Comprehensive soil and crop assessment of Plot A.',
    priority: 'High',
    date: '2026-07-19',
    status: 'Submitted',
    contact: { name: 'Rajesh Patel', number: '+91 98765 43210' },
    location: { latitude: 23.0225, longitude: 72.5713, accuracy: 4.8 },
    notes: 'Soil moisture adequate. Irrigation pumps working.',
    submittedAt: '19/07/2026, 09:14:32 AM',
  },
  {
    id: 'SRV-2026-002',
    siteName: 'Soil Inspection – Zone B',
    clientName: 'Meena Shah',
    description: 'Detailed soil pH and nutrient test in Zone B.',
    priority: 'Medium',
    date: '2026-07-18',
    status: 'Submitted',
    contact: { name: 'Meena Shah', number: '+91 91234 56789' },
    location: { latitude: 23.0331, longitude: 72.5852, accuracy: 6.2 },
    notes: 'Recommend potassium-rich fertiliser application.',
    submittedAt: '18/07/2026, 04:45:10 PM',
  },
  {
    id: 'SRV-2026-003',
    siteName: 'Crop Assessment – Block C',
    clientName: 'Arjun Mehta',
    description: 'Crop yield estimation for cotton Block C.',
    priority: 'Low',
    date: '2026-07-17',
    status: 'Submitted',
    contact: { name: 'Arjun Mehta', number: '+91 99887 76655' },
    location: { latitude: 23.0107, longitude: 72.5609, accuracy: 3.1 },
    notes: 'Yield estimated at 85%. Pest pressure low.',
    submittedAt: '17/07/2026, 11:22:00 AM',
  },
  {
    id: 'SRV-2026-004',
    siteName: 'Water Source Check – Sector D',
    clientName: 'Priya Desai',
    description: 'Evaluated borewell depth and water quality.',
    priority: 'High',
    date: '2026-07-16',
    status: 'Pending',
    contact: { name: 'Priya Desai', number: '+91 93456 78901' },
    location: { latitude: 22.9984, longitude: 72.5446, accuracy: 5.5 },
    notes: 'Water salinity slightly above threshold.',
    submittedAt: null,
  },
];

export default function HistoryScreen() {
  const [surveys, setSurveys] = useState(SAMPLE_HISTORY);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const filteredSurveys = [];
  for (let i = 0; i < surveys.length; i++) {
    const s = surveys[i];
    const matchesFilter = activeFilter === 'All' || s.priority === activeFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q ||
      s.siteName.toLowerCase().includes(q) ||
      s.clientName.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.date.includes(q);

    if (matchesFilter && matchesQuery) {
      filteredSurveys.push(s);
    }
  }

  const handleDelete = (item) => {
    if (typeof window !== 'undefined' && typeof window.confirm !== 'undefined') {
      const confirmed = window.confirm('Delete survey ' + item.id + '?');
      if (confirmed) {
        setSurveys((prev) => prev.filter((s) => s.id !== item.id));
      }
      return;
    }
    Alert.alert(
      'Delete Survey',
      'Delete survey ' + item.id + '?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setSurveys((prev) => prev.filter((s) => s.id !== item.id));
          },
        },
      ]
    );
  };

  const total = surveys.length;
  let submitted = 0;
  let pending = 0;
  for (let i = 0; i < surveys.length; i++) {
    if (surveys[i].status === 'Submitted') {
      submitted++;
    } else {
      pending++;
    }
  }

  return (
    <View style={styles.container}>
      <Modal transparent visible={selectedSurvey !== null}>
        {selectedSurvey && (
          <View style={styles.modalOverlay}>
            <View style={styles.card}>
              <Text style={styles.title}>{selectedSurvey.siteName}</Text>
              <Text style={styles.text}>Survey ID: {selectedSurvey.id}</Text>
              <Text style={styles.text}>Priority: {selectedSurvey.priority}</Text>
              <Text style={styles.text}>Status: {selectedSurvey.status}</Text>
              <Text style={styles.text}>Client: {selectedSurvey.clientName}</Text>
              <Text style={styles.text}>Date: {selectedSurvey.date}</Text>
              <Text style={styles.text}>Description: {selectedSurvey.description}</Text>
              <Text style={styles.text}>Contact: {selectedSurvey.contact.name} ({selectedSurvey.contact.number})</Text>
              <Text style={styles.text}>Lat: {selectedSurvey.location.latitude}, Lon: {selectedSurvey.location.longitude}</Text>
              <Text style={styles.text}>Notes: {selectedSurvey.notes}</Text>
              {selectedSurvey.submittedAt && (
                <Text style={styles.text}>Submitted: {selectedSurvey.submittedAt}</Text>
              )}
              <Pressable style={styles.btn} onPress={() => setSelectedSurvey(null)}>
                <Text style={styles.btnText}>Close</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>

      <View style={styles.card}>
        <Text style={styles.title}>Survey History</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Total: {total}</Text>
          <Text style={styles.text}>Submitted: {submitted}</Text>
          <Text style={styles.text}>Pending: {pending}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by site, client, ID..."
          placeholderTextColor="#6b7280"
        />
      </View>

      <View style={styles.row}>
        {['All', 'High', 'Medium', 'Low'].map((p) => (
          <Pressable
            key={p}
            style={styles.chip}
            onPress={() => setActiveFilter(p)}
          >
            <Text style={styles.text}>{p}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.siteName}</Text>
            <Text style={styles.text}>ID: {item.id} | Status: {item.status}</Text>
            <Text style={styles.text}>Client: {item.clientName} | Date: {item.date}</Text>
            <View style={styles.row}>
              <Pressable style={styles.btn} onPress={() => setSelectedSurvey(item)}>
                <Text style={styles.btnText}>View</Text>
              </Pressable>
              <Pressable style={styles.btn} onPress={() => handleDelete(item)}>
                <Text style={styles.btnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    margin: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    margin: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  },
  input: {
    backgroundColor: '#0f1117',
    color: '#ffffff',
    padding: 10,
    borderRadius: 10,
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
    padding: 10,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1117',
    padding: 20,
  },
});
