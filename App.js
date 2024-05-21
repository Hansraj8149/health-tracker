import { StatusBar, ScrollView } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import DistanceTracker from './components/DistanceTracker';
import StepCounter from './components/StepCounter';
import Wearables from './components/Wearables';
import GoogleFit from './components/GoogleFit';
import Broadcasting from './components/WaitingRoom';

export default function App() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.subContainer}>
          <Broadcasting/>
        </View> 
         <View>
          <Text style={styles.heading}>Expo Data</Text>
          <View style={styles.divider} />
          <View style={styles.subContainer}>
            <DistanceTracker />
            <StepCounter />
          </View>

          <Text style={styles.heading}>Wearables Data</Text>
          <View style={styles.divider} />
          <Wearables />

          <Text style={styles.heading}>Health Connect</Text>
          <View style={styles.divider} />
           {/* <GoogleFit /> */}
        </View> 
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  subContainer: {
    padding: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  heading: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
