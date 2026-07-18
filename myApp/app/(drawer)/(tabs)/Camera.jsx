import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  const [photo, setPhoto] = useState(null);          // captured/selected photo
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [facing, setFacing] = useState('back');       // 'back' | 'front'

  const cameraRef = useRef(null);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const formatTimestamp = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleCapture = async () => {
    if (!cameraRef.current || !isCameraReady || isCapturing) return;
    setIsCapturing(true);
    try {
      const taken = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (taken) {
        setPhoto({ uri: taken.uri, timestamp: formatTimestamp(new Date()), fromGallery: false });
      }
    } catch (e) {
      Alert.alert('Capture Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFlip = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const handleRetake = () => setPhoto(null);

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to discard this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setPhoto(null) },
      ],
      { cancelable: true }
    );
  };

  const handleSaveToGallery = async () => {
    if (!photo) return;

    // Ensure media permission
    if (!mediaPermission?.granted) {
      const response = await requestMediaPermission();
      if (!response.granted) {
        Alert.alert('Permission Denied', 'Please allow access to your media library to save photos.');
        return;
      }
    }

    setIsSaving(true);
    try {
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      Alert.alert(
        '✅ Saved to Gallery',
        'The photo has been successfully saved to your device gallery.',
        [{ text: 'OK' }]
      );
    } catch (e) {
      Alert.alert('Save Failed', 'Could not save the photo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectFromGallery = async () => {
    // Ensure media permission
    if (!mediaPermission?.granted) {
      const response = await requestMediaPermission();
      if (!response.granted) {
        Alert.alert('Permission Denied', 'Please allow access to your media library to select photos.');
        return;
      }
    }

    try {
      // Get the most recent photo from the gallery
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        first: 1,
      });

      if (assets.assets.length === 0) {
        Alert.alert('No Photos', 'No photos found in your gallery.');
        return;
      }

      // Get full asset info with localUri
      const assetInfo = await MediaLibrary.getAssetInfoAsync(assets.assets[0]);
      const uri = assetInfo.localUri || assetInfo.uri;

      setPhoto({ uri, timestamp: formatTimestamp(new Date()), fromGallery: true });
    } catch (e) {
      Alert.alert('Gallery Error', 'Could not load photos from gallery.');
    }
  };

  // ── Permission: Camera not yet resolved ──────────────────────────────────────
  if (!cameraPermission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Checking permissions…</Text>
      </View>
    );
  }

  // ── Permission: Camera denied ────────────────────────────────────────────────
  if (!cameraPermission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.permCard}>
          <Text style={styles.permEmoji}>📷</Text>
          <Text style={styles.title}>Camera Access Required</Text>
          <Text style={styles.subtitle}>
            We need camera access to capture field photos for your survey reports.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
            onPress={requestCameraPermission}
          >
            <Text style={styles.primaryBtnText}>Grant Camera Access</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Photo Preview ────────────────────────────────────────────────────────────
  if (photo) {
    return (
      <ScrollView
        style={styles.bgDark}
        contentContainerStyle={styles.previewScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewCard}>
          {/* Header */}
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>
              {photo.fromGallery ? '🖼️  Gallery Photo' : '📷  Photo Preview'}
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🕒 {photo.timestamp}</Text>
              </View>
              {photo.fromGallery && (
                <View style={[styles.badge, styles.galleryBadge]}>
                  <Text style={styles.badgeText}>From Gallery</Text>
                </View>
              )}
            </View>
          </View>

          {/* Image */}
          <View style={styles.imageWrapper}>
            <Image source={{ uri: photo.uri }} style={styles.previewImage} resizeMode="cover" />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionGrid}>
            {/* Row 1 – Retake & Delete */}
            <View style={styles.btnRow}>
              <Pressable
                style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
                onPress={handleRetake}
              >
                <Text style={styles.secondaryBtnText}>🔄  Retake</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.dangerBtn, pressed && styles.dangerBtnPressed]}
                onPress={handleDelete}
              >
                <Text style={styles.dangerBtnText}>🗑️  Delete</Text>
              </Pressable>
            </View>

            {/* Row 2 – Select from Gallery */}
            <Pressable
              style={({ pressed }) => [styles.outlineBtn, pressed && styles.outlineBtnPressed]}
              onPress={handleSelectFromGallery}
            >
              <Text style={styles.outlineBtnText}>🖼️  Select from Gallery</Text>
            </Pressable>

            {/* Row 3 – Save to Gallery */}
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
              onPress={handleSaveToGallery}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>💾  Save to Gallery</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ── Active Camera View ───────────────────────────────────────────────────────
  return (
    <View style={styles.cameraContainer}>
      {/* Camera Loading Overlay */}
      {!isCameraReady && (
        <View style={styles.cameraLoadingOverlay}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>Opening Camera…</Text>
        </View>
      )}

      <CameraView
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        facing={facing}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.cameraOverlay}>
          {/* Top Bar */}
          <View style={styles.cameraTopBar}>
            <Text style={styles.cameraTitle}>Capture Site Photo</Text>
          </View>

          {/* Viewfinder Corner Brackets */}
          <View style={styles.viewfinderWrapper} pointerEvents="none">
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>

          {/* Bottom Controls */}
          <View style={styles.cameraBottomBar}>
            {/* Select from Gallery (left) */}
            <Pressable
              style={({ pressed }) => [styles.sideBtn, pressed && styles.sideBtnPressed]}
              onPress={handleSelectFromGallery}
            >
              <Text style={styles.sideBtnEmoji}>🖼️</Text>
              <Text style={styles.sideBtnLabel}>Gallery</Text>
            </Pressable>

            {/* Shutter (center) */}
            <Pressable
              style={({ pressed }) => [
                styles.shutterOuter,
                pressed && styles.shutterOuterPressed,
                !isCameraReady && styles.shutterDisabled,
              ]}
              onPress={handleCapture}
              disabled={!isCameraReady || isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color="#f97316" />
              ) : (
                <View style={styles.shutterInner} />
              )}
            </Pressable>

            {/* Flip (right) */}
            <Pressable
              style={({ pressed }) => [styles.sideBtn, pressed && styles.sideBtnPressed]}
              onPress={handleFlip}
            >
              <Text style={styles.sideBtnEmoji}>🔄</Text>
              <Text style={styles.sideBtnLabel}>Flip</Text>
            </Pressable>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bgDark: { flex: 1, backgroundColor: '#0f1117' },

  centeredContainer: {
    flex: 1,
    backgroundColor: '#0f1117',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },

  // Permission Card
  permCard: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  permEmoji: { fontSize: 48, marginBottom: 14 },
  title: { color: '#f1f5f9', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#9ca3af', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },

  // Buttons
  primaryBtn: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  primaryBtnPressed: { opacity: 0.82 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  secondaryBtn: {
    flex: 1,
    backgroundColor: '#2a2d3a',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b3f54',
  },
  secondaryBtnPressed: { opacity: 0.82 },
  secondaryBtnText: { color: '#f1f5f9', fontSize: 14, fontWeight: '600' },

  dangerBtn: {
    flex: 1,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
  },
  dangerBtnPressed: { opacity: 0.82 },
  dangerBtnText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },

  outlineBtn: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f97316',
    width: '100%',
  },
  outlineBtnPressed: { backgroundColor: 'rgba(249,115,22,0.08)' },
  outlineBtnText: { color: '#f97316', fontSize: 14, fontWeight: '600' },

  // Preview Screen
  previewScroll: { padding: 16, paddingBottom: 32 },
  previewCard: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  previewHeader: { marginBottom: 14 },
  previewTitle: { color: '#f1f5f9', fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    backgroundColor: '#0f1117',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  galleryBadge: { borderColor: '#f97316' },
  badgeText: { color: '#9ca3af', fontSize: 12 },

  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0f1117',
    marginBottom: 16,
  },
  previewImage: { width: '100%', height: '100%' },

  actionGrid: { gap: 12 },
  btnRow: { flexDirection: 'row', gap: 12 },

  // Camera Live View
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  cameraLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f1117',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cameraTopBar: {
    paddingTop: Platform.OS === 'ios' ? 54 : 24,
    paddingHorizontal: 20,
    paddingBottom: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(15,17,23,0.5)',
  },
  cameraTitle: {
    color: '#f1f5f9',
    fontSize: 17,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Viewfinder brackets
  viewfinderWrapper: {
    flex: 1,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#f97316',
    borderWidth: 3,
  },
  cornerTL: { top: 30, left: 30, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 30, right: 30, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 30, left: 30, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 30, right: 30, borderLeftWidth: 0, borderTopWidth: 0 },

  cameraBottomBar: {
    backgroundColor: 'rgba(15,17,23,0.72)',
    paddingVertical: 24,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  sideBtnPressed: { backgroundColor: 'rgba(255,255,255,0.18)' },
  sideBtnEmoji: { fontSize: 22 },
  sideBtnLabel: { color: '#d1d5db', fontSize: 10, marginTop: 2, fontWeight: '500' },

  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  shutterOuterPressed: {
    transform: [{ scale: 0.93 }],
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  shutterDisabled: { borderColor: '#6b7280', opacity: 0.5 },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f97316',
  },
});
