import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await Location.getForegroundPermissionsAsync();
        setPermission(response);
        if (response.granted) {
          fetchLocation();
        }
      } catch (_err) {
        setErrorMsg('Could not check permissions.');
      }
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
            setLocation({
              coords: {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              },
              timestamp: pos.timestamp,
            });
            setIsLoading(false);
          },
          (_err) => {
            setErrorMsg('Could not get location. Please allow browser location access.');
            setIsLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc);
    } catch (_err) {
      setErrorMsg('Could not fetch location. Make sure GPS is enabled.');
    }
    setIsLoading(false);
  };

  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const response = await Location.requestForegroundPermissionsAsync();
      setPermission(response);
      if (response.granted) {
        await fetchLocation();
      } else {
        setErrorMsg('Location permission denied.');
      }
    } catch (_err) {
      setErrorMsg('Error requesting permission.');
    }
    setIsLoading(false);
  };

  const copyToClipboard = async () => {
    if (!location) {
      Alert.alert('No Location', 'Please fetch the location first.');
      return;
    }
    const lat = location.coords.latitude.toFixed(6);
    const lon = location.coords.longitude.toFixed(6);
    const textToCopy = 'Lat: ' + lat + ', Lon: ' + lon;
    await Clipboard.setStringAsync(textToCopy);
    Alert.alert('Copied', 'Location copied to clipboard:\n' + textToCopy);
  };

  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.text}>Checking permissions...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Location Tracker</Text>
        <Text style={styles.text}>Capture real GPS coordinates for your survey.</Text>
      </View>

      {!permission.granted && (
        <View style={styles.card}>
          <Text style={styles.text}>Location permission is required to use this feature.</Text>
          <Pressable style={styles.btn} onPress={handleRequestPermission}>
            <Text style={styles.btnText}>Grant Location Access</Text>
          </Pressable>
        </View>
      )}

      {permission.granted && (
        <View>
          {isLoading && (
            <View style={styles.card}>
              <ActivityIndicator size="large" color="#f97316" />
              <Text style={styles.text}>Fetching GPS coordinates...</Text>
            </View>
          )}

          {errorMsg && !isLoading && (
            <View style={styles.card}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {location && !isLoading && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Current Location</Text>
              <View style={styles.coordRow}>
                <Text style={styles.coordLabel}>Latitude</Text>
                <Text style={styles.coordValue}>{location.coords.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.coordRow}>
                <Text style={styles.coordLabel}>Longitude</Text>
                <Text style={styles.coordValue}>{location.coords.longitude.toFixed(6)}</Text>
              </View>
              <View style={styles.coordRow}>
                <Text style={styles.coordLabel}>Accuracy</Text>
                <Text style={styles.coordValue}>
                  {location.coords.accuracy ? location.coords.accuracy.toFixed(1) + 'm' : 'N/A'}
                </Text>
              </View>
              <View style={styles.coordRow}>
                <Text style={styles.coordLabel}>Time</Text>
                <Text style={styles.coordValue}>
                  {new Date(location.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          )}

          {!location && !isLoading && !errorMsg && (
            <View style={styles.card}>
              <Text style={styles.text}>Press the button below to get your current location.</Text>
            </View>
          )}

          <View style={styles.btnGroup}>
            <Pressable style={styles.btn} onPress={fetchLocation} disabled={isLoading}>
              <Text style={styles.btnText}>{location ? 'Refresh Location' : 'Get Location'}</Text>
            </Pressable>
            {location && (
              <Pressable style={styles.btn} onPress={copyToClipboard}>
                <Text style={styles.btnText}>Copy to Clipboard</Text>
              </Pressable>
            )}
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
  centeredContainer: {
    flex: 1,
    backgroundColor: '#0b0d12',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginBottom: 5,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    color: '#9ca3af',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#0b0d12',
    borderRadius: 8,
  },
  coordLabel: {
    color: '#9ca3af',
    fontSize: 14,
  },
  coordValue: {
    color: '#f97316',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnGroup: {
    paddingVertical: 8,
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 14,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
