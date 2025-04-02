from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, DECIMAL, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session, joinedload
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import func
from fastapi import Query
import os
from datetime import datetime, timezone
from schemas import RideSchema, CustomerSchema, AddressSchema, UserSchema
from typing import List, Optional

# Establish connection to db using the url below
DATABASE_URL = os.getenv("DATABASE_URL")

# Creates an engine and creates a local session for each db instance inside each route
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# All of the classes below are tables in MySQL
# These modules create a Python copy of the db and use the classes as schemas in the routes
class Users(Base):
    __tablename__ = "Users"
    UserId = Column(Integer, primary_key=True, index=True)
    FirstNM = Column(String(50), nullable=False)
    LastNM = Column(String(50), nullable=False)
    Username = Column(String(20), nullable=False)
    UsrPassword = Column(String(30), nullable=False)
    RoleNM = Column(String(20), nullable=False)
    Date_Created = Column(DateTime, default=datetime.now, nullable=False)
    
    rides = relationship("Ride", back_populates="driver")

class Addresses(Base):
    __tablename__ = "Addresses"
    AddressId = Column(Integer, primary_key=True, index=True)
    AddressNM = Column(String(20), nullable=False)
    StreetNMBR = Column(String(10), nullable=False)
    PrimaryStreetNM = Column(String(20), nullable=False)
    SecondaryStreetNM = Column(String(20))
    City = Column(String(20), nullable=False)
    StateNM = Column(String(20), nullable=False)
    Zipcode = Column(String(10), nullable=False)
    Date_Created = Column(DateTime, default=datetime.now, nullable=False)
    Date_Modified = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

class Customer(Base):
    __tablename__ = "Customer"
    CustomerId = Column(Integer, primary_key=True, index=True)
    FirstNM = Column(String(50), nullable=False)
    LastNM = Column(String(50))
    ShortDescription = Column(String(50))
    PrimaryEmail = Column(String(50))
    SecondaryEmail = Column(String(50))
    PrimaryPhoneNMBR = Column(String(20), nullable=False)
    SecondaryPhoneNMBR = Column(String(20))
    HomeAddress = Column(Integer, ForeignKey("Addresses.AddressId"))
    Date_Created = Column(DateTime, default=datetime.now, nullable=False)
    Date_Modified = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    address = relationship("Addresses", backref="customer")

class Ride(Base):
    __tablename__ = "Ride"
    RideId = Column(Integer, primary_key=True, index=True)
    CustomerId = Column(Integer, ForeignKey("Customer.CustomerId"), nullable=False)
    OriginAddress = Column(Integer, ForeignKey("Addresses.AddressId"), nullable=False)
    DestinationAddress = Column(Integer, ForeignKey("Addresses.AddressId"), nullable=False)
    PickUpTime = Column(DateTime, nullable=False)
    Miles = Column(DECIMAL(10, 2), nullable=False)
    EstRideTime = Column(String(10), nullable=False)
    Price = Column(DECIMAL(7, 2), nullable=False)
    PassengerNMBR = Column(Integer)
    NeedsCarSeat = Column(Boolean, default=False, nullable=False)
    DriverId = Column(Integer, ForeignKey("Users.UserId"))
    RideStatus = Column(String(20), nullable=False)
    Date_Created = Column(DateTime, default=datetime.now, nullable=False)
    Date_Modified = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)
    
    customer = relationship("Customer", backref="rides")
    origin_address = relationship("Addresses", foreign_keys=[OriginAddress], backref="origin_rides")
    destination_address = relationship("Addresses", foreign_keys=[DestinationAddress], backref="destination_rides")
    driver = relationship("Users", foreign_keys=[DriverId], back_populates="rides")

# Builds all of the tables using the definitions above
Base.metadata.create_all(bind=engine)

# Creates an instance of the api
app = FastAPI()

# Used in each route to create an instance of the db
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

origins = [
    "http://localhost:8000", 
    "http://127.0.0.1:8000", 
    "http://10.0.2.2:8000", 
    "exp://127.0.0.1:19000", 
    "exp://10.0.2.2:19000", 
    "*", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}

@app.get("/rides", response_model=List[RideSchema])
def get_all_rides(date: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Ride)\
        .options(
            joinedload(Ride.customer),
            joinedload(Ride.origin_address),
            joinedload(Ride.destination_address),
            joinedload(Ride.driver),
        )

    if date:
        try:
            date_obj = datetime.strptime(date, "%m-%d-%Y").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Date must be in format MM-DD-YYYY")

        query = query.filter(func.date(Ride.PickUpTime) == date_obj)

    return query.all()