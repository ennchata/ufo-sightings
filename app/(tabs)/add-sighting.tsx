import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { UfoSighting } from '../../types';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddSighting = () => {
  const router = useRouter();
  let sightings: UfoSighting[] = [];

  const [witnessName, setWitnessName] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState('');
  const [status, setStatus] = useState<'confirmed' | 'unconfirmed'>('unconfirmed');
  const [witnessContact, setWitnessContact] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    AsyncStorage.getItem("sightings").then((data: string | null) => {
      if (data) {
        sightings = JSON.parse(data) as UfoSighting[];
      }
    });
  }, []);

  const handleSubmit = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!witnessName || !description || !lat || !lng) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const newSighting: UfoSighting = {
      id: Date.now(),
      witnessName,
      description,
      picture,
      status,
      dateTime: new Date().toISOString(),
      witnessContact,
      location: { latitude: lat, longitude: lng },
    };

    sightings.push(newSighting);
    AsyncStorage.getItem("sightings").then(async (data: string | null) => {
      if (data) {
        const json = await JSON.parse(data);
        AsyncStorage.setItem("sightings", JSON.stringify([...json, newSighting]));
      } else {
        AsyncStorage.setItem("sightings", JSON.stringify([newSighting]));
      }
    });

    Alert.alert('Success', 'Sighting added successfully!');
    
    router.back();
  };

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        { cameraPermission.granted === false && (
          <View>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestCameraPermission} title="Grant camera permission" />
          </View>
        )}
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = () => {
    if (cameraRef.current) {
      try {
        cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: false,
        }).then((picture: CameraCapturedPicture | undefined) => {
          if (picture) {
            setPicture(picture.uri);
          }
        });
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add UFO Sighting</Text>
      <TextInput
        style={styles.input}
        placeholder="Witness Name"
        placeholderTextColor={'#ccc'}
        value={witnessName}
        onChangeText={setWitnessName}
      />

      <TextInput
        style={styles.input}
        placeholder="Witness Contact"
        placeholderTextColor={'#ccc'}
        value={witnessContact}
        onChangeText={setWitnessContact}
      />

      <TextInput
        style={[styles.input, { height: 150 }]}
        placeholder="Description"
        placeholderTextColor={'#ccc'}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Picture URL (Optional)"
        placeholderTextColor={'#ccc'}
        value={picture}
        onChangeText={setPicture}
      />

      <TextInput
        style={styles.input}
        placeholder="Latitude"
        placeholderTextColor={'#ccc'}
        value={latitude}
        onChangeText={setLatitude}
        // keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Longitude"
        placeholderTextColor={'#ccc'}
        value={longitude}
        onChangeText={setLongitude}
        // keyboardType="numeric"
      />

      <CameraView style={styles.camera} facing={facing} ref={cameraRef} >
        <View style={styles.buttonContainer}>
          
        </View>
      </CameraView>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.buttonSpacing]} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Take Picture</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.statusButton}
        onPress={() => setStatus(status === 'confirmed' ? 'unconfirmed' : 'confirmed')}
      >
        <Text style={styles.statusText}>
          Status: {status === 'confirmed' ? '🟢 Confirmed' : '🔴 Unconfirmed'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Add Sighting</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  statusButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    height: 500,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'darkgrey',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonSpacing: {
    marginRight: 10,
  },
});

export default AddSighting;
