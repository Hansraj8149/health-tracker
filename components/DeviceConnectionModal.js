import React, { useCallback } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StyleSheet,
  Button, // Import Button component
} from "react-native";
import { Device } from "react-native-ble-plx";

const DeviceModalListItem = ({ item, connectToPeripheral, closeModal }) => {
  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);

  return (
    <TouchableOpacity onPress={connectAndCloseModal} style={styles.ctaButton}>
      <Text style={styles.ctaButtonText}>{item.item.name}</Text>
    </TouchableOpacity>
  );
};

const DeviceModal = ({ devices, visible, connectToPeripheral, closeModal }) => {
  const renderDeviceModalListItem = useCallback(
    (item) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, connectToPeripheral]
  );

  return (
    <Modal
      style={styles.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}
    >
      <SafeAreaView style={styles.modalTitle}>
        <Text style={styles.modalTitleText}>Tap on a device to connect</Text>
        <FlatList
          contentContainerStyle={styles.modalFlatlistContainer}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
 
        <Button style={styles.ctaButton} title="Close" onPress={closeModal} />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalFlatlistContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalCellOutline: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

});

export default DeviceModal;
