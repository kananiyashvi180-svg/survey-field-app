import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await Location.getForegroundPermissionsAsync();
        setPermission(response);
        if (response.granted) fetchLocation();
      } catch (_err) { setErrorMsg('Could not check permissions.'); }
    };
    if (typeof document !== 'undefined') {
      setPermission({ granted: true });
    } else {
      checkPermission();
    }
  }, []);

  const fetchLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (typeof document !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({ coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy }, timestamp: pos.timestamp });
            setIsLoading(false);
          },
          (_err) => { setErrorMsg('Could not get location. Allow browser location access.'); setIsLoading(false); },
          { enableHighAccuracy: true, timeout: 10000 }
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc);
    } catch (_err) { setErrorMsg('Could not fetch location. Make sure GPS is enabled.'); }
    setIsLoading(false);
  };

  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const response = await Location.requestForegroundPermissionsAsync();
      setPermission(response);
      if (response.granted) await fetchLocation();
      else setErrorMsg('Location permission denied.');
    } catch (_err) { setErrorMsg('Error requesting permission.'); }
    setIsLoading(false);
  };

  const copyToClipboard = async () => {
    if (!location) { Alert.alert('No Location', 'Please fetch location first.'); return; }
    const lat = location.coords.latitude.toFixed(6);
    const lon = location.coords.longitude.toFixed(6);
    const text = 'Lat: ' + lat + ', Lon: ' + lon;
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('✅ Copied', text);
  };

  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageIcon}>📍</Text>
        <View>
          <Text style={styles.pageTitle}>Location GPS</Text>
          <Text style={styles.pageSubtitle}>Capture real GPS coordinates</Text>
        </View>
      </View>

      {/* Permission needed */}
      {!permission.granted && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>🔒 Permission Required</Text>
          <Text style={styles.bodyText}>Location access is required to use GPS tracking.</Text>
          <Pressable style={styles.btnPrimary} onPress={handleRequestPermission}>
            <Text style={styles.btnPrimaryText}>Grant Location Access</Text>
          </Pressable>
        </View>
      )}

      {permission.granted && (
        <View>
          {/* Current Location Card */}
          {location && !isLoading && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>📡 Current Location</Text>
              {[
                ['Latitude', location.coords.latitude.toFixed(6)],
                ['Longitude', location.coords.longitude.toFixed(6)],
                ['Accuracy', location.coords.accuracy ? location.coords.accuracy.toFixed(1) + ' m' : 'N/A'],
                ['Captured', new Date(location.timestamp).toLocaleTimeString()],
              ].map(([label, value]) => (
                <View key={label} style={styles.coordRow}>
                  <Text style={styles.coordLabel}>{label}</Text>
                  <Text style={styles.coordValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Error */}
          {errorMsg && !isLoading && (
            <View style={styles.errorCard}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Placeholder */}
          {!location && !isLoading && !errorMsg && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>📡 Location Data</Text>
              <Text style={styles.bodyText}>Press the button below to get your current GPS location.</Text>
            </View>
          )}

          {/* Loading */}
          {isLoading && (
            <View style={styles.card}>
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text style={styles.loadingText}>Fetching GPS coordinates...</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>🎛️ Controls</Text>
            <Pressable style={styles.btnPrimary} onPress={fetchLocation} disabled={isLoading}>
              <Text style={styles.btnPrimaryText}>
                {isLoading ? 'Fetching...' : location ? '🔄 Refresh Location' : '📍 Get Location'}
              </Text>
            </Pressable>
            {location && (
              <Pressable style={[styles.btnSecondary, { marginTop: 10 }]} onPress={copyToClipboard}>
                <Text style={styles.btnSecondaryText}>{copied ? '✅ Copied!' : '📋 Copy Coordinates'}</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0d12', paddingHorizontal: 16, paddingTop: 16 },
  centeredContainer: { flex: 1, backgroundColor: '#0b0d12', justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { color: '#9ca3af', fontSize: 14, marginTop: 12, textAlign: 'center' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  pageIcon: { fontSize: 28, marginRight: 12 },
  pageTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  pageSubtitle: { color: '#9ca3af', fontSize: 13, marginTop: 2 },
  card: { backgroundColor: '#151821', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardLabel: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
  bodyText: { color: '#9ca3af', fontSize: 14, lineHeight: 22, marginBottom: 12 },
  coordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0b0d12', borderRadius: 8, padding: 12, marginBottom: 8 },
  coordLabel: { color: '#9ca3af', fontSize: 13 },
  coordValue: { color: '#f97316', fontSize: 14, fontWeight: 'bold' },
  errorCard: { backgroundColor: '#ef444411', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  errorIcon: { fontSize: 20, marginRight: 10 },
  errorText: { color: '#ef4444', fontSize: 14, flex: 1 },
  btnPrimary: { backgroundColor: '#1cbdddff', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnPrimaryText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  btnSecondary: { backgroundColor: '#151821', padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  btnSecondaryText: { color: '#9ca3af', fontSize: 15, fontWeight: 'bold' },
});
