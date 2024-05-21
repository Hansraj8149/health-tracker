import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GoogleFit, { Scopes } from 'react-native-google-fit';

export default function GoogleFitComponent() {
  const [dailyStepCount, setDailySteps] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isAuthorized = await GoogleFit.checkIsAuthorized();
        if (!isAuthorized) {
          await authorizeGoaogleFit();
        }

        const steps = await fetchStepCountData();
        setDailySteps(steps);
      } catch (error) {
        console.error('Error fetching step count:', error);
        setError('Error fetching step count: ' + error.message);
      }
    };

    fetchData();
  }, [dailyStepCount]);

  const authorizeGoogleFit = async () => {
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_ACTIVITY_WRITE,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_BODY_WRITE,
        Scopes.FITNESS_BLOOD_PRESSURE_READ,
        Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
        Scopes.FITNESS_BLOOD_GLUCOSE_READ,
        Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
        Scopes.FITNESS_NUTRITION_WRITE,
        Scopes.FITNESS_SLEEP_READ,
      ],
    };

    const authResult = await GoogleFit.authorize(options);
    if (authResult.success) {
      console.log('Authorization successful');
    } else {
      console.error('Authorization failed:', authResult.message);
      setError('Authorization failed: ' + authResult.message);
    }
  };

  const fetchStepCountData = async () => {
    const today = new Date();
    const lastWeekDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 8
    );

    const opt = {
      startDate: lastWeekDate.toISOString(),
      endDate: today.toISOString(),
      bucketUnit: 'DAY',
      bucketInterval: 1,
    };

    try {
      const res = await GoogleFit.getDailyStepCountSamples(opt);
      if (res.length === 0) {
        console.log('Step count data not found');
        return 0;
      }

      for (let i = 0; i < res.length; i++) {
        if (res[i].source === 'com.google.android.gms:estimated_steps') {
          const data = res[i].steps.reverse();
          return data[0].value;
        }
      }

      console.log('Step count data not found from estimated steps source');
      return 0;
    } catch (error) {
      console.error('Error fetching step count:', error);
      setError('Error fetching step count: ' + error.message);
      return 0; // Or handle the error differently
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text>Daily Step Count:</Text>
      <Text>{dailyStepCount}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
