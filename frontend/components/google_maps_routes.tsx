import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBi94x_rdej-MTSO2AnWShzIqLIijwOAWg';

export const getRouteInfo = async (
  origin: string,
  destination: string,
  pickuptime: string
) => {
  const api_url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

  const body = {
    origin: origin,
    destination: destination,
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE',
    departureTime: pickuptime,
  };

  try {
    const response = await axios.post(api_url, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask':
          'routes.duration,routes.staticDuration,routes.distanceMeters,routes.polyline',
      },
    });

    const route = response.data.routes[0];
    return {
      duration: route.duration,
      staticDuration: route.staticDuration,
      distanceMeters: route.distanceMeters,
      polyline: route.polyline.encodedPolyline,
    };
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};
