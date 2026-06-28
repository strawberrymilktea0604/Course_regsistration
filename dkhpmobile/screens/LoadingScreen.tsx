import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import LottieView from "lottie-react-native";

const LoadingScreen: React.FC = () => {
  return (
    <Modal transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.loading}>
          <LottieView 
            style={{flex: 1}} 
            source={require("../assets/loading.json")} 
            autoPlay 
            loop={true} 
          />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loading: {
    height: 300,
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  }
});
