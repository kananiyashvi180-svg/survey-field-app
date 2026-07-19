import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, Pressable, Image,
  ActivityIndicator, Alert, ScrollView, Modal,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

export default function CameraScreen() {
  const isFocused = useIsFocused();
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [facing, setFacing] = useState('back');
  const [isLoading, setIsLoading] = useState(true);
  const cameraRef = useRef(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const status = await Camera.getCameraPermissionsAsync();
        setHasPermission(status.granted);
      } catch (error) {
        console.error('Error checking permission:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkPermission();
  }, []);

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const status = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status.granted);
      if (!status.granted) {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request camera permission.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCamera = () => {
    if (!hasPermission) {
      requestPermission();
      return;
    }
    setIsCameraActive(true);
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const data = await cameraRef.current.takePictureAsync({
        quality: 0.85,
      });
      if (data) {
        setPhoto(data.uri);
        setIsCameraActive(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  const handleRetake = () => {
    setPhoto(null);
    setIsCameraActive(true);
  };

  const handleDelete = () => {
    Alert.alert('Delete Photo', 'Are you sure you want to discard this photo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setPhoto(null) },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permIcon}>📷</Text>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permSubtitle}>Grant permission to capture site photos</Text>
        <Pressable style={styles.btnPrimary} onPress={requestPermission}>
          <Text style={styles.btnPrimaryText}>Grant Camera Access</Text>
        </Pressable>
      </View>
    );
  }

  if (photo) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageIcon}>📷</Text>
          <View>
            <Text style={styles.pageTitle}>Photo Preview</Text>
            <Text style={styles.pageSubtitle}>Inspection photo captured successfully</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Image source={{ uri: photo }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>📁 Photo Actions</Text>
          <View style={styles.btnRow}>
            <Pressable style={styles.btnSecondary} onPress={handleRetake}>
              <Text style={styles.btnSecondaryText}>🔄 Retake</Text>
            </Pressable>
            <Pressable style={[styles.btnSecondary, { borderColor: '#ef4444' }]} onPress={handleDelete}>
              <Text style={[styles.btnSecondaryText, { color: '#ef4444' }]}>🗑️ Delete</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageIcon}>📷</Text>
        <View>
          <Text style={styles.pageTitle}>Camera</Text>
          <Text style={styles.pageSubtitle}>Capture site photos for your survey</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>📷 Camera Status</Text>
        <Text style={styles.loadingText}>Ready to take field inspection photos.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>🎛️ Camera Controls</Text>
        <View style={styles.btnRow}>
          <Pressable style={styles.btnPrimary} onPress={handleOpenCamera}>
            <Text style={styles.btnPrimaryText}>📸 Open Camera</Text>
          </Pressable>
        </View>
      </View>

      <Modal visible={isCameraActive} animationType="slide" onRequestClose={() => setIsCameraActive(false)}>
        <View style={styles.cameraModalContainer}>
          {isFocused && (
            <View style={styles.cameraViewContainer}>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing={facing}
                ref={cameraRef}
              />
              <View style={styles.cameraOverlay}>
                <View style={styles.cameraTopBar}>
                  <Pressable style={styles.cameraControlBtn} onPress={() => setIsCameraActive(false)}>
                    <Text style={styles.cameraControlText}>Close</Text>
                  </Pressable>

                  <Pressable style={styles.cameraControlBtn} onPress={() => setFacing(prev => prev === 'back' ? 'front' : 'back')}>
                    <Text style={styles.cameraControlText}>Flip</Text>
                  </Pressable>
                </View>

                <View style={styles.cameraBottomBar}>
                  <Pressable style={styles.shutterBtn} onPress={handleCapture}>
                    <View style={styles.shutterInner} />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0d12', paddingHorizontal: 16, paddingTop: 16 },
  centeredContainer: { flex: 1, backgroundColor: '#0b0d12', justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { color: '#9ca3af', fontSize: 14, marginTop: 12 },
  permIcon: { fontSize: 48, marginBottom: 12 },
  permTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  permSubtitle: { color: '#9ca3af', fontSize: 14, marginBottom: 20, textAlign: 'center' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  pageIcon: { fontSize: 28, marginRight: 12 },
  pageTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  pageSubtitle: { color: '#9ca3af', fontSize: 13, marginTop: 2 },
  card: { backgroundColor: '#151821', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardLabel: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
  image: { width: '100%', height: 350, borderRadius: 8 },
  btnRow: { flexDirection: 'row', marginTop: 8 },
  btnPrimary: { backgroundColor: '#1cbdddff', padding: 13, borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  btnPrimaryText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  btnSecondary: { backgroundColor: '#151821', padding: 13, borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 4, borderWidth: 1, borderColor: '#1e293b' },
  btnSecondaryText: { color: '#9ca3af', fontSize: 14, fontWeight: 'bold' },
  cameraModalContainer: { flex: 1, backgroundColor: '#000' },
  cameraViewContainer: { flex: 1 },
  cameraOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', backgroundColor: 'transparent' },
  cameraTopBar: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 16 },
  cameraControlBtn: { backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  cameraControlText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  cameraBottomBar: { paddingBottom: 40, alignItems: 'center' },
  shutterBtn: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },
});
