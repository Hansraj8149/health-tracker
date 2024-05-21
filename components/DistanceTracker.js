import React, { useState, useEffect, useReducer, useRef } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import haversine from "haversine";




const DistanceSpeedTracker = () => {
  const [position, setPosition] = useState(null);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [tracking, setTracking] = useState(false);
  const previousPosition = useRef(null);

  useEffect(() => {
   
    const initiazeTracking = async () => {
  

    let watchId;
    if (tracking) {
      watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed } = position.coords;
          console.log(latitude,longitude)

          if (previousPosition.current) {
            const distance = haversine(previousPosition.current, {
              latitude,
              longitude,
            });
            const distanceInKmn = distance * 1000;
            console.log("distance:", distanceInKmn);
            setDistanceTravelled(
              (prevDistance) => prevDistance + distanceInKmn
            );
          }

          previousPosition.current={ latitude, longitude };
          console.log('previsouLocation',previousPosition.current)
          const speedInKmh = speed * 3.6;
          setSpeed(speedInKmh || 0); // speed might be null, hence the fallback to 0
          console.log("speed:", speedInKmh);
          setPosition(position);
          console.log("position:", position);
        },
        (error) => console.error(error),
        {   interval:1000,
  
          enableHighAccuracy:true,
          distanceFilter:1,
        }
      );
    } else if (watchId) {
      Geolocation.clearWatch(watchId);
    }

    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }
    initiazeTracking();
  }, [tracking]);

  const startTracking = () => {
    setDistanceTravelled(0);
    setSpeed(0);
    setTracking(true);
  };

  const stopTracking = () => {
    setTracking(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.text}>Total Distance: </Text>
        <Text style={styles.distance}>
          {" "}
          {distanceTravelled.toFixed(2)} meters
        </Text>
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.text}>Speed: </Text>
        <Text style={styles.distance}> {speed.toFixed(2)} km/h</Text>
      </View>
      <TouchableOpacity 
        style={tracking ? styles.stopButton : styles.startButton} 
        onPress={tracking ? stopTracking : startTracking}
      >
        <Text style={styles.buttonText}>{tracking ? "Stop Tracking" : "Start Tracking"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
  },
  distance: {
    fontSize: 20,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
  },
  stopButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default DistanceSpeedTracker;
