import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { UfoSighting } from '../../types';
import { useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://sampleapis.assimilate.be/ufo/sightings';
const GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/reverse'; // OpenStreetMap API

type ExtendedSighting = UfoSighting & { custom: boolean };

const List = () => {
  const [sightings, setSightings] = useState<ExtendedSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const router = useRouter();

  const getCityAndCountry = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `${GEOCODING_API_URL}?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      const city = data.address == undefined ? "Unknown City" : data.address.city ?? data.address.town ?? data.address.village ?? 'Unknown City';
      const country = data.address == undefined ? "Unknown City" : data.address.country ?? 'Unknown Country';
      return `${city}, ${country}`;
    } catch (error) {
      console.error('Error fetching location:', error);
      return 'Unknown Location';
    }
  };

  const fetchSightings = async () => {
    try {
      const response = await fetch(API_URL);
      const data: ExtendedSighting[] = await response.json();

      const sightingsWithLocation = await Promise.all(
        data.map(async (sighting) => {
          const locationString = await getCityAndCountry(sighting.location.latitude, sighting.location.longitude);
          return { ...sighting, locationString, custom: false };
        })
      );

      AsyncStorage.getItem('sightings').then((data: string | null) => {
        if (data) {
          let parsed = JSON.parse(data) as UfoSighting[];
          setSightings([...sightingsWithLocation, ...parsed.map((sighting) => ({ ...sighting, custom: true }))]);
        } else {
          setSightings(sightingsWithLocation);
        }
      });
    } catch (error) {
      console.error('Error fetching sightings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSightings();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  const handleNavigateToDetails = (id: number, custom: boolean) => {
    router.push(custom ? `./../custom-details?id=${id}` : `./../details?id=${id}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => { setLoading(true); fetchSightings(); }}
      ><Text style={styles.moreInfoText}>Reload List</Text></TouchableOpacity>
      <FlatList
        data={sightings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.witnessName}</Text>
            <Text style={styles.description}>Location: {item.locationString}</Text>
            <Text style={styles.description}>Description: {item.description}</Text>

            <TouchableOpacity onPress={() => handleNavigateToDetails(item.id, item.custom)}>
              <Text style={styles.moreInfoText}>Click for more info</Text>
            </TouchableOpacity>

            {expanded === item.id && (
              <View style={styles.expandedInfo}>
                <Text style={styles.description}>Date: {item.dateTime}</Text>
                <Text style={styles.description}>Coordinates: {item.location.latitude}, {item.location.longitude}</Text>
                <Text style={styles.description}>Status: {item.status}</Text>
                <Text style={styles.description}>Contact: {item.witnessContact}</Text>
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
    height: 150,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'contain',
  },
});

export default List;
