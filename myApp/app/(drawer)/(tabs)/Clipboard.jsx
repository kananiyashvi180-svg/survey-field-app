import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';

const SAMPLE_SURVEYS = [
  { id: 'SRV-2026-001', site: 'Field Survey – Plot A', client: 'Rajesh Patel' },
  { id: 'SRV-2026-002', site: 'Soil Inspection – Zone B', client: 'Meena Shah' },
  { id: 'SRV-2026-003', site: 'Crop Assessment – Block C', client: 'Arjun Mehta' },
];

const SAMPLE_CONTACTS = [
  { name: 'Rajesh Patel', number: '+91 98765 43210' },
  { name: 'Meena Shah', number: '+91 91234 56789' },
  { name: 'Arjun Mehta', number: '+91 99887 76655' },
];

export default function ClipboardScreen() {
  const [selectedSurvey, setSelectedSurvey] = useState(SAMPLE_SURVEYS[0]);
  const [surveyCopied, setSurveyCopied] = useState(false);

  const [selectedContact, setSelectedContact] = useState(SAMPLE_CONTACTS[0]);
  const [contactCopied, setContactCopied] = useState(false);

  const [locationStr, setLocationStr] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationCopied, setLocationCopied] = useState(false);

  const [notes, setNotes] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [history, setHistory] = useState([]);

  const pushHistory = (label, value) => {
    const newItem = {
      id: Date.now().toString(),
      label: label,
      value: value,
      time: new Date().toLocaleTimeString(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 9)]);
  };

  const handleCopySurveyId = async () => {
    await Clipboard.setStringAsync(selectedSurvey.id);
    pushHistory('Survey ID', selectedSurvey.id);
    setSurveyCopied(true);
    setTimeout(() => setSurveyCopied(false), 1500);
  };

  const handleCopyContact = async () => {
    await Clipboard.setStringAsync(selectedContact.number);
    pushHistory('Contact', selectedContact.number);
    setContactCopied(true);
    setTimeout(() => setContactCopied(false), 1500);
  };

  const handleCopyLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        setLocationLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const str = 'Lat: ' + loc.coords.latitude.toFixed(4) + ', Lon: ' + loc.coords.longitude.toFixed(4);
      setLocationStr(str);
      await Clipboard.setStringAsync(str);
      pushHistory('Location', str);
      setLocationCopied(true);
      setTimeout(() => setLocationCopied(false), 1500);
    } catch (_err) {
      Alert.alert('Error', 'Could not get location.');
    }
    setLocationLoading(false);
  };

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (!text) {
      Alert.alert('Clipboard Empty', 'Nothing to paste.');
      return;
    }
    setPastedText(text);
    setNotes((prev) => (prev ? prev + '\n' + text : text));
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Clipboard',
      'Are you sure you want to clear everything?',
      [
        { text: 'Cancel' },
        {
          text: 'Clear All',
          onPress: async () => {
            await Clipboard.setStringAsync('');
            setNotes('');
            setPastedText('');
            setHistory([]);
            setLocationStr(null);
            setSurveyCopied(false);
            setContactCopied(false);
            setLocationCopied(false);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Clipboard Manager</Text>
        <Text style={styles.text}>Manage field data copying</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Copy Survey ID</Text>
        <View style={styles.row}>
          {SAMPLE_SURVEYS.map((s) => (
            <Pressable
              key={s.id}
              style={styles.chip}
              onPress={() => { setSelectedSurvey(s); setSurveyCopied(false); }}
            >
              <Text style={styles.text}>{s.id}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.text}>Site: {selectedSurvey.site}</Text>
          <Text style={styles.text}>Client: {selectedSurvey.client}</Text>
          <Text style={styles.text}>ID: {selectedSurvey.id}</Text>
        </View>
        <Pressable style={styles.btn} onPress={handleCopySurveyId}>
          <Text style={styles.btnText}>
            {surveyCopied ? 'Copied!' : 'Copy Survey ID'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Copy Contact Number</Text>
        <View style={styles.row}>
          {SAMPLE_CONTACTS.map((c) => (
            <Pressable
              key={c.number}
              style={styles.chip}
              onPress={() => { setSelectedContact(c); setContactCopied(false); }}
            >
              <Text style={styles.text}>{c.name}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.text}>Name: {selectedContact.name}</Text>
          <Text style={styles.text}>Number: {selectedContact.number}</Text>
        </View>
        <Pressable style={styles.btn} onPress={handleCopyContact}>
          <Text style={styles.btnText}>
            {contactCopied ? 'Copied!' : 'Copy Number'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Copy Current Location</Text>
        {locationStr && (
          <View style={styles.card}>
            <Text style={styles.text}>{locationStr}</Text>
          </View>
        )}
        <Pressable style={styles.btn} onPress={handleCopyLocation} disabled={locationLoading}>
          {locationLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.btnText}>
              {locationCopied ? 'Copied!' : 'Copy Location'}
            </Text>
          )}
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Paste Notes</Text>
        <TextInput
          style={styles.input}
          placeholder="Field notes will show here..."
          placeholderTextColor="#6b7280"
          value={notes}
          onChangeText={setNotes}
        />
        {pastedText !== '' && (
          <Text style={styles.text}>Last pasted: {pastedText}</Text>
        )}
        <Pressable style={styles.btn} onPress={handlePaste}>
          <Text style={styles.btnText}>Paste from Clipboard</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>History</Text>
          <Pressable style={styles.btn} onPress={handleClear}>
            <Text style={styles.btnText}>Clear All</Text>
          </Pressable>
        </View>
        {history.length === 0 ? (
          <Text style={styles.text}>No items copied yet</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.row}>
              <View>
                <Text style={styles.text}>{item.label}</Text>
                <Text style={styles.text}>{item.value}</Text>
              </View>
              <Text style={styles.text}>{item.time}</Text>
            </View>
          ))
        )}
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
  text: {
    color: '#ffffff',
    fontSize: 14,
    margin: 5,
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
  card: {
    backgroundColor: '#1c1f2b',
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  },
  chip: {
    backgroundColor: '#0f1117',
    padding: 8,
    borderRadius: 15,
    margin: 5,
    flex: 1,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 12,
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#0f1117',
    color: '#ffffff',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    height: 80,
  },
});
