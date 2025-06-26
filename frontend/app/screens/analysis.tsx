import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { computeRouteMetrics } from '../../components/google_maps_routes';

const origin = '2 Temi Rd, Framingham, MA 01701'
const destination = '45 Transportation Way, Boston, MA 02128'
const pickuptime = '2025-06-28T12:00:00Z'

export default function Analysis() {
  const [data, setData] = useState<{ distance: number; duration: number } | null>(null);

  const getRouteMetrics = async () => {
    const routeData = await computeRouteMetrics(origin, destination, pickuptime)
    setData(routeData)
  };

  useEffect(() => {
    getRouteMetrics();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{JSON.stringify(data)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});
