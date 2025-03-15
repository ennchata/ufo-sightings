import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { UfoSighting } from '../types';

const API_URL = 'https://sampleapis.assimilate.be/ufo/sightings';
const GEOCODING_API_URL = 'https://api.opencagedata.com/geocode/v1/json';  // Replace with your geocoding API endpoint
const GEOCODING_API_KEY = 'YOUR_API_KEY';  // Replace with your OpenCage API key

const List = () => {
  const [sightings, setSightings] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Function to fetch the city and country from coordinates
  const getCityAndCountry = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`${GEOCODING_API_URL}?q=${latitude}+${longitude}&key=${GEOCODING_API_KEY}`);
      const data = await response.json();
      const city = data.results[0]?.components.city || 'Unknown City';
      const country = data.results[0]?.components.country || 'Unknown Country';
      return `${city}, ${country}`;
    } catch (error) {
      console.error('Error fetching location:', error);
      return 'Unknown Location';
    }
  };

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const response = await fetch(API_URL);
        const data: UfoSighting[] = await response.json();
        const sightingsWithLocation = await Promise.all(
          data.map(async (sighting) => {
            const locationString = await getCityAndCountry(sighting.location.latitude, sighting.location.longitude);
            return { ...sighting, locationString };
          })
        );
        setSightings(sightingsWithLocation);
      } catch (error) {
        console.error('Error fetching sightings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSightings();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  const handleToggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sightings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.witnessName}</Text>
            <Text style={styles.description}>Location: {item.locationString}</Text>
            <Text style={styles.description}>Description: {item.description}</Text>

            <TouchableOpacity onPress={() => handleToggleExpand(item.id)}>
              <Text style={styles.moreInfoText}>Click for more info</Text>
            </TouchableOpacity>

            {expanded === item.id && (
              <View style={styles.expandedInfo}>
                <Text style={styles.description}>Date: {item.dateTime}</Text>
                <Text style={styles.description}>Coordinates: {item.location.latitude}, {item.location.longitude}</Text>
                <Text style={styles.description}>Status: {item.status}</Text>
                <Image source={{ uri: item.picture }} style={styles.image} />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#f8f8f8',
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: '#fff',
      padding: 15,
      marginVertical: 8,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    description: {
      fontSize: 14,
      color: '#555',
    },
    moreInfoText: {
      fontSize: 14,
      color: '#007BFF',
      marginTop: 5,
    },
    expandedInfo: {
      marginTop: 10,
    },
    image: {
      width: '100%',
      height: 150, // Adjusted height to make images smaller
      marginTop: 10,
      borderRadius: 8,
      resizeMode: 'contain', // Ensures the image fits within its container while preserving its aspect ratio
    },
  });
  

export default List;
