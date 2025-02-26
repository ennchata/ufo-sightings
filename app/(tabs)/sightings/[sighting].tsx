import style from "@/styles";
import { Sighting } from "@/types";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function SightingsDetail() {
    const { sighting } = useLocalSearchParams();

    const [sightingInfo, setSighting] = useState<Sighting>();
    const [loaded, setLoaded] = useState<boolean>(false);

    const loadSighting = async (sighting: string) => {
      try {
        const response = await fetch("https://sampleapis.assimilate.be/ufo/sightings?id=" + sighting);
        const json: Sighting[] = await response.json();
          setSighting(json.slice(0, 1)[0]);
      } catch (error) {
        console.error("Error loading sightings:", error);
      } finally {
        setLoaded(true);
      }
    };
  
    useEffect(() => {
      if (typeof sighting == "string") {
        loadSighting(sighting);
      }
    }, []);

    return (
        <View style={style.view}>
          { loaded ?
            <View>
              <Text style={style.bold}>{`Sighting #${sightingInfo!.id} (${sightingInfo!.status})`}</Text>
              <Text>{`reported by ${sightingInfo!.witnessName} (${sightingInfo!.witnessContact})`}</Text>
              <Text>{new Date(sightingInfo!.dateTime).toUTCString()}</Text>
              <Text>{`${sightingInfo!.location.latitude}, ${sightingInfo!.location.longitude}`}</Text>
              <View style={style.horizontalRule} />
              <Text>{sightingInfo!.description}</Text>
              <View style={style.horizontalRule} />
              <Image style={style.image} source={{uri: sightingInfo!.picture}} />
            </View> :
            <Text>Loading...</Text>
          }
          <View style={style.horizontalRule} />
          <Link dismissTo href="/sightings" style={style.link}>Return to overview</Link>
        </View>
    )
}