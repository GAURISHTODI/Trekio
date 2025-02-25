import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import UserTripCard from './UserTripCard';
import { useRouter } from 'expo-router';
import { GetPhotoReference } from '../../app/services/GooglePlacesApi';
import Constants from 'expo-constants';

export default function UserTripList({ userTrips, selectedTripIndex = 0, onTripSelect }) {
  const router = useRouter();
  const [parsedSelectedTrip, setParsedSelectedTrip] = useState(null);
  const [locationPhotoRef, setLocationPhotoRef] = useState(null);
  const googlemapsApiKey= Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (userTrips && userTrips.length > 0 && userTrips[selectedTripIndex]?.tripData) {
      try {
        const parsed = JSON.parse(userTrips[selectedTripIndex].tripData);
        setParsedSelectedTrip(parsed);
        
        // If no photo reference exists, try to fetch one
        if (!parsed?.locationInfo?.photo && parsed?.locationInfo?.name) {
          fetchPhotoReference(parsed.locationInfo.name);
        }
      } catch (error) {
        console.error("Error parsing trip data:", error);
      }
    }
  }, [userTrips, selectedTripIndex]);

  const fetchPhotoReference = async (locationName) => {
    try {
      const result = await GetPhotoReference(locationName);
      if (result?.results?.[0]?.photos?.[0]?.photo_reference) {
        setLocationPhotoRef(result.results[0].photos[0].photo_reference);
      }
    } catch (error) {
      console.error("Error fetching photo reference:", error);
    }
  };

  const getImageSource = () => {
    // Try to use the photo reference from trip data first
    if (parsedSelectedTrip?.locationInfo?.photo) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${parsedSelectedTrip.locationInfo.photo}&key=${googlemapsApiKey}`;
    }
    // If not available, use the fetched photo reference
    else if (locationPhotoRef) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${locationPhotoRef}&key=${googlemapsApiKey}`;
    }
    // Fallback to placeholder
    return `https://via.placeholder.com/400x200.png?text=${encodeURIComponent(userTrips[selectedTripIndex]?.tripPlan?.tripDetails?.location || "No Image")}`;
  };

  if (!userTrips || userTrips.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: "center", fontFamily: 'outfit-medium', fontSize: 18 }}>
          No trips available
        </Text>
      </View>
    );
  }

  if (!userTrips[selectedTripIndex]?.tripPlan || !userTrips[selectedTripIndex]?.tripPlan.tripDetails) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: "center", fontFamily: 'outfit-medium', fontSize: 18 }}>
          Selected trip data is incomplete
        </Text>
      </View>
    );
  }

  const otherTrips = [...userTrips];
  otherTrips.splice(selectedTripIndex, 1);

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 10 }}>
        <View style={{ padding: 5, borderWidth: 1, borderRadius: 10, borderColor: '#e0e0e0', backgroundColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <Image 
            source={{ uri: getImageSource() }}
            style={{ height: 200, width: '100%', borderRadius: 10, marginTop: 5 }}
            resizeMode="cover"
          />

          <View style={{ padding: 10 }}>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 23, textAlign: 'center', borderWidth: 1, borderRadius: 10, padding: 5, borderColor: '#e0e0e0' }}>
              {userTrips[selectedTripIndex].tripPlan.tripDetails.location || 'Unknown Location'}
            </Text>

            <View style={{ marginTop: 15 }}>
              <Text style={{ fontFamily: 'outfit-bold', fontSize: 15 }}>TRAVELLER: {parsedSelectedTrip?.traveller?.title || 'Not specified'}</Text>
              <Text style={{ fontFamily: 'outfit-bold', fontSize: 15 }}>BUDGET: {parsedSelectedTrip?.budget || 'Not specified'}</Text>
              {parsedSelectedTrip?.startDate && parsedSelectedTrip?.endDate && (
                <Text style={{ fontFamily: 'outfit-bold', fontSize: 15 }}>
                  DATES: {moment(parsedSelectedTrip.startDate).format('DD MMM YYYY')} to {moment(parsedSelectedTrip.endDate).format('DD MMM YYYY')}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={{ borderWidth: 1, marginTop: 30, padding: 15, borderRadius: 10, backgroundColor: 'black', borderColor: 'black' }}
              onPress={() => router.push({
                pathname: '/FlightDetails',
                params: {
                  flightDetails: JSON.stringify(userTrips[selectedTripIndex].tripPlan.flightDetails || {}),
                  hotelDetails: JSON.stringify(userTrips[selectedTripIndex].tripPlan.hotelDetails || {}),
                  dayPlanner: JSON.stringify(userTrips[selectedTripIndex].tripPlan.dayPlanner || []),
                  tripDetails: JSON.stringify(userTrips[selectedTripIndex].tripPlan.tripDetails || {}),
                }
              })}
            >
              <Text style={{ fontFamily: 'outfit-medium', textAlign: 'center', color: 'white', fontSize: 19 }}>See your plan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {otherTrips.length > 0 && (
          <View style={{ marginTop: 25 }}>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 20, marginBottom: 10 }}>Your Other Trips</Text>
            <FlatList
              data={otherTrips}
              keyExtractor={(item, index) => `trip-${index}`}
              renderItem={({ item, index }) => {
                const originalIndex = index >= selectedTripIndex ? index + 1 : index;
                return (
                  <TouchableOpacity onPress={() => onTripSelect(originalIndex)} activeOpacity={0.7}>
                    <UserTripCard userTrips={item} />
                  </TouchableOpacity>
                );
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}