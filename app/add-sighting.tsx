import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { UfoSighting } from '../types';

const AddSighting = () => {
  const router = useRouter();

  const [witnessName, setWitnessName] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState('');
  const [status, setStatus] = useState<'confirmed' | 'unconfirmed'>('unconfirmed');
  const [dateTime, setDateTime] = useState('');
  const [witnessContact, setWitnessContact] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

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
      dateTime,
      witnessContact,
      location: { latitude: lat, longitude: lng },
    };

    console.log('New Sighting:', newSighting);
    Alert.alert('Success', 'Sighting added successfully!');
    
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add UFO Sighting</Text>
      <TextInput
        style={styles.input}
        placeholder="Witness Name"
        value={witnessName}
        onChangeText={setWitnessName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Picture URL (Optional)"
        value={picture}
        onChangeText={setPicture}
      />

      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />

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
    </View>
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
});

export default AddSighting;
