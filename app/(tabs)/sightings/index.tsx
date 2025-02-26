import style from "@/styles";
import { Sighting } from "@/types";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

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
            ItemSeparatorComponent={() => <View style={style.horizontalRule} />}
            renderItem={({ item }) => (
              <View style={style.listItem}>
                <Text style={style.bold}>{`#${item.id} - ${item.witnessName}`}</Text>
                <Text>{item.status}</Text>
                <Text>{new Date(item.dateTime).toUTCString()}</Text>
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
