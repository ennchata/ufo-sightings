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
              <View>
                <Text>{item.witnessName}</Text>
                <Link href={{
                  pathname: "/sightings/[sighting]",
                  params: { sighting: item.id }
                }}>Details</Link>
              </View>
            )}
          /> :
          <Text>Loading...</Text>
        }
      </View>
    )
}
