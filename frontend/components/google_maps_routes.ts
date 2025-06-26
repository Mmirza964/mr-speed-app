import axios from 'axios';
import { Address } from '../components/types/address'

const GOOGLE_MAPS_API_KEY = 'AIzaSyBi94x_rdej-MTSO2AnWShzIqLIijwOAWg';
const ROUTE_API_ENDPOINT = 'https://routes.googleapis.com/directions/v2:computeRoutes';
const GEOCODE_API_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';

export const computeRouteMetrics = async (originAddy: string, destinationAddy: string, pickup: string): Promise<{distance: number; duration: number}> => {
    try {
        const originId = await geoCodeAddress(originAddy);
        const destinationId = await geoCodeAddress(destinationAddy);

        const requestBody = {
           origin: {
                placeId: originId
                
            },
            destination: {
                placeId: destinationId
            },
            travelMode: "DRIVE",
            routingPreference: "TRAFFIC_AWARE",
            departureTime: pickup,
            units: "IMPERIAL",
            languageCode: "en-US"
        };

        console.log('GOOGLE_MAPS_API_KEY:', GOOGLE_MAPS_API_KEY);
        console.log('Sending request body:', JSON.stringify(requestBody, null, 2));

        const res = await axios.post(
            ROUTE_API_ENDPOINT,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-key': GOOGLE_MAPS_API_KEY,
                    'X-Goog-FieldMask': 'routes.legs.distanceMeters,routes.legs.duration,routes.distanceMeters,routes.duration'
                }
            }
        );

        const data = res.data.routes[0].legs[0]
        console.log(data)
        const miles = Math.round((data.distanceMeters / 1609.34) * 10) / 10

        const seconds = parseInt(data.duration, 10)
        const minutes = Math.round(seconds / 60)

        return {
        distance: miles,
        duration: minutes
        };
    } catch (error: any) {
        console.error('Error in main function:', error?.response?.data || error.message);
        throw error;
    }
};

const geoCodeAddress = async (address: string): Promise<string> => {
    const res = await axios.get(GEOCODE_API_ENDPOINT, {
        params: {
            address: address,
            key: GOOGLE_MAPS_API_KEY
        }
    });

    const results = res.data.results
    console.log(results[0])

    return results[0].place_id
};

const cleanTime = (time: string): number => {
    const seconds = parseInt(time, 10)
    const minutes = Math.round(seconds / 60)

    return minutes
};

const addressToString = (address: Address): string => {
    return `${address.StreetNMBR} ${address.PrimaryStreetNM}, ${address.City}, ${address.StateNM} ${address.Zipcode}`
}