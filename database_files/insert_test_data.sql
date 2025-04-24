USE Mr_Speed_DB;

INSERT INTO Addresses(AddressNM, StreetNMBR, PrimaryStreetNM, City, StateNM, Zipcode) VALUES (
    'Logan', '45', 'Transportation Way', 'Boston', 'MA', '02128'
);

INSERT INTO Addresses(AddressNM, StreetNMBR, PrimaryStreetNM, City, StateNM, Zipcode) VALUES (
    'Test House', '96', 'Glen Ellen Blvd', 'Millis', 'MA', '02054'
);

INSERT INTO Addresses(AddressNM, StreetNMBR, PrimaryStreetNM, City, StateNM, Zipcode) VALUES (
    'Matts House', '2', 'Temi Rd', 'Framingham', 'MA', '01701'
);

INSERT INTO Addresses(AddressNM, StreetNMBR, PrimaryStreetNM, SecondaryStreetNM, City, StateNM, Zipcode) VALUES (
    'Test Apartment', '1', 'Village Rock Ln', '4', 'Natick', 'MA', '01760'
);

INSERT INTO Customer(FirstNM, LastNM, PrimaryEmail, PrimaryPhoneNMBR, HomeAddress) VALUES (
    'Matthew', 'Mirza', 'mathewfmirza@gmail.com', '5088089172', 2
);

INSERT INTO Customer(FirstNM, LastNM, PrimaryEmail, PrimaryPhoneNMBR, HomeAddress) VALUES (
    'Saransh', 'Singh', 'ssingh@gmail.com', '5088089172', 3
);

INSERT INTO Customer(FirstNM, LastNM, PrimaryEmail, PrimaryPhoneNMBR, HomeAddress) VALUES (
    'Zach', 'Ganz', 'zganz@gmail.com', '5088089172', 4
);

INSERT INTO Customer(FirstNM, LastNM, PrimaryEmail, PrimaryPhoneNMBR, HomeAddress) VALUES (
    'Igor', 'Zaltsman', 'izalts@gmail.com', '5088089172', 2
);

INSERT INTO Ride(CustomerId, OriginAddress, DestinationAddress, PickUpTime, Miles, EstRideTime, Price, RideStatus) VALUES (
    1, 2, 1, '2025-03-27 07:30:00', 25.00, '1h', 100.00, 'Scheduled'
);

INSERT INTO Ride(CustomerId, OriginAddress, DestinationAddress, PickUpTime, Miles, EstRideTime, Price, RideStatus) VALUES (
    1, 3, 1, '2025-03-24 11:30:00', 25.00, '1h', 100.00, 'Scheduled'
);

INSERT INTO Ride(CustomerId, OriginAddress, DestinationAddress, PickUpTime, Miles, EstRideTime, Price, RideStatus) VALUES (
    1, 4, 1, '2025-03-25 15:30:00', 25.00, '1h', 100.00, 'Scheduled'
);

INSERT INTO Ride(CustomerId, OriginAddress, DestinationAddress, PickUpTime, Miles, EstRideTime, Price, RideStatus) VALUES (
    1, 1, 2, '2025-03-26 20:45:00', 25.00, '1h', 100.00, 'Scheduled'
);