import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pedometer } from 'expo-sensors';

const StepCounter = () => {
  const [steps, setSteps] = useState(0);
  const [cadence, setCandence]= useState(0);
  const [tracking,setTracking] = useState(false);
  const [seconds,setseconds] =useState(0);
  const intervalRef = useRef(null);


  useEffect(() => {
    let subscription;

    const getPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const { granted } = await Pedometer.requestPermissionsAsync();
          if (!granted) {
            console.error('Permission to access pedometer data denied');
            return;
          }
        } catch (error) {
          console.error('Error requesting permissions:', error);
        }
      }
    };

    const startPedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        console.error('Pedometer not available');
        return;
      }

      subscription = Pedometer.watchStepCount(result => {
        setSteps(result.steps || 0);
      });
    };

 

    getPermissions();
    startPedometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);
 
  useEffect(() => {
    if (tracking) {
      intervalRef.current = setInterval(() => {
        setseconds(prevseconds=>prevseconds+1);
        setCandence((steps/((seconds+1)/60)).toFixed(2))
      },1000)
    }else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [tracking,steps,seconds])
  const startTracking= () => {
    setSteps(0);
    setCandence(0);
    setseconds(0);
    setTracking(true);
  }
  const stopTracking = () => {
    setTracking(false);

  }
  const formatTime = (totalseconds) => {
    const hours = Math.floor(totalseconds/3600);
    const minutes = Math.floor((totalseconds%3600)/60);
    const seconds = totalseconds%60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
      <Text style={styles.text}>Steps Taken:</Text>
      <Text style={styles.stepCount}>{steps}</Text>

      </View>
      <View style={styles.subContainer}>
        <Text style={styles.text}>Cadence Rate:</Text>
        <Text style={styles.stepCount}>{cadence}</Text>
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.text}>Time:</Text>
        <Text style={styles.stepCount}>{formatTime(seconds)}</Text>
      </View>
      <TouchableOpacity
        style={tracking ? styles.stopButton : styles.startButton}
        onPress={tracking ? stopTracking : startTracking}
      >
        <Text style={styles.buttonText}>{tracking ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    display: 'flex',
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
  },
  stepCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#4CAF50', // Green color for start button
    padding: 10,
    borderRadius: 10,
    paddingHorizontal:20,
  },
  stopButton: {
    backgroundColor: '#F44336', // Red color for stop button
    padding: 10,
    borderRadius: 10,
    paddingHorizontal:20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});


export default StepCounter;
