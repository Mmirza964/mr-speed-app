from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, DECIMAL, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
import os
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "Users"
    UserId = Column(Integer, primary_key=True, index=True)
    FirstNM = Column(String(50), nullable=False)
    LastNM = Column(String(50), nullable=False)
    Username = Column(String(20), nullable=False)
    Password = Column(String(30), nullable=False)
    Role = Column(String(20), nullable=False)
    Date_Created = Column(DateTime, default=datetime.timezone.utc, nullable=False)
    
    rides = relationship("Ride", back_populates="driver")

class Address(Base):
    __tablename__ = "Address"
    AddressId = Column(Integer, primary_key=True, index=True)
    AddressNM = Column(String(20), nullable=False)
    StreetNMBR = Column(String(10), nullable=False)
    PrimaryStreetNM = Column(String(20), nullable=False)
    SecondaryStreetNM = Column(String(20))
    City = Column(String(20), nullable=False)
    State = Column(String(20), nullable=False)
    Zipcode = Column(String(10), nullable=False)
    Date_Created = Column(DateTime, default=datetime.timezone.utc, nullable=False)
    Date_Modified = Column(DateTime, default=datetime.timezone.utc, onupdate=datetime.timezone.utc, nullable=False)

class Customer(Base):
    __tablename__ = "Customer"
    CustomerId = Column(Integer, primary_key=True, index=True)
    FirstNM = Column(String(50), nullable=False)
    LastNM = Column(String(50))
    Description = Column(String(50))
    PrimaryEmail = Column(String(50))
    SecondaryEmail = Column(String(50))
    PrimaryPhoneNMBR = Column(String(20), nullable=False)
    SecondaryPhoneNMBR = Column(String(20))
    HomeAddress = Column(Integer, ForeignKey("Address.AddressId"))
    Date_Created = Column(DateTime, default=datetime.timezone.utc, nullable=False)
    Date_Modified = Column(DateTime, default=datetime.timezone.utc, onupdate=datetime.timezone.utc, nullable=False)

    address = relationship("Address", backref="customers")

class Rides(Base):
    __tablename__ = "Ride"
    RideId = Column(Integer, primary_key=True, index=True)
    CustomerId = Column(Integer, ForeignKey("Customer.CustomerId"), nullable=False)
    OriginAddress = Column(Integer, ForeignKey("Address.AddressId"), nullable=False)
    DestinationAddress = Column(Integer, ForeignKey("Address.AddressId"), nullable=False)
    PickUpTime = Column(DateTime, nullable=False)
    Miles = Column(DECIMAL(10, 2), nullable=False)
    EstRideTime = Column(String(10), nullable=False)
    Price = Column(DECIMAL(7, 2), nullable=False)
    PassengerNMBR = Column(Integer)
    NeedsCarSeat = Column(Boolean, default=False, nullable=False)
    DriverId = Column(Integer, ForeignKey("Users.UserId"))
    Status = Column(String(20), nullable=False)
    Date_Created = Column(DateTime, default=datetime.timezone.utc, nullable=False)
    Date_Modified = Column(DateTime, default=datetime.timezone.utc, onupdate=datetime.timezone.utc, nullable=False)
    
    customer = relationship("Customer", backref="rides")
    origin_address = relationship("Address", foreign_keys=[OriginAddress], backref="origin_rides")
    destination_address = relationship("Address", foreign_keys=[DestinationAddress], backref="destination_rides")
    driver = relationship("User", foreign_keys=[DriverId], back_populates="rides")

Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
