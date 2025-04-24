import axios from 'axios';

const API_URL = 'https://happy-sweet-reindeer.ngrok-free.app';

// Fetches all customers in the db from API
export const getCustomers = async () => {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
};


// Fetches all addresses in the db from API
export const getAddresses = async () => {
    const response = await axios.get(`${API_URL}/addresses`);
    return response.data;
};