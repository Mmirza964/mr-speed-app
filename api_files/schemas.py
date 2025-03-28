from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserSchema(BaseModel):
    UserId: int
    FirstNM: str
    LastNM: str
    Username: str
    RoleNM: str
    Date_Created: datetime

    class Config:
        orm_mode = True

class AddressSchema(BaseModel):
    AddressId: int
    AddressNM: str
    StreetNMBR: str
    PrimaryStreetNM: str
    SecondaryStreetNM: Optional[str] = None
    City: str
    StateNM: str
    Zipcode: str
    Date_Created: datetime
    Date_Modified: datetime

    class Config:
        orm_mode = True

class CustomerSchema(BaseModel):
    CustomerId: int
    FirstNM: str
    LastNM: Optional[str] = None
    ShortDescription: Optional[str] = None
    PrimaryEmail: Optional[str] = None
    SecondaryEmail: Optional[str] = None
    PrimaryPhoneNMBR: str
    SecondaryPhoneNMBR: Optional[str] = None
    HomeAddress: Optional[int] = None 
    Date_Created: datetime
    Date_Modified: datetime

    class Config:
        orm_mode = True

class RideSchema(BaseModel):
    RideId: int
    CustomerId: int
    OriginAddress: int
    DestinationAddress: int
    PickUpTime: datetime
    Miles: float  
    EstRideTime: str
    Price: float 
    PassengerNMBR: Optional[int] = None
    NeedsCarSeat: bool
    DriverId: Optional[int] = None
    RideStatus: str
    Date_Created: datetime
    Date_Modified: datetime

    customer: Optional[CustomerSchema] = None
    origin_address: Optional[AddressSchema] = None
    destination_address: Optional[AddressSchema] = None
    driver: Optional[UserSchema] = None

    class Config:
        orm_mode = True