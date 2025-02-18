import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const TARGET_SIZE = width * 0.8; // Target width based on screen size
const SHOT_RADIUS = 10;

export default function BiathlonCoach() {
  const [shots, setShots] = useState([]);
  const [targetLayout, setTargetLayout] = useState({ x: 0, y: 0 });

  const handleShot = (event) => {
    const { locationX, locationY, pageX, pageY } = event.nativeEvent;
    const x = pageX - targetLayout.x;
    const y = pageY - targetLayout.y;
    setShots([...shots, { x, y }]);
  };

  const handleLayout = (event) => {
    const { x, y } = event.nativeEvent.layout;
    setTargetLayout({ x, y });
  };

  const clearShots = () => {
    setShots([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ampumataulu
      </Text>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.target} onPress={handleShot} onLayout={handleLayout}>
        {[...Array(5)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.ring,
              { width: TARGET_SIZE * (1 - index * 0.2), height: TARGET_SIZE * (1 - index * 0.2), borderRadius: TARGET_SIZE * (1 - index * 0.2) / 2 }
            ]}
          />
        ))}
        {shots.map((shot, index) => (
          <View
            key={index}
            style={[styles.shot, { left: shot.x - SHOT_RADIUS, top: shot.y - SHOT_RADIUS }]}
          />
        ))}
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearButton} onPress={clearShots}>
        <Text style={styles.clearButtonText}>Tyhjennä</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  divider: {
    width: TARGET_SIZE,
    height: 2,
    backgroundColor: "black",
    marginBottom: 10,
  },
  target: {
    width: TARGET_SIZE,
    height: TARGET_SIZE,
    backgroundColor: "#ddd",
    borderRadius: TARGET_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ring: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "black",
  },
  shot: {
    width: SHOT_RADIUS * 2,
    height: SHOT_RADIUS * 2,
    backgroundColor: "red",
    borderRadius: SHOT_RADIUS,
    position: "absolute",
  },
  clearButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
