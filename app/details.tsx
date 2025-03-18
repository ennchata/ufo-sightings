import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { UfoSighting } from '../types';
import { useLocalSearchParams } from 'expo-router';

const API_URL = 'https://sampleapis.assimilate.be/ufo/sightings';
const GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/reverse'; // OpenStreetMap API

const Details = () => {
  const { id } = useLocalSearchParams();
  const [sighting, setSighting] = useState<UfoSighting | null>(null);
  const [loading, setLoading] = useState(true);

  const getCityAndCountry = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `${GEOCODING_API_URL}?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
      const country = data.address.country || 'Unknown Country';
      return `${city}, ${country}`;
    } catch (error) {
      console.error('Error fetching location:', error);
      return 'Unknown Location';
    }
  };

  useEffect(() => {
    const fetchSighting = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const data: UfoSighting = await response.json();

        if (data) {
          const locationString = await getCityAndCountry(data.location.latitude, data.location.longitude);
          setSighting({ ...data, locationString });
        }
      } catch (error) {
        console.error('Error fetching sighting:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSighting();
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!sighting) {
    return <Text>No sighting found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sighting.witnessName}</Text>
      <Text style={styles.description}>Location: {sighting.locationString}</Text>
      <Text style={styles.description}>Description: {sighting.description}</Text>
      <Text style={styles.description}>Date: {sighting.dateTime}</Text>
      <Text style={styles.description}>Coordinates: {sighting.location.latitude}, {sighting.location.longitude}</Text>
      <Text style={styles.description}>Status: {sighting.status}</Text>
      <Text style={styles.description}>Contact: {sighting.witnessContact}</Text>
      <Image source={{ uri: sighting.picture }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f1f1f1',
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      color: '#d9534f',
      marginTop: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    location: {
      fontSize: 16,
      color: '#777',
      marginBottom: 15,
    },
    card: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      marginBottom: 15,
    },
    description: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    text: {
      fontSize: 14,
      color: '#555',
      marginBottom: 10,
    },
    status: {
      fontWeight: 'normal',
      color: '#007BFF',
    },
    image: {
        width: '100%',
        height: 250,
        marginTop: 15,
        borderRadius: 8,
        resizeMode: 'contain',
      },
  });
  

export default Details;
