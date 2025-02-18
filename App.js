import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const TARGET_SIZE = width * 0.8; // Target width based on screen size
const SHOT_RADIUS = 10;

export default function BiathlonCoach() {
  const [shots, setShots] = useState([]);
  const [targetLayout, setTargetLayout] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      startTimeRef.current = Date.now() - time * 1000;
      interval = setInterval(() => {
        setTime((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleShot = (event) => {
    const { locationX, locationY, pageX, pageY } = event.nativeEvent;
    const x = pageX - targetLayout.x;
    const y = pageY - targetLayout.y;
    setShots([...shots, { x, y }]);
    recordLap();
  };

  const handleLayout = (event) => {
    const { x, y } = event.nativeEvent.layout;
    setTargetLayout({ x, y });
  };

  const clearShots = () => {
    setShots([]);
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const recordLap = () => {
    if (laps.length >= 10) {
      setLaps([time.toFixed(1)]);
    } else {
      setLaps([...laps, time.toFixed(1)]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ampumataulu</Text>
    
      <TouchableOpacity style={styles.target} onPress={handleShot} onLayout={handleLayout}>
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.ring,
              { width: TARGET_SIZE * (1 - index * 0.2), height: TARGET_SIZE * (1 - index * 0.2), borderRadius: TARGET_SIZE * (1 - index * 0.2) / 2 }
            ]}
          />
        ))}
        {shots.map((shot, index) => (
          <View key={index} style={[styles.shot, { left: shot.x - SHOT_RADIUS, top: shot.y - SHOT_RADIUS }]}>
            <Text style={styles.shotText}>{index + 1}</Text>
          </View>
        ))}
      </TouchableOpacity>

      <Text style={styles.stopwatch}>Aika: {time.toFixed(1)} s</Text>
      <TouchableOpacity style={styles.lapButton} onPress={recordLap}>
        <Text style={styles.lapButtonText}>Kierros</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.startButton} onPress={() => setIsRunning(!isRunning)}>
        <Text style={styles.startButtonText}>{isRunning ? "Pysäytä" : "Aloita"}</Text>
      </TouchableOpacity>      
      <View style={styles.lapsContainer}>
        {laps.map((lap, index) => (
          <Text key={index} style={styles.lapText}>Kierros {index + 1}: {lap} s</Text>
        ))}
      </View>
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 25,
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
    borderWidth: 1,
    borderColor: "black",
  },
  shot: {
    width: SHOT_RADIUS * 2,
    height: SHOT_RADIUS * 2,
    backgroundColor: "black",
    borderRadius: SHOT_RADIUS,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  shotText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  clearButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  stopwatch: {
    marginTop: 20,
    fontSize: 18,
  },
  lapButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FFA500",
    borderRadius: 5,
  },
  lapButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  lapsContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  lapText: {
    fontSize: 16,
  },
  startButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
