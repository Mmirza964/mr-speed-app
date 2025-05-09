import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { BlurView } from 'expo-blur';
import Modal from 'react-native-modal';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

const API_URL = 'https://happy-sweet-reindeer.ngrok-free.app';

export default function Rides() {
  const [all_rides, setAllRides] = useState<any[]>([]);
  const [selected_date, setNewDate] = useState(new Date());
  const [showCalender, setCalender] = useState(false);
  const [calendarAnim] = useState(new Animated.Value(0));
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const openCalendar = () => {
    setCalender(true);
    Animated.timing(calendarAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const closeCalendar = () => {
    Animated.timing(calendarAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCalender(false);
    });
  };

  const foramtDate = (date: Date) => {
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}-${year}`;
  };

  const getRides = (dateObj: Date) => {
    const date = foramtDate(dateObj);
    fetch(`${API_URL}/rides?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        setAllRides(data);
      })
      .catch((err) => console.error('Could not pull rides: ', err));
  };

  useEffect(() => {
    getRides(selected_date);
  }, []);

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

  const getOrNA = (value: any) => {
    return value ? value : 'Not available';
  };

  const formatFullAddress = (address: any) => {
    return `${getOrNA(address.StreetNMBR)} ${getOrNA(address.PrimaryStreetNM)}${
      address.SecondaryStreetNM ? ' ' + address.SecondaryStreetNM : ''
    }, ${getOrNA(address.City)}, ${getOrNA(address.StateNM)} ${getOrNA(
      address.Zipcode
    )}`;
  };

  const RideCard = ({ ride }: { ride: any }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedRide(ride);
        setModalVisible(true);
      }}
      style={styles.card}
    >
      <Text style={[styles.dateText, styles.cardText]}>
        {formatPickupTime(ride.PickUpTime)}
      </Text>
      <Text style={styles.cardText}>
        {ride.customer.FirstNM} {ride.customer.LastNM}
      </Text>
      <Text style={styles.cardText}>
        {ride.origin_address.City} to {ride.destination_address.City}
      </Text>
      <Text style={styles.cardText}>{ride.RideStatus}</Text>
    </TouchableOpacity>
  );

  const changeDay = (offset: number) => {
    const newDate = new Date(selected_date);
    newDate.setDate(newDate.getDate() + offset);
    setNewDate(newDate);
    getRides(newDate);
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.homepageTitle}>Rides</Text>
  
        <View style={styles.dateSwitcher}>
          <TouchableOpacity onPress={() => changeDay(-1)}>
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
  
          <TouchableOpacity onPress={openCalendar}>
            <Text style={styles.todayDate}>{foramtDate(selected_date)}</Text>
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => changeDay(1)}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
  
        {showCalender && (
          <View style={styles.overlay}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <Animated.View
              style={[
                styles.overlayContent,
                {
                  opacity: calendarAnim,
                  transform: [
                    {
                      scale: calendarAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity style={styles.closeButton} onPress={closeCalendar}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Calendar
                onDayPress={(day: any) => {
                  const [year, month, dayNum] = day.dateString.split('-').map(Number);
                  const newDate = new Date(year, month - 1, dayNum);
                  setNewDate(newDate);
                  getRides(newDate);
                  closeCalendar();
                }}
              />
            </Animated.View>
          </View>
        )}
  
        <View style={styles.cardsContainer}>
          {all_rides.length === 0 ? (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No rides scheduled for this day.</Text>
            </View>
          ) : (
            all_rides.map((ride) => (
              <View key={ride.RideId} style={styles.cardWrapper}>
                <RideCard ride={ride} />
              </View>
            ))
          )}
        </View>
  
        {isModalVisible && (
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        )}
  
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          onSwipeComplete={() => setModalVisible(false)}
          swipeDirection={['down']}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={600}
          animationOutTiming={500}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={500}
          style={{ margin: 0, justifyContent: 'flex-end' }}
        >
          <View style={styles.modalContent}>{/* modal content unchanged */}</View>
        </Modal>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  arrowText: {
    fontSize: 25,
    color: '#007AFF',
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
  dateSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  todayDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 7,
    marginRight: 7,
  },
  cardText: {
    marginVertical: 4,
    fontSize: 15,
    color: '#333',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  overlayContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  placeholderText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
});
