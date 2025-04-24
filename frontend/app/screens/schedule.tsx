import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { getCustomers } from '../../components/api_calls';
import { getAddresses } from '../../components/api_calls';

export default function Schedule() {
  const [customer, setCustomer] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [pickuptime, setPickuptime] = useState('');
  const [miles, setMiles] = useState('0.00');
  const [rideTime, setRideTime] = useState('');
  const [price, setPrice] = useState('0.00');
  const [passengerNMBR, setPassNum] = useState('N/A');
  const [carSeat, setCarSeat] = useState(false);
  const [status, setStatus] = useState('Scheduled');

  const [customerData, setCustData] = useState<any[]>([]);
  const [addressData, setAddressData] = useState<any[]>([]);
  const [customerOptions, setCustomerOptions] = useState<{id: number, name: string}[]>([]);

  const [filteredCustomers, setFilteredCustomers] = useState<{ id: number, name: string }[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  // Pull all customers and addresses from the db on page load
  useEffect(() => {
    const fetchCustAddyData = async () => {
      try {
        const [custData, addyData] = await Promise.all([
          getCustomers(),
          getAddresses(),
        ]);
        setCustData(custData);
        setAddressData(addyData);

        const options = custData.map((cust: any) => ({
          id: cust.CustomerId,
          name: `${cust.FirstNM} ${cust.LastNM}`,
        }));

        setCustomerOptions(options);
      } catch (error) {
        console.error('Error loading customer and address data:', error);
      }
    };

    fetchCustAddyData();
  }, []); 

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Schedule</Text>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Customer:</Text>
        <TextInput 
          style={styles.inputField}
          value={customer}
          onChangeText={(text) => {
            setCustomer(text);
            const filtered = customerOptions.filter((cust: any) =>
              cust.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()));
            setFilteredCustomers(filtered);
          }}
          placeholder='Enter customer name...'
          placeholderTextColor="#888"
          />
          {filteredCustomers.map((cust) => (
            <Text
              key={cust.id}
              style={styles.dropdownOption}
              onPress={() => {
                setCustomer(cust.name);
                setSelectedCustomerId(cust.id);
                setFilteredCustomers([]);
              }}
            >
              {cust.name}
            </Text>
          ))}
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Origin:</Text>
        <TextInput 
          style={styles.inputField}
          value={origin}
          onChangeText={setOrigin}
          placeholder='Enter origin address...'
          placeholderTextColor="#888"
          />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Destination:</Text>
        <TextInput 
          style={styles.inputField}
          value={destination}
          onChangeText={setDestination}
          placeholder='Enter destination address...'
          placeholderTextColor="#888"
          />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Miles:</Text>
        <TextInput 
          style={styles.inputField}
          value={miles}
          onChangeText={setMiles}
          placeholder={miles}
          placeholderTextColor="#888"
          />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Price:</Text>
        <TextInput 
          style={styles.inputField}
          value={price}
          onChangeText={setPrice}
          placeholder={price}
          placeholderTextColor="#888"
          />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Status:</Text>
        <TextInput 
          style={styles.inputField}
          value={status}
          onChangeText={setStatus}
          placeholder={status}
          placeholderTextColor="#888"
          />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#333',
    marginBottom: 15,
  },
  text: {
    fontSize: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '90%',
  },
  
  inputLabel: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#444',
  },
  
  inputField: {
    flex: 2,
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  dropdownOption: {
    padding: 8,
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '90%',
    alignSelf: 'center',
  }
});
