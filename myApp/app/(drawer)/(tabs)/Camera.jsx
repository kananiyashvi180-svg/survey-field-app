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

  const cameraRef = useRef(null);

  useEffect(() => {
    if (typeof document === 'undefined') {
      checkPermissions();
    } else {
      setCameraPermission({ granted: true });
      setMediaPermission({ granted: true });
    }
  }, []);

  const checkPermissions = async () => {
    const cam = await getCameraPermissionsAsync();
    setCameraPermission(cam);
    const media = await MediaLibrary.getPermissionsAsync();
    setMediaPermission(media);
  };

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
    if (facing === 'back') {
      setFacing('front');
    } else {
      setFacing('back');
    }
  };

  const handleDelete = () => {
    if (typeof document !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to discard this photo?');
      if (confirmed) {
        setPhoto(null);
      }
      return;
    }
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to discard this photo?',
      [
        { text: 'Cancel' },
        { text: 'Delete', onPress: () => setPhoto(null) },
      ]
    );
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
        Alert.alert('Save Failed', 'Could not download.');
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
      Alert.alert('Save Failed', 'Could not save.');
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
        Alert.alert('No Photos', 'No photos found.');
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
    const response = await requestCameraPermissionsAsync();
    setCameraPermission(response);
  };

  if (!cameraPermission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Checking permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera Access Required</Text>
        <Pressable style={styles.btn} onPress={requestCameraPermission}>
          <Text style={styles.btnText}>Grant Camera Access</Text>
        </Pressable>
      </View>
    );
  }

  if (photo) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.text}>Photo Preview</Text>
        <Text style={styles.text}>{photo.timestamp}</Text>
        {photo.fromGallery && <Text style={styles.text}>From Gallery</Text>}
        
        <Image source={{ uri: photo.uri }} style={styles.image} />

        <Pressable style={styles.btn} onPress={() => setPhoto(null)}>
          <Text style={styles.btnText}>Retake</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={handleDelete}>
          <Text style={styles.btnText}>Delete</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={handleSelectFromGallery}>
          <Text style={styles.btnText}>Select from Gallery</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={handleSaveToGallery} disabled={isSaving}>
          <Text style={styles.btnText}>Save to Gallery</Text>
        </Pressable>
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
          <Text style={styles.btnText}>Flip Camera</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={handleSelectFromGallery}>
          <Text style={styles.btnText}>Open Gallery</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    padding: 20,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#f97316',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 10,
    margin: 20,
  },
  camera: {
    flex: 1,
    height: 400,
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
