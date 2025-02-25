CREATE DATABASE IF NOT EXISTS Mr_Speed_DB;
USE Mr_Speed_DB;

CREATE TABLE IF NOT EXISTS Users (
    UserId INT AUTO_INCREMENT NOT NULL,
    FirstNM VARCHAR(50) NOT NULL,
    LastNM VARCHAR(50) NOT NULL,
    Username VARCHAR(20) NOT NULL,
    UsrPassword VARCHAR(30) NOT NULL,
    RoleNM VARCHAR(20) NOT NULL,
    Date_Created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (UserId)
);

CREATE TABLE IF NOT EXISTS Addresses (
    AddressId INT AUTO_INCREMENT NOT NULL,
    AddressNM VARCHAR(20),
    StreetNMBR VARCHAR(10) NOT NULL,
    PrimaryStreetNM VARCHAR(20) NOT NULL,
    SecondaryStreetNM VARCHAR(20),
    City VARCHAR(20) NOT NULL,
    StateNM VARCHAR(20) NOT NULL,
    Zipcode VARCHAR(10) NOT NULL,
    Date_Created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    Date_Modified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
                    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (AddressId)
);

CREATE TABLE IF NOT EXISTS Customer (
    CustomerId INT AUTO_INCREMENT NOT NULL,
    FirstNM VARCHAR(50) NOT NULL,
    LastNM VARCHAR(50),
    ShortDescription VARCHAR(50),
    PrimaryEmail VARCHAR(50),
    SecondaryEmail VARCHAR(50),
    PrimaryPhoneNMBR VARCHAR(20) NOT NULL,
    SecondaryPhoneNMBR VARCHAR(20),
    HomeAddress INT,
    Date_Created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    Date_Modified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
                    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (CustomerId),
    FOREIGN KEY (HomeAddress) REFERENCES Addresses(AddressId)
                    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS Ride (
    RideId INT AUTO_INCREMENT NOT NULL,
    CustomerId INT NOT NULL,
    OriginAddress INT NOT NULL,
    DestinationAddress INT NOT NULL,
    PickUpTime DATETIME NOT NULL,
    Miles DECIMAL(10, 2) NOT NULL,
    EstRideTime VARCHAR(10) NOT NULL,
    Price DECIMAL(7, 2) NOT NULL,
    PassengerNMBR INT,
    NeedsCarSeat BOOLEAN DEFAULT FALSE NOT NULL,
    DriverId INT,
    RideStatus VARCHAR(20) NOT NULL,
    Date_Created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    Date_Modified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
                    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (RideId),
    FOREIGN KEY (OriginAddress) REFERENCES Addresses(AddressId)
                    ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (DestinationAddress) REFERENCES Addresses(AddressId)
                    ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (DriverId) REFERENCES Users(UserId)
                    ON UPDATE CASCADE ON DELETE RESTRICT
);