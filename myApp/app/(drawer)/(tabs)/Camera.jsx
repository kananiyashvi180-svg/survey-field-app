import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
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
      if (taken) {
        setPhoto({ uri: taken.uri, timestamp: new Date().toLocaleTimeString(), fromGallery: false });
      }
    } catch (_err) {
      Alert.alert('Capture Error', 'Failed to take photo.');
    }
  };

  const handleFlip = () => {
    setFacing(facing === 'back' ? 'front' : 'back');
  };

  const handleDelete = () => {
    if (typeof document !== 'undefined') {
      const confirmed = window.confirm('Discard this photo?');
      if (confirmed) setPhoto(null);
      return;
    }
    Alert.alert('Delete Photo', 'Discard this photo?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => setPhoto(null) },
    ]);
  };

  const handleSaveToGallery = async () => {
    if (!photo) return;

    if (typeof document !== 'undefined') {
      setIsSaving(true);
      try {
        const link = document.createElement('a');
        link.href = photo.uri;
        link.download = 'photo.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert('Saved', 'Photo downloaded.');
      } catch (_err) {
        Alert.alert('Save Failed', 'Could not download photo.');
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (!mediaPermission || !mediaPermission.granted) {
      const response = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(response);
      if (!response.granted) {
        Alert.alert('Permission Denied', 'Please allow gallery access.');
        return;
      }
    }

    setIsSaving(true);
    try {
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      Alert.alert('Saved', 'Photo saved to gallery.');
    } catch (_err) {
      Alert.alert('Save Failed', 'Could not save to gallery.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectFromGallery = async () => {
    if (typeof document !== 'undefined') {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
          const file = event.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setPhoto({
                uri: e.target.result,
                timestamp: new Date().toLocaleTimeString(),
                fromGallery: true,
              });
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } catch (_err) {
        Alert.alert('Gallery Error', 'Could not load photo.');
      }
      return;
    }

    if (!mediaPermission || !mediaPermission.granted) {
      const response = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(response);
      if (!response.granted) {
        Alert.alert('Permission Denied', 'Please allow gallery access.');
        return;
      }
    }

    try {
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        first: 1,
      });

      if (assets.assets.length === 0) {
        Alert.alert('No Photos', 'No photos found in gallery.');
        return;
      }

      const assetInfo = await MediaLibrary.getAssetInfoAsync(assets.assets[0]);
      const uri = assetInfo.localUri || assetInfo.uri;
      setPhoto({ uri, timestamp: new Date().toLocaleTimeString(), fromGallery: true });
    } catch (_err) {
      Alert.alert('Gallery Error', 'Could not load photo.');
    }
  };

  const requestCameraPermission = async () => {
    setIsLoading(true);
    const response = await requestCameraPermissionsAsync();
    setCameraPermission(response);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!cameraPermission || !cameraPermission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Camera Access Required</Text>
        <Text style={styles.text}>Please grant camera permission to continue.</Text>
        <Pressable style={styles.btn} onPress={requestCameraPermission}>
          <Text style={styles.btnText}>Grant Camera Access</Text>
        </Pressable>
      </View>
    );
  }

  if (photo) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Photo Preview</Text>
          <Text style={styles.text}>Captured at: {photo.timestamp}</Text>
          {photo.fromGallery ? <Text style={styles.mutedText}>Selected from Gallery</Text> : null}
        </View>

        <Image source={{ uri: photo.uri }} style={styles.image} />

        <View style={styles.btnGroup}>
          <Pressable style={styles.btn} onPress={() => setPhoto(null)}>
            <Text style={styles.btnText}>Retake</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={handleSelectFromGallery}>
            <Text style={styles.btnText}>Select from Gallery</Text>
          </Pressable>
        </View>
        <View style={styles.btnGroup}>
          <Pressable style={styles.btnSecondary} onPress={handleDelete}>
            <Text style={styles.btnText}>Delete Photo</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={handleSaveToGallery} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.btnText}>Save to Gallery</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing} />

      <View style={styles.controls}>
        <Pressable style={styles.btn} onPress={handleCapture}>
          <Text style={styles.btnText}>Capture</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={handleFlip}>
          <Text style={styles.btnText}>Flip</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={handleSelectFromGallery}>
          <Text style={styles.btnText}>Gallery</Text>
        </Pressable>
      </View>
    </View>
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
  loadingText: {
    color: '#9ca3af',
    fontSize: 15,
    marginTop: 12,
  },
  title: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 4,
  },
  mutedText: {
    color: '#9ca3af',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#151821',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  camera: {
    flex: 1,
    marginVertical: 10,
    borderRadius: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#151821',
    borderRadius: 12,
    marginBottom: 16,
  },
  btnGroup: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 14,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnSecondary: {
    backgroundColor: '#7f1d1d',
    padding: 14,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginVertical: 8,
    alignSelf: 'center',
  },
});
