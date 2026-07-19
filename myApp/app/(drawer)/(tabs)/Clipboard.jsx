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

export default function ClipboardScreen() {
  const [textInput, setTextInput] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [locationStr, setLocationStr] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const addToHistory = (label, value) => {
    const newItem = {
      id: Date.now().toString(),
      label: label,
      value: value,
      time: new Date().toLocaleTimeString(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 9)]);
  };

  const handleCopyText = async () => {
    if (!textInput.trim()) {
      Alert.alert('Empty', 'Please enter some text to copy.');
      return;
    }
    await Clipboard.setStringAsync(textInput.trim());
    addToHistory('Text', textInput.trim());
    Alert.alert('Copied', 'Text copied to clipboard.');
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (!text) {
        Alert.alert('Clipboard Empty', 'Nothing to paste.');
        return;
      }
      setPastedText(text);
      setTextInput(text);
      Alert.alert('Pasted', 'Text pasted from clipboard.');
    } catch (_err) {
      Alert.alert('Error', 'Could not read clipboard.');
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear',
      'Clear the text and history?',
      [
        { text: 'Cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            await Clipboard.setStringAsync('');
            setTextInput('');
            setPastedText('');
            setLocationStr('');
            setHistory([]);
            Alert.alert('Cleared', 'Clipboard and history cleared.');
          },
        },
      ]
    );
  };

  const handleCopyLocation = async () => {
    setLocationLoading(true);
    try {
      if (typeof document !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const str =
              'Lat: ' +
              pos.coords.latitude.toFixed(6) +
              ', Lon: ' +
              pos.coords.longitude.toFixed(6);
            setLocationStr(str);
            await Clipboard.setStringAsync(str);
            addToHistory('Location', str);
            Alert.alert('Copied', 'Location copied:\n' + str);
            setLocationLoading(false);
          },
          (_err) => {
            Alert.alert('Error', 'Could not get location. Allow browser location access.');
            setLocationLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        setLocationLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const str =
        'Lat: ' +
        loc.coords.latitude.toFixed(6) +
        ', Lon: ' +
        loc.coords.longitude.toFixed(6);
      setLocationStr(str);
      await Clipboard.setStringAsync(str);
      addToHistory('Location', str);
      Alert.alert('Copied', 'Location copied:\n' + str);
    } catch (_err) {
      Alert.alert('Error', 'Could not get location.');
    }
    setLocationLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Clipboard Manager</Text>
        <Text style={styles.text}>Copy, paste, and manage field data.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Text Copy / Paste</Text>
        <TextInput
          style={styles.input}
          placeholder="Type or paste text here..."
          placeholderTextColor="#6b7280"
          value={textInput}
          onChangeText={setTextInput}
          multiline
          numberOfLines={3}
        />
        <View style={styles.btnRow}>
          <Pressable style={styles.btn} onPress={handleCopyText}>
            <Text style={styles.btnText}>Copy</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={handlePaste}>
            <Text style={styles.btnText}>Paste</Text>
          </Pressable>
          <Pressable style={styles.btnSecondary} onPress={handleClear}>
            <Text style={styles.btnText}>Clear</Text>
          </Pressable>
        </View>
        {pastedText !== '' && (
          <View style={styles.pasteResult}>
            <Text style={styles.mutedText}>Last pasted:</Text>
            <Text style={styles.text}>{pastedText}</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Copy Current Location</Text>
        {locationStr ? (
          <Text style={styles.coordText}>{locationStr}</Text>
        ) : null}
        <Pressable style={styles.btn} onPress={handleCopyLocation} disabled={locationLoading}>
          {locationLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.btnText}>Get & Copy Location</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>Copy History</Text>
          {history.length > 0 && (
            <Pressable onPress={handleClear}>
              <Text style={styles.clearLink}>Clear All</Text>
            </Pressable>
          )}
        </View>
        {history.length === 0 ? (
          <Text style={styles.mutedText}>No items copied yet.</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyLabel}>{item.label}</Text>
                <Text style={styles.text}>{item.value}</Text>
              </View>
              <Text style={styles.historyTime}>{item.time}</Text>
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
    backgroundColor: '#0b0d12',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 4,
  },
  mutedText: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 4,
  },
  coordText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#0b0d12',
    color: '#ffffff',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 10,
    minHeight: 80,
  },
  btnRow: {
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 12,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnSecondary: {
    backgroundColor: '#374151',
    padding: 12,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pasteResult: {
    backgroundColor: '#0b0d12',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearLink: {
    color: '#f97316',
    fontSize: 13,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#0b0d12',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  historyLeft: {
    flex: 1,
    marginRight: 8,
  },
  historyLabel: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  historyTime: {
    color: '#6b7280',
    fontSize: 12,
  },
});
