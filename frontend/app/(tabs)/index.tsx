import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const API_URL = 'https://happy-sweet-reindeer.ngrok-free.app';

export default function HomeScreen() {
  const [api_msg, setApiMsg] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => res.json())
      .then((data) => {
        setApiMsg(data.message);
      })
      .catch((err) => console.error('API error:', err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, React Native!</Text>
      <Text style={styles.text}>{api_msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
  },
});
