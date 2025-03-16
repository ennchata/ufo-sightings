import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';

const position: LatLngTuple = [51.505, -0.09];

interface PointOfInterest {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface LocationHandlerProps {
  addMarker: (lat: number, lng: number) => void;
}

const LocationHandler = ({ addMarker }: LocationHandlerProps) => {
  const map = useMapEvents({
    dragend: () => {
      console.log(map.getCenter());
    },
    click: (e) => {
      addMarker(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};

const Index = () => {
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);

  useEffect(() => {
    fetch('https://sampleapis.assimilate.be/ufo/sightings')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data); // Debugging log
        const points = data
          .filter((item: any) => item.location?.latitude && item.location?.longitude) // Ensure valid latitude and longitude
          .map((item: any) => ({
            name: 'Witness Name: ' + item.witnessName + '\nStatus: ' + item.status, // Choose a meaningful name field
            location: {
              latitude: item.location.latitude, // Correctly access latitude
              longitude: item.location.longitude, // Correctly access longitude
            },
          }));
        console.log('Points of Interest:', points); // Debugging log
        setPointsOfInterest(points);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const iconX = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/similonap/public_icons/refs/heads/main/location-pin.png',
    iconSize: [48, 48],
    popupAnchor: [-3, 0],
  });

  const addPointOfInterest = (lat: number, lng: number) => {
    setPointsOfInterest([...pointsOfInterest, { name: 'New Point', location: { latitude: lat, longitude: lng } }]);
  };

  console.log('Points of Interest in render:', pointsOfInterest); // Debugging log

  return (
    <MapContainer
      center={{ lat: 51.505, lng: -0.09 }}
      zoom={3}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationHandler addMarker={(lat, lng) => addPointOfInterest(lat, lng)} />
      {pointsOfInterest.length > 0 ? (
        pointsOfInterest.map((point, index) => (
          <Marker
            key={index}
            position={[point.location.latitude, point.location.longitude]}
            icon={iconX}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
              mouseout: (e) => {
                e.target.closePopup();
              },
            }}
          >
            <Popup>
              <View style={{ backgroundColor: 'white', padding: 10, width: 150 }}>
                <Text>{point.name}</Text>
              </View>
            </Popup>
          </Marker>
        ))
      ) : (
        <Text>No points of interest available</Text>
      )}
    </MapContainer>
  );
};

export default Index;
