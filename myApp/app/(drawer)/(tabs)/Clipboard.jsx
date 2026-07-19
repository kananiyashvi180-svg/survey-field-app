import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';

export default function ClipboardScreen() {
  const [textInput, setTextInput] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [locationStr, setLocationStr] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const addToHistory = (label, value) => {
    const item = { id: Date.now().toString(), label, value, time: new Date().toLocaleTimeString() };
    setHistory((prev) => [item, ...prev.slice(0, 9)]);
  };

  const handleCopyText = async () => {
    if (!textInput.trim()) { Alert.alert('Empty', 'Please enter text to copy.'); return; }
    await Clipboard.setStringAsync(textInput.trim());
    addToHistory('Text', textInput.trim());
    Alert.alert('✅ Copied', 'Text copied to clipboard.');
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (!text) { Alert.alert('Empty', 'Nothing to paste.'); return; }
      setPastedText(text);
      setTextInput(text);
    } catch (_err) { Alert.alert('Error', 'Could not read clipboard.'); }
  };

  const handleClear = () => {
    Alert.alert('Clear All', 'Clear the text input and history?', [
      { text: 'Cancel' },
      {
        text: 'Clear', onPress: async () => {
          await Clipboard.setStringAsync('');
          setTextInput(''); setPastedText(''); setLocationStr(''); setHistory([]);
        }
      },
    ]);
  };

  const handleCopyLocation = async () => {
    setLocationLoading(true);
    try {
      if (typeof document !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const str = 'Lat: ' + pos.coords.latitude.toFixed(6) + ', Lon: ' + pos.coords.longitude.toFixed(6);
            setLocationStr(str);
            await Clipboard.setStringAsync(str);
            addToHistory('Location', str);
            Alert.alert('✅ Copied', str);
            setLocationLoading(false);
          },
          (_err) => { Alert.alert('Error', 'Could not get location.'); setLocationLoading(false); },
          { enableHighAccuracy: true, timeout: 10000 }
        );
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permission Denied', 'Location access required.'); setLocationLoading(false); return; }
      const loc = await Location.getCurrentPositionAsync({});
      const str = 'Lat: ' + loc.coords.latitude.toFixed(6) + ', Lon: ' + loc.coords.longitude.toFixed(6);
      setLocationStr(str);
      await Clipboard.setStringAsync(str);
      addToHistory('Location', str);
      Alert.alert('✅ Copied', str);
    } catch (_err) { Alert.alert('Error', 'Could not get location.'); }
    setLocationLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageIcon}>📋</Text>
        <View>
          <Text style={styles.pageTitle}>Clipboard</Text>
          <Text style={styles.pageSubtitle}>Copy, paste and manage field data</Text>
        </View>
      </View>

      {/* Text Copy / Paste Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>✏️ Text Input</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Type or paste text here..."
          placeholderTextColor="#4b5563"
          value={textInput}
          onChangeText={setTextInput}
          multiline
          numberOfLines={3}
        />
        {pastedText !== '' && (
          <View style={styles.pasteResult}>
            <Text style={styles.pasteLabel}>Last pasted:</Text>
            <Text style={styles.pasteValue}>{pastedText}</Text>
          </View>
        )}
        <View style={styles.btnRow}>
          <Pressable style={styles.btnPrimary} onPress={handleCopyText}>
            <Text style={styles.btnPrimaryText}>📋 Copy</Text>
          </Pressable>
          <Pressable style={styles.btnSecondary} onPress={handlePaste}>
            <Text style={styles.btnSecondaryText}>📥 Paste</Text>
          </Pressable>
          <Pressable style={styles.btnDanger} onPress={handleClear}>
            <Text style={styles.btnDangerText}>🗑️</Text>
          </Pressable>
        </View>
      </View>

      {/* Location Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>📍 Copy Current Location</Text>
        {locationStr ? (
          <View style={styles.coordDisplay}>
            <Text style={styles.coordText}>{locationStr}</Text>
          </View>
        ) : null}
        <Pressable style={styles.btnPrimary} onPress={handleCopyLocation} disabled={locationLoading}>
          {locationLoading
            ? <ActivityIndicator size="small" color="#ffffff" />
            : <Text style={styles.btnPrimaryText}>📍 Get & Copy Location</Text>
          }
        </Pressable>
      </View>

      {/* History Card */}
      <View style={styles.card}>
        <View style={styles.historyHeader}>
          <Text style={styles.cardLabel}>🕐 Copy History</Text>
          {history.length > 0 && (
            <Pressable onPress={handleClear}>
              <Text style={styles.clearLink}>Clear All</Text>
            </Pressable>
          )}
        </View>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No items copied yet.</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyLabel}>{item.label}</Text>
                <Text style={styles.historyValue} numberOfLines={2}>{item.value}</Text>
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
  container: { flex: 1, backgroundColor: '#0b0d12', paddingHorizontal: 16, paddingTop: 16 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  pageIcon: { fontSize: 28, marginRight: 12 },
  pageTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  pageSubtitle: { color: '#9ca3af', fontSize: 13, marginTop: 2 },
  card: { backgroundColor: '#151821', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardLabel: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#0b0d12', color: '#ffffff', padding: 12, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#1e293b' },
  textArea: { minHeight: 90, textAlignVertical: 'top', marginBottom: 10 },
  pasteResult: { backgroundColor: '#0b0d12', borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#1e293b' },
  pasteLabel: { color: '#9ca3af', fontSize: 11, marginBottom: 4 },
  pasteValue: { color: '#ffffff', fontSize: 13 },
  btnRow: { flexDirection: 'row', marginTop: 4 },
  btnPrimary: { backgroundColor: '#1cbdddff', padding: 13, borderRadius: 10, alignItems: 'center', flex: 1, marginRight: 6 },
  btnPrimaryText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  btnSecondary: { backgroundColor: '#0b0d12', padding: 13, borderRadius: 10, alignItems: 'center', flex: 1, marginRight: 6, borderWidth: 1, borderColor: '#1e293b' },
  btnSecondaryText: { color: '#9ca3af', fontSize: 14, fontWeight: 'bold' },
  btnDanger: { backgroundColor: '#ef444422', padding: 13, borderRadius: 10, alignItems: 'center', width: 48 },
  btnDangerText: { fontSize: 16 },
  coordDisplay: { backgroundColor: '#0b0d12', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' },
  coordText: { color: '#34c3f3ff', fontSize: 13, fontWeight: 'bold' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  clearLink: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },
  emptyText: { color: '#9ca3af', fontSize: 13 },
  historyItem: { backgroundColor: '#0b0d12', borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: '#1e293b' },
  historyLeft: { flex: 1, marginRight: 8 },
  historyLabel: { color: '#0ea5e9', fontSize: 11, fontWeight: 'bold', marginBottom: 3 },
  historyValue: { color: '#ffffff', fontSize: 13 },
  historyTime: { color: '#9ca3af', fontSize: 11 },
});
