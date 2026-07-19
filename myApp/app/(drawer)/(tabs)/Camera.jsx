import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, Pressable, Image,
  ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { CameraView, getCameraPermissionsAsync, requestCameraPermissionsAsync } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [mediaPermission, setMediaPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [facing, setFacing] = useState('back');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cameraRef = useRef(null);

  useEffect(() => {
    const checkPermissions = async () => {
      if (typeof document === 'undefined') {
        const cam = await getCameraPermissionsAsync();
        setCameraPermission(cam);
        const media = await MediaLibrary.getPermissionsAsync();
        setMediaPermission(media);
      } else {
        setCameraPermission({ granted: true });
        setMediaPermission({ granted: true });
      }
      setIsLoading(false);
    };
    checkPermissions();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const taken = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (taken) setPhoto({ uri: taken.uri, timestamp: new Date().toLocaleTimeString(), fromGallery: false });
    } catch (_err) { Alert.alert('Error', 'Failed to take photo.'); }
  };

  const handleDelete = () => {
    if (typeof document !== 'undefined') {
      if (window.confirm('Discard this photo?')) setPhoto(null);
      return;
    }
    Alert.alert('Delete Photo', 'Discard this photo?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setPhoto(null) },
    ]);
  };

  const handleSaveToGallery = async () => {
    if (!photo) return;
    if (typeof document !== 'undefined') {
      setIsSaving(true);
      try {
        const link = document.createElement('a');
        link.href = photo.uri; link.download = 'photo.jpg';
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        Alert.alert('Saved', 'Photo downloaded.');
      } catch (_err) { Alert.alert('Error', 'Could not download photo.'); }
      setIsSaving(false);
      return;
    }
    if (!mediaPermission || !mediaPermission.granted) {
      const r = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(r);
      if (!r.granted) { Alert.alert('Permission Denied', 'Please allow gallery access.'); return; }
    }
    setIsSaving(true);
    try {
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      Alert.alert('✅ Saved', 'Photo saved to your gallery.');
    } catch (_err) { Alert.alert('Error', 'Could not save to gallery.'); }
    setIsSaving(false);
  };

  const handleSelectFromGallery = async () => {
    if (typeof document !== 'undefined') {
      try {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = 'image/*';
        input.onchange = (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setPhoto({ uri: ev.target.result, timestamp: new Date().toLocaleTimeString(), fromGallery: true });
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } catch (_err) { Alert.alert('Error', 'Could not load photo.'); }
      return;
    }
    if (!mediaPermission || !mediaPermission.granted) {
      const r = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(r);
      if (!r.granted) { Alert.alert('Permission Denied', 'Please allow gallery access.'); return; }
    }
    try {
      const assets = await MediaLibrary.getAssetsAsync({ mediaType: MediaLibrary.MediaType.photo, sortBy: [[MediaLibrary.SortBy.creationTime, false]], first: 1 });
      if (assets.assets.length === 0) { Alert.alert('No Photos', 'No photos found.'); return; }
      const info = await MediaLibrary.getAssetInfoAsync(assets.assets[0]);
      setPhoto({ uri: info.localUri || info.uri, timestamp: new Date().toLocaleTimeString(), fromGallery: true });
    } catch (_err) { Alert.alert('Error', 'Could not load photo.'); }
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!cameraPermission || !cameraPermission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permIcon}>📷</Text>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permSubtitle}>Grant permission to capture site photos</Text>
        <Pressable style={styles.btnPrimary} onPress={async () => {
          setIsLoading(true);
          const r = await requestCameraPermissionsAsync();
          setCameraPermission(r);
          setIsLoading(false);
        }}>
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
            <Text style={styles.pageSubtitle}>{photo.fromGallery ? 'Selected from Gallery' : 'Captured at ' + photo.timestamp}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Image source={{ uri: photo.uri }} style={styles.image} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>📁 Photo Actions</Text>
          <View style={styles.btnRow}>
            <Pressable style={styles.btnSecondary} onPress={() => setPhoto(null)}>
              <Text style={styles.btnSecondaryText}>🔄 Retake</Text>
            </Pressable>
            <Pressable style={styles.btnSecondary} onPress={handleSelectFromGallery}>
              <Text style={styles.btnSecondaryText}>🖼️ Gallery</Text>
            </Pressable>
          </View>
          <View style={styles.btnRow}>
            <Pressable style={[styles.btnSecondary, { borderColor: '#ef4444' }]} onPress={handleDelete}>
              <Text style={[styles.btnSecondaryText, { color: '#ef4444' }]}>🗑️ Delete</Text>
            </Pressable>
            <Pressable style={styles.btnPrimary} onPress={handleSaveToGallery} disabled={isSaving}>
              {isSaving
                ? <ActivityIndicator size="small" color="#ffffff" />
                : <Text style={styles.btnPrimaryText}>💾 Save to Gallery</Text>
              }
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

      <View style={styles.cameraCard}>
        <CameraView style={styles.camera} ref={cameraRef} facing={facing} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>🎛️ Camera Controls</Text>
        <View style={styles.btnRow}>
          <Pressable style={styles.btnPrimary} onPress={handleCapture}>
            <Text style={styles.btnPrimaryText}>📸 Capture</Text>
          </Pressable>
          <Pressable style={styles.btnSecondary} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
            <Text style={styles.btnSecondaryText}>🔄 Flip</Text>
          </Pressable>
          <Pressable style={styles.btnSecondary} onPress={handleSelectFromGallery}>
            <Text style={styles.btnSecondaryText}>🖼️ Gallery</Text>
          </Pressable>
        </View>
      </View>
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
  cameraCard: { backgroundColor: '#151821', borderRadius: 12, overflow: 'hidden', marginBottom: 12, height: 300 },
  camera: { flex: 1 },
  image: { width: '100%', height: 260, borderRadius: 8 },
  btnRow: { flexDirection: 'row', marginTop: 8 },
  btnPrimary: { backgroundColor: '#1cbdddff', padding: 13, borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  btnPrimaryText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  btnSecondary: { backgroundColor: '#151821', padding: 13, borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 4, borderWidth: 1, borderColor: '#1e293b' },
  btnSecondaryText: { color: '#9ca3af', fontSize: 14, fontWeight: 'bold' },
});
