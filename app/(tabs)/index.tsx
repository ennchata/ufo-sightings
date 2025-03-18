"use dom"

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';
import { useRouter } from 'expo-router';
import { UfoSighting } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const position: LatLngTuple = [51.505, -0.09];
type ExtendedSighting = UfoSighting & { custom: boolean };

const Index = () => {
  const [pointsOfInterest, setPointsOfInterest] = useState<ExtendedSighting[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('https://sampleapis.assimilate.be/ufo/sightings')
      .then((response) => response.json())
      .then((data) => {
        const points: ExtendedSighting[] = data
          .filter((item: any) => item.location?.latitude && item.location?.longitude)
          .map((item: any) => ({
            id: item.id,
            witnessName: item.witnessName,
            location: { latitude: item.location.latitude, longitude: item.location.longitude },
            description: item.description,
            picture: item.picture,
            status: item.status,
            dateTime: item.dateTime,
            witnessContact: item.witnessContact,
            custom: false,
          }));

        AsyncStorage.getItem('sightings').then((data: string | null) => {
          if (data) { 
            const customSightings = JSON.parse(data) as ExtendedSighting[];
            setPointsOfInterest([...points, ...customSightings.map((sighting) => ({ ...sighting, custom: true }))]);
          } else {
            setPointsOfInterest(points);
          }
        });
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const iconX = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/similonap/public_icons/refs/heads/main/location-pin.png',
    iconSize: [48, 48],
    popupAnchor: [-3, 0],
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Map */}
      <MapContainer
        center={{ lat: 51.505, lng: -0.09 }}
        zoom={3}
        scrollWheelZoom={true}
        style={styles.map}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pointsOfInterest.map((point) => (
          <Marker
            key={point.id}
            position={[point.location.latitude, point.location.longitude]}
            icon={iconX}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
              mouseout: (e) => {
                e.target.closePopup();
              },
              click: () => {
                router.push(point.custom ? `./custom-details?id=${point.id}` : `./details?id=${point.id}`);
              },
            }}
          >
            <Popup>
              <View style={{ backgroundColor: 'white', padding: 10, width: 150 }}>
                <Text>{point.witnessName}</Text>
                <Text>Status: {point.status}</Text>
              </View>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating "Add Sighting" Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('./add-sighting')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000, // Zorgt ervoor dat de knop boven de map staat
  },
  buttonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Index;
