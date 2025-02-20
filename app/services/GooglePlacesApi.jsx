// GooglePlacesApi.js
import Constants from 'expo-constants';
const key = Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;;

export const GetPhotoReference = async (placeName) => {
    try {
        if (!placeName) {
            console.warn('No place name provided to GetPhotoReference');
            return null;
        }

        const encodedPlaceName = encodeURIComponent(placeName);
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedPlaceName}&key=${key}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'ZERO_RESULTS') {
            console.log(`No results found for place: ${placeName}`);
            return null;
        }
        
        if (result.status !== 'OK') {
            console.error(`API returned status: ${result.status} for place: ${placeName}`);
            return null;
        }

        return result;
    } catch (error) {
        console.error(`Error in GetPhotoReference for ${placeName}:`, error);
        return null;
    }
};

// Add other Google Places API related functions here if needed
const GooglePlacesApi = {
    GetPhotoReference
};

export default GooglePlacesApi;