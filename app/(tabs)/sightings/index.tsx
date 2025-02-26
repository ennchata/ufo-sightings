import { Sighting } from "@/types";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const style = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 16
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "gray",
  },
  location: {
    marginTop: 5,
    fontStyle: "italic",
    color: "darkblue",
  },
  link: {
    color: "blue",
    textDecorationColor: "blue",
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  }
});


export default function SightingsIndex() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const loadSightings = async () => {
    try {
      const response = await fetch("https://sampleapis.assimilate.be/ufo/sightings");
      const json: Sighting[] = await response.json();
        setSightings(json);
      } catch (error) {
        console.error("Error loading sightings:", error);
      } finally {
        setLoaded(true);
      }
    };

    useEffect(() => {
      loadSightings();
    }, []);

    return (
      <View style={style.view}>
        { loaded ?
          <FlatList 
            data={sightings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={style.card}>
                <Text style={style.title}>{item.witnessName}</Text>
                <Text style={style.date}>{new Date(item.dateTime).toLocaleDateString()}</Text>
                <Text>{item.description}</Text>
                <Text style={style.location}>📍 {item.location.latitude}, {item.location.longitude}</Text>
                <Link href={{
                  pathname: "/sightings/[sighting]",
                  params: { sighting: item.id }
                }} style={style.link}>View details</Link>
              </View>
            )}
          /> :
          <Text>Loading...</Text>
        }
      </View>
    )
}
