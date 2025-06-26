import axios from 'axios';
import { Address } from "../components/types/address";
import { Customer } from "../components/types/customer";
import { Ride } from "../components/types/ride";
import { User } from "../components/types/user";

const API_URL = 'https://happy-sweet-reindeer.ngrok-free.app';

// Fetches all customers in the db from API
export const getCustomers = async (): Promise<Customer[]> => {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
};

// Fetches all addresses in the db from API
export const getAddresses = async (): Promise<Address[]> => {
    const response = await axios.get(`${API_URL}/addresses`);
    return response.data;
};

export const createRide = async (ride: Omit<Ride, 'RideId' | 'Date_Created' | 'Date_Modified'>): Promise<any> => {
    const response = await axios.post(`${API_URL}/rides`, ride, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  };