import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../constants';

const ScannerScreen = () => {
  const navigation = useNavigation<any>();
  const [isScanning, setIsScanning] = useState(true);

  const onReadCode = (event: any) => {
    if (!isScanning) return;
    
    const scannedCode = event.nativeEvent.codeStringValue;
    if (scannedCode) {
      setIsScanning(false);
      // Navigate back to QuickIncident with params
      navigation.navigate('QuickIncident', {
        scannedId: scannedCode,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        cameraType={CameraType.Back}
        scanBarcode={true}
        showFrame={true}
        laserColor={THEME.colors.primary}
        frameColor="white"
        onReadCode={onReadCode}
      />
      <View style={styles.overlay}>
        <Text style={styles.instructionText}>
          Align QR Code or Barcode within the frame to scan
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ScannerScreen;
