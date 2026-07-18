import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ActivityIndicator, Alert, Dimensions, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cameraRef = useRef(null);

  // Handle initial permission check loading state
  useEffect(() => {
    if (permission) {
      setIsLoading(false);
    }
  }, [permission]);

  // Helper to format date
  const formatTimestamp = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const sec = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
  };

  const handleCapture = async () => {
    if (!cameraRef.current || !isCameraReady) return;

    try {
      setIsLoading(true);
      const options = {
        quality: 0.85,
        skipProcessing: Platform.OS === 'web', // Skip processing on web to avoid issues
      };
      
      const takenPhoto = await cameraRef.current.takePictureAsync(options);
      if (takenPhoto) {
        setPhoto({
          uri: takenPhoto.uri,
          timestamp: formatTimestamp(new Date()),
        });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setPhoto(null),
        },
      ],
      { cancelable: true }
    );
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  // If permission is still checking
  if (isLoading && !permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading Camera permissions...</Text>
      </View>
    );
  }

  // If permission has not been granted
  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Camera Access Required</Text>
          <Text style={styles.subtitle}>
            We need camera access to allow you to capture field photos for survey reports.
          </Text>
          <Pressable style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // If a photo has been captured, show visual preview
  if (photo) {
    return (
      <View style={styles.container}>
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Photo Preview</Text>
          <View style={styles.imageContainer}>
            <Image source={{ uri: photo.uri }} style={styles.previewImage} resizeMode="cover" />
            <View style={styles.timestampBadge}>
              <Text style={styles.timestampText}>🕒 Captured: {photo.timestamp}</Text>
            </View>
          </View>
          <View style={styles.buttonRow}>
            <Pressable style={styles.retakeButton} onPress={handleRetake}>
              <Text style={styles.retakeButtonText}>🔄 Retake</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Active Camera View
  return (
    <View style={styles.cameraContainer}>
      {!isCameraReady && (
        <View style={styles.cameraLoadingOverlay}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>Opening Camera...</Text>
        </View>
      )}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraHeader}>
            <Text style={styles.cameraHeaderText}>Capture Site Photo</Text>
          </View>

          <View style={styles.cameraFooter}>
            <View style={styles.captureContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.captureButtonOuter,
                  pressed && styles.captureButtonOuterPressed,
                ]}
                onPress={handleCapture}
                disabled={!isCameraReady}
              >
                <View style={styles.captureButtonInner} />
              </Pressable>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f1117',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2d3a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    color: '#f1f5f9',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewCard: {
    backgroundColor: '#1c1f2b',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: '#2a2d3a',
    alignItems: 'center',
  },
  previewTitle: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0f1117',
    borderWidth: 1,
    borderColor: '#2a2d3a',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  timestampBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(15, 17, 23, 0.75)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(42, 45, 58, 0.5)',
  },
  timestampText: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#2a2d3a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b3f54',
  },
  retakeButtonText: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
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
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  cameraHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(15, 17, 23, 0.4)',
  },
  cameraHeaderText: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cameraFooter: {
    backgroundColor: 'rgba(15, 17, 23, 0.65)',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  captureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  captureButtonOuterPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  captureButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f97316',
  },
});
