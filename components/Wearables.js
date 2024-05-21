import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import useBLE from "./useBle";

const App = () => {
  const {
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
    requestLocationPermission,
    requestPermissions,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
            <Text style={styles.heartRateText}>{heartRate} bpm</Text>
    
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a Heart Rate Monitor
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={connectToDevice ? styles.startButton : styles.stopButton}
      >
        <Text style={styles.buttonText} >
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  heartRateTitleWrapper: {
   display:'flex',
   margin:20,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
    marginHorizontal: 20,
  
  },
  heartRateText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    paddingHorizontal:20,
  },
  stopButton: {
    backgroundColor: '#F44336',
    padding: 10,
    paddingHorizontal:20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },
});

export default App;
