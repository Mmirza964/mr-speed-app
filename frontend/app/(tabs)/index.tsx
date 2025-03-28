import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// ngrok URL for API to run Expo Go on iOS device
const API_URL = 'https://happy-sweet-reindeer.ngrok-free.app';

export default function HomeScreen() {
  const [all_rides, setAllRides] = useState<any[]>([]);

  // Format the datetime object into "month-date at hour:minute am/pm"
  const formatPickupTime = (time: any) => {
    const datetime = new Date(time);

    const month = String(datetime.getMonth() + 1).padStart(2, '0');
    const day = String(datetime.getDate()).padStart(2, '0');

    let hour = datetime.getHours();
    const minute = String(datetime.getMinutes()).padStart(2, '0');

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    return `${month}-${day} at ${hour}:${minute} ${ampm}`;
  };

  // Format the origin address and destination address
  const formatAddresses = (ride: any) => {
    let origin =
      ride.origin_address.AddressNM === 'Logan'
        ? ride.origin_address.AddressNM
        : ride.origin_address.City;
    let dest =
      ride.destination_address.AddressNM === 'Logan'
        ? ride.destination_address.AddressNM
        : ride.destination_address.City;

    return `${origin} to ${dest}`;
  };

  // Card to display quick ride information
  const RideCard = ({ ride, onPress }: { ride: any; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={[styles.dateText, styles.cardText]}>
        {formatPickupTime(ride.PickUpTime)}
      </Text>
      <Text style={styles.cardText}>
        {ride.customer.FirstNM} {ride.customer.LastNM}
      </Text>
      <Text style={styles.cardText}>{formatAddresses(ride)}</Text>
      <Text style={styles.cardText}>{ride.RideStatus}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetch(`${API_URL}/rides`)
      .then((res) => res.json())
      .then((data) => {
        setAllRides(data);
      })
      .catch((err) => console.error('Could not pull rides: ', err));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.homepageTitle}>Today's Rides</Text>
      <View style={styles.cardsContainer}>
        {all_rides.map((ride) => (
          <View key={ride.RideId} style={styles.cardWrapper}>
            <RideCard
              ride={ride}
              onPress={() => {
                console.log('Clicked ride', ride.RideId);
              }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  homepageTitle: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#333',
    marginBottom: 15,
  },
  cardsContainer: {
    width: '100%',
  },
  cardWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f4f7',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    marginVertical: 4,
    fontSize: 15,
  },
});
