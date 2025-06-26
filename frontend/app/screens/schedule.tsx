import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, findNodeHandle, UIManager, Switch, Alert} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getCustomers, getAddresses, createRide } from '../../components/api_calls';
import { Address } from '../../components/types/address';
import { computeRouteMetrics } from '../../components/google_maps_routes';

const formatAddress = (address: Address) => {
    const { StreetNMBR, PrimaryStreetNM, SecondaryStreetNM, City, StateNM, Zipcode } = address;
    const secondary = address.SecondaryStreetNM ? ` (${address.SecondaryStreetNM})` : '';
    return `${StreetNMBR} ${PrimaryStreetNM}${secondary}, ${City}, ${StateNM} ${Zipcode}`;
};

export default function Schedule() {
    const [customer, setCustomer] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [originId, setOriginId] = useState<number | null>(null);
    const [destinationId, setDestinationId] = useState<number | null>(null);
    const [miles, setMiles] = useState('0.00');
    const [price, setPrice] = useState('0.00');
    const [estTime, setEstTime] = useState('')
    //const [passengerNMBR, setPassNum] = useState('N/A');
    const [carSeat, setCarSeat] = useState(false);
    const [status, setStatus] = useState('Scheduled');
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [filteredAddresses, setFilteredAddresses] = useState<Address[]>([]);
    const [showAddressDropdown, setShowAddressDropdown] = useState(false);
    const [isOriginDropdown, setIsOriginDropdown] = useState(true);
    const [dropdownTop, setDropdownTop] = useState<number>(0);
    const [homeAddress, setHomeAddress] = useState<Address | null>(null);

    const customerInputRef = useRef(null);
    const originInputRef = useRef(null);
    const destinationInputRef = useRef(null);
    const scrollRef = useRef<ScrollView>(null);

    const [rideDateTime, setRideDateTime] = useState<Date | null>(null);
    const [picker, setPicker] = useState(false)
    const showPicker = () => setPicker(true)
    const hidePicker = () => setPicker(false)

    const resetForm = () => {
        setCustomer('');
        setOrigin('');
        setDestination('');
        setSelectedCustomerId(null);
        setOriginId(null);
        setDestinationId(null);
        setRideDateTime(null);
        setMiles('0.00');
        setEstTime('');
        setPrice('0.00');
        setCarSeat(false);
        setStatus('Scheduled');
        setShowDropdown(false);
        setShowAddressDropdown(false);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      };

    const handleDateTimeConfirm = (date: Date) => {
        setRideDateTime(date)
        hidePicker()
    }

    const formatDateTime = (date: Date): string => {
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      };

    const handleCalculatePress = async () => {
        if (!rideDateTime) {
            console.warn('Please select a pickup time before calculating.');
            return;
          }

        const time = rideDateTime.toISOString().split('.')[0] + 'Z'
        const res = await computeRouteMetrics(origin, destination, time)
        setPrice(String(50.0))
        setEstTime(String(res.duration))
        setMiles(String(res.distance))
    };

    const handleSubmit = async () => {
        if (!selectedCustomerId || !originId || !destinationId || !rideDateTime) {
            Alert.alert("Missing Fields", "Please complete all required fields before submitting.");
            return;
          }
        
          const payload = {
            CustomerId: selectedCustomerId,
            OriginAddress: originId,
            DestinationAddress: destinationId,
            PickUpTime: rideDateTime.toISOString(),
            Miles: parseFloat(miles),
            EstRideTime: estTime,
            Price: parseFloat(price),
            NeedsCarSeat: carSeat,
            RideStatus: status,
          };
        
          try {
            const result = await createRide(payload);
            console.log("Ride created:", result);
        
            Alert.alert("Success", "Ride has been scheduled!");
        
            resetForm()
            scrollRef.current?.scrollTo({ y: 0, animated: true });
        
          } catch (error) {
            console.error("Error creating ride:", error);
            Alert.alert("Error", "Failed to create ride. Please try again.");
          }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [custData, allAddresses] = await Promise.all([getCustomers(), getAddresses()]);

                const customerOptions = custData.map((cust) => ({
                    id: cust.CustomerId,
                    name: `${cust.FirstNM} ${cust.LastNM}`,
                    homeAddress: cust.home_address || null,
                }));
                setCustomerOptions(customerOptions);

                const addressList = allAddresses.map((addy) => ({ ...addy, isHome: false }));
                setAddresses(addressList);
            } catch (error) {
                console.error('Error loading customer and address data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const selected = customerOptions.find(c => c.id === selectedCustomerId);
        setHomeAddress(selected?.homeAddress || null);
    }, [selectedCustomerId, customerOptions]);

    const handleDropdownPosition = (ref: any) => {
        const inputHandle = findNodeHandle(ref.current);
        const scrollHandle = findNodeHandle(scrollRef.current);

        if (inputHandle != null && scrollHandle != null) {
            UIManager.measureLayout(
                inputHandle,
                scrollHandle,
                () => {},
                (x: number, y: number) => setDropdownTop(y + 40)
            );
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setShowDropdown(false); setShowAddressDropdown(false); }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.screenContainer}>
                    <ScrollView style={styles.container} contentContainerStyle={[styles.content, {paddingBottom: 180}]} ref={scrollRef} scrollEnabled={true} keyboardShouldPersistTaps="handled">
                        <Text style={styles.title}>Schedule</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Customer:</Text>
                            <TextInput
                                ref={customerInputRef}
                                style={styles.inputField}
                                value={customer}
                                onChangeText={(text) => {
                                    setCustomer(text);
                                    const filtered = customerOptions.filter((cust) =>
                                        cust.name.toLowerCase().includes(text.toLowerCase())
                                    );
                                    setFilteredCustomers(filtered);
                                    setShowDropdown(true);
                                    handleDropdownPosition(customerInputRef);
                                }}
                                onFocus={() => {
                                    setShowAddressDropdown(false);
                                    handleDropdownPosition(customerInputRef);
                                }}
                                placeholder="Enter customer name..."
                                placeholderTextColor="#888"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Origin:</Text>
                            <TextInput
                                ref={originInputRef}
                                style={styles.inputField}
                                value={origin}
                                onChangeText={(text) => {
                                    setOrigin(text);
                                    console.log(origin)
                                    setIsOriginDropdown(true);
                                    let filtered = addresses.filter((addy) =>
                                        formatAddress(addy).toLowerCase().includes(text.toLowerCase())
                                    );
                                    if (homeAddress) {
                                        filtered = [{ ...homeAddress, isHome: true }, ...filtered.filter(a => a.AddressId !== homeAddress.AddressId)];
                                    }
                                    setFilteredAddresses(filtered);
                                    setShowAddressDropdown(true);
                                    handleDropdownPosition(originInputRef);
                                }}
                                onFocus={() => {
                                    setShowDropdown(false);
                                    handleDropdownPosition(originInputRef);
                                }}
                                placeholder="Enter origin address..."
                                placeholderTextColor="#888"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Destination:</Text>
                            <TextInput
                                ref={destinationInputRef}
                                style={styles.inputField}
                                value={destination}
                                onChangeText={(text) => {
                                    setDestination(text);
                                    console.log(destination)
                                    setIsOriginDropdown(false);
                                    let filtered = addresses.filter((addy) =>
                                        formatAddress(addy).toLowerCase().includes(text.toLowerCase())
                                    );
                                    if (homeAddress) {
                                        filtered = [{ ...homeAddress, isHome: true }, ...filtered.filter(a => a.AddressId !== homeAddress.AddressId)];
                                    }
                                    setFilteredAddresses(filtered);
                                    setShowAddressDropdown(true);
                                    handleDropdownPosition(destinationInputRef);
                                }}
                                onFocus={() => {
                                    setShowAddressDropdown(true);
                                    handleDropdownPosition(destinationInputRef);
                                }}
                                placeholder="Enter destination address..."
                                placeholderTextColor="#888"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Pick-up Time:</Text>
                            <Pressable onPress={showPicker}>
                                <TextInput
                                    value = {rideDateTime ? formatDateTime(rideDateTime): ''}
                                    editable={false}
                                    pointerEvents='none'
                                    placeholder='Select date and time...'
                                    placeholderTextColor="#888"
                                    style={styles.inputField}
                                />
                            </Pressable>

                            <DateTimePickerModal
                                isVisible={picker}
                                mode='datetime'
                                onConfirm={handleDateTimeConfirm}
                                onCancel={hidePicker}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Miles:</Text>
                            <TextInput
                                    value = {miles}
                                    editable={false}
                                    pointerEvents='none'
                                    placeholder='Ride miles...'
                                    placeholderTextColor="#888"
                                    style={styles.inputField}
                                />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Estimated Time:</Text>
                            <TextInput
                                    value = {estTime}
                                    editable={false}
                                    pointerEvents='none'
                                    placeholder='Ride estimated time...'
                                    placeholderTextColor="#888"
                                    style={styles.inputField}
                                />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Price:</Text>
                            <TextInput
                                    value = {price}
                                    editable={false}
                                    pointerEvents='none'
                                    placeholder='Ride price...'
                                    placeholderTextColor="#888"
                                    style={styles.inputField}
                                />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Status:</Text>
                            <TextInput
                                    value = {status}
                                    editable={false}
                                    pointerEvents='none'
                                    placeholder='Ride status...'
                                    placeholderTextColor="#888"
                                    style={styles.inputField}
                                />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Car Seat Needed:</Text>
                            <View style={styles.switchRow}>
                                <Switch 
                                    value={carSeat}
                                    onValueChange={setCarSeat}
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={carSeat ? '#007AFF' : '#f4f3f4'}
                                />
                                <Text style={styles.switchValue}>{carSeat ? 'Yes' : 'No'}</Text>
                            </View>
                        </View>

                        <View style={styles.buttonRow}>
                            <Pressable style={styles.buttonLeft} onPress={handleCalculatePress}>
                                <Text style={styles.buttonText}>Calculate</Text>
                            </Pressable>
                            <Pressable style={styles.buttonRight} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </Pressable>
                        </View>
                    </ScrollView>

                    {showDropdown && filteredCustomers.length > 0 && (
                        <View style={[styles.dropdown, { top: dropdownTop }]}>
                            {filteredCustomers.map((item) => (
                                <Pressable
                                    key={item.id}
                                    style={styles.dropdownOption}
                                    onPress={() => {
                                        setCustomer(item.name);
                                        setSelectedCustomerId(item.id);
                                        setFilteredCustomers([]);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <Text style={styles.dropdownText}>{item.name}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    {showAddressDropdown && filteredAddresses.length > 0 && (
                        <View style={[styles.dropdown, { top: dropdownTop }]}>
                            {filteredAddresses.map((addy) => (
                                <Pressable
                                    key={addy.AddressId}
                                    style={styles.dropdownOption}
                                    onPress={() => {
                                        if (isOriginDropdown) {
                                            setOrigin(formatAddress(addy));
                                            setOriginId(addy.AddressId);
                                        } else {
                                            setDestination(formatAddress(addy));
                                            setDestinationId(addy.AddressId);
                                        }
                                        setFilteredAddresses([]);
                                        setShowAddressDropdown(false);
                                    }}
                                >
                                    <Text style={[styles.dropdownText, addy.isHome ? styles.homeAddressText : null]}>{formatAddress(addy)}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    screenContainer: { flex: 1 },
    container: { flex: 1 },
    content: { alignItems: 'center', paddingVertical: 20, paddingBottom: 100 },
    title: { fontWeight: 'bold', fontSize: 30, color: '#333', marginBottom: 15 },
    inputContainer: { width: '90%', marginBottom: 20 },
    inputLabel: { fontWeight: 'bold', fontSize: 15, color: '#444', marginBottom: 5 },
    inputField: { height: 40, borderColor: '#aaa', borderWidth: 1, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#fff' },
    dropdown: { position: 'absolute', left: '5%', width: '90%', backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, borderRadius: 10, maxHeight: 250, zIndex: 1000, elevation: 10 },
    dropdownOption: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
    dropdownText: { fontSize: 14, color: '#333' },
    homeAddressText: { fontWeight: 'bold', color: '#2a5d9f' },
    separator: { height: 2, backgroundColor: '#000', marginVertical: 5 },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      switchValue: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 25,
      },
      
      buttonLeft: {
        flex: 1,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        marginRight: 10,
        borderRadius: 8,
        alignItems: 'center',
      },
      
      buttonRight: {
        flex: 1,
        backgroundColor: '#28a745',
        paddingVertical: 12,
        marginLeft: 10,
        borderRadius: 8,
        alignItems: 'center',
      },
      
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
});