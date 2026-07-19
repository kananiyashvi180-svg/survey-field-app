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
      if (typeof document !== 'undefined') {
        const dummyLoc = {
          coords: { latitude: 21.1702, longitude: 72.8311, accuracy: 5.0 },
          timestamp: Date.now(),
        };
        setLocation(dummyLoc);
        setIsLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } catch (_err) {
      setErrorMsg('Could not fetch location.');
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
    const lat = location.coords.latitude.toFixed(4);
    const lon = location.coords.longitude.toFixed(4);
    const textToCopy = 'Lat: ' + lat + ', Lon: ' + lon;
    await Clipboard.setStringAsync(textToCopy);
    Alert.alert('Location Copied', textToCopy);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Checking permissions...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Location Tracker</Text>
        <Text style={styles.text}>GPS coordinate capture</Text>

        {isLoading && (
          <View style={styles.card}>
            <ActivityIndicator size="large" />
            <Text style={styles.text}>Fetching GPS Coordinates...</Text>
          </View>
        )}

        {errorMsg && !isLoading && (
          <View style={styles.card}>
            <Text style={styles.text}>{errorMsg}</Text>
          </View>
        )}

        {!permission.granted && !isLoading && (
          <View style={styles.card}>
            <Text style={styles.text}>Location permission is required</Text>
            <Pressable style={styles.btn} onPress={handleRequestPermission}>
              <Text style={styles.btnText}>Grant Access</Text>
            </Pressable>
          </View>
        )}

        {permission.granted && !isLoading && (
          <View style={styles.card}>
            {location ? (
              <View>
                <Text style={styles.text}>Latitude: {location.coords.latitude.toFixed(4)}</Text>
                <Text style={styles.text}>Longitude: {location.coords.longitude.toFixed(4)}</Text>
                <Text style={styles.text}>Accuracy: {location.coords.accuracy ? location.coords.accuracy.toFixed(1) : 'N/A'}m</Text>
                <Text style={styles.text}>Time: {new Date(location.timestamp).toLocaleTimeString()}</Text>

                <Pressable style={styles.btn} onPress={fetchLocation}>
                  <Text style={styles.btnText}>Refresh Location</Text>
                </Pressable>

                <Pressable style={styles.btn} onPress={copyToClipboard}>
                  <Text style={styles.btnText}>Copy Location</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.btn} onPress={fetchLocation}>
                <Text style={styles.btnText}>Fetch Location</Text>
              </Pressable>
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
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    margin: 5,
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 12,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
