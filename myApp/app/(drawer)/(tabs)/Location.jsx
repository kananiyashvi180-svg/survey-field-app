import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';

export default function LocationScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionResponse, requestPermission] = Location.useForegroundPermissions();

  const fetchLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Get the current location of the device
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(loc);
    } catch (error) {
      setErrorMsg(error.message || 'Could not fetch current location.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (permissionResponse && permissionResponse.granted) {
      fetchLocation();
    }
  }, [permissionResponse]);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const response = await requestPermission();
      if (!response.granted) {
        setErrorMsg('Location permission denied.');
      } else {
        await fetchLocation();
      }
    } catch (error) {
      setErrorMsg('Error requesting permission: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!location) {
      Alert.alert('No Location Data', 'Please fetch the location first.');
      return;
    }

    const { latitude, longitude, accuracy } = location.coords;
    const textToCopy = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}, Accuracy: ${accuracy ? accuracy.toFixed(1) : 'N/A'}m`;
    
    await Clipboard.setStringAsync(textToCopy);
    Alert.alert(
      'Location Copied',
      'Success! Coordinates copied to clipboard:\n\n' + textToCopy,
      [{ text: 'OK' }]
    );
  };

  // Determine permissions status
  const isPermissionGranted = permissionResponse?.granted;
  const isPermissionDenied = permissionResponse && !permissionResponse.granted && !permissionResponse.canAskAgain;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        {/* Header Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>📍</Text>
        </View>

        <Text style={styles.title}>Location Tracker</Text>
        <Text style={styles.subtitle}>
          Field Location Tracking Module for Surveyors. Detects GPS coordinates and accuracy level.
        </Text>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f97316" />
            <Text style={styles.loadingText}>Fetching GPS Coordinates...</Text>
          </View>
        )}

        {/* Error Messaging */}
        {errorMsg && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorLabel}>Error</Text>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* UI State: No Permission */}
        {!isPermissionGranted && !isLoading && (
          <View style={styles.permissionContainer}>
            <View style={styles.bannerInfo}>
              <Text style={styles.bannerEmoji}>🔓</Text>
              <Text style={styles.permissionTitle}>GPS Permission Required</Text>
              <Text style={styles.permissionDesc}>
                This module requires access to your device's location to record precise coordinates for field reports.
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
              onPress={handleRequestPermission}
            >
              <Text style={styles.buttonText}>Grant Location Access</Text>
            </Pressable>
          </View>
        )}

        {/* UI State: Permission Granted, Show Location Details */}
        {isPermissionGranted && !isLoading && (
          <View style={styles.dataContainer}>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: location ? '#22c55e' : '#eab308' }]} />
              <Text style={styles.statusText}>
                {location ? 'GPS Connected' : 'Waiting for GPS Signal...'}
              </Text>
            </View>

            {location ? (
              <>
                {/* Coordinates Row */}
                <View style={styles.coordinateRow}>
                  <View style={styles.coordBox}>
                    <Text style={styles.coordLabel}>LATITUDE</Text>
                    <Text style={styles.coordValue}>{location.coords.latitude.toFixed(6)}°</Text>
                  </View>
                  <View style={styles.coordBox}>
                    <Text style={styles.coordLabel}>LONGITUDE</Text>
                    <Text style={styles.coordValue}>{location.coords.longitude.toFixed(6)}°</Text>
                  </View>
                </View>

                {/* Accuracy Box */}
                <View style={styles.accuracyBox}>
                  <Text style={styles.accuracyLabel}>ESTIMATED ACCURACY</Text>
                  <Text style={styles.accuracyValue}>
                    ± {location.coords.accuracy ? location.coords.accuracy.toFixed(1) : 'N/A'} meters
                  </Text>
                  <Text style={styles.accuracyDesc}>
                    Lower numbers represent higher precision GPS details.
                  </Text>
                </View>

                {/* Date/Time Box */}
                <View style={styles.timeBox}>
                  <Text style={styles.timeLabel}>TIMESTAMP</Text>
                  <Text style={styles.timeValue}>
                    {new Date(location.timestamp).toLocaleString()}
                  </Text>
                </View>

                {/* Actions Group */}
                <View style={styles.actionsGroup}>
                  <Pressable
                    style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
                    onPress={fetchLocation}
                  >
                    <Text style={styles.secondaryButtonText}>🔄 Refresh GPS</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
                    onPress={copyToClipboard}
                  >
                    <Text style={styles.buttonText}>📋 Copy Coordinates</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No location captured yet.</Text>
                <Pressable
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
                  onPress={fetchLocation}
                >
                  <Text style={styles.buttonText}>Fetch Current GPS</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
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
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    color: '#f1f5f9',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorLabel: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 13,
  },
  permissionContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  bannerInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  permissionTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  permissionDesc: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  dataContainer: {
    marginTop: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1117',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#f1f5f9',
    fontSize: 12,
    fontWeight: '600',
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  coordBox: {
    flex: 0.48,
    backgroundColor: '#0f1117',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  coordLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  coordValue: {
    color: '#f97316',
    fontSize: 18,
    fontWeight: '700',
  },
  accuracyBox: {
    backgroundColor: '#0f1117',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 16,
  },
  accuracyLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  accuracyValue: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accuracyDesc: {
    color: '#6b7280',
    fontSize: 12,
  },
  timeBox: {
    backgroundColor: '#0f1117',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    marginBottom: 24,
  },
  timeLabel: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timeValue: {
    color: '#e2e8f0',
    fontSize: 13,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noDataText: {
    color: '#9ca3af',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  actionsGroup: {
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#2a2d3a',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#3f4354',
  },
  secondaryButtonPressed: {
    opacity: 0.85,
  },
  secondaryButtonText: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
