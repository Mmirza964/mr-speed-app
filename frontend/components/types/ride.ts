import { Customer } from "../types/customer";
import { Address } from "../types/address";
import { User } from "../types/user";

export interface Ride {
    RideId: number;
    CustomerId: number;
    OriginAddress: number;
    DestinationAddress: number;
    PickUpTime: string;
    Miles: number;
    EstRideTime: string;
    Price: number;
    PassengerNMBR?: number;
    NeedsCarSeat: boolean;
    DriverId?: number;
    RideStatus: string;
    Date_Created: string;
    Date_Modified: string;

    customer?: Customer;
    origin_address?: Address;
    destination_address?: Address;
    driver?: User;
}