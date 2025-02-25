import { View, Text, TouchableOpacity, ScrollView, Linking, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { GetPhotoReference } from '../services/GooglePlacesApi';
import Constants from 'expo-constants';

export default function HotelDetails() {
  const { hotelDetails } = useLocalSearchParams();
  const googlemapsApiKey = Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

  let parsedHotelDetails = [];
  try {
    parsedHotelDetails = typeof hotelDetails === "string" ? JSON.parse(hotelDetails) : hotelDetails;
  } catch (error) {
    console.error("Error parsing hotelDetails:", error);
  }

  const [photoRefs, setPhotoRefs] = useState({});
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  useEffect(() => {
    if (googlemapsApiKey) {
      GetGooglePhotoRefs();
    }
  }, [googlemapsApiKey]);

  const GetGooglePhotoRefs = async () => {
    const photoReferences = {};
    for (let hotel of parsedHotelDetails) {
      if (!hotel.hotelName) continue;
      
      try {
        const res = await GetPhotoReference(hotel.hotelName);
        const photoRef = res?.results?.[0]?.photos?.[0]?.photo_reference;
        if (photoRef) {
          photoReferences[hotel.hotelName] = photoRef;
        }
      } catch (error) {
        console.error(`Error fetching photo for ${hotel.hotelName}:`, error);
        setImageLoadErrors(prev => ({
          ...prev,
          [hotel.hotelName]: true
        }));
      }
    }
    setPhotoRefs(photoReferences);
  };

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
  }, [navigation]);

  const getImageUrl = (hotelName) => {
    if (!photoRefs[hotelName] || !googlemapsApiKey) return null;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRefs[hotelName]}&key=${googlemapsApiKey}`;
  };

  const handleMapsPress = (coordinates) => {
    const { latitude, longitude } = coordinates || {};
    if (!latitude || !longitude) {
      Alert.alert("Not Available", "Location coordinates are not available for this activity.");
      return;
    }
    Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 30, textAlign: 'center', marginVertical: 10 }}>
          Hotel Details
        </Text>

        <View style={{ marginBottom: 40 }}>
          {parsedHotelDetails && Array.isArray(parsedHotelDetails) && parsedHotelDetails.length > 0 ? (
            parsedHotelDetails.map((hotel, index) => (
              <View
                key={index}
                style={{
                  borderRadius: 10,
                  padding: 15,
                  borderWidth: 1,
                  marginBottom: 10,
                  backgroundColor: '#f8f8f8',
                }}
              >
                {/* Hotel Image */}
                {getImageUrl(hotel.hotelName) && !imageLoadErrors[hotel.hotelName] ? (
                  <Image
                    source={{ uri: getImageUrl(hotel.hotelName) }}
                    style={{
                      height: 200,
                      width: '100%',
                      borderRadius: 10,
                      resizeMode: 'cover',
                      alignSelf: 'center',
                      marginBottom: 20
                    }}
                    onError={() => {
                      setImageLoadErrors(prev => ({
                        ...prev,
                        [hotel.hotelName]: true
                      }));
                    }}
                  />
                ) : (
                  <View style={{
                    height: 200,
                    width: '100%',
                    backgroundColor: '#e0e0e0',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20
                  }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, fontStyle: 'italic', color: '#666' }}>
                      {imageLoadErrors[hotel.hotelName] ? 'Failed to load image' : 'Loading image...'}
                    </Text>
                  </View>
                )}

                <Text style={{ fontFamily: 'outfit-medium', fontSize: 18, marginBottom: 5 }}>
                  🏨 {hotel?.hotelName || "N/A"}
                </Text>

                <Text style={{ fontFamily: 'outfit-medium', fontSize: 16, marginBottom: 5 }}>
                  💰 Price: {hotel?.hotelPrice?.currency} {hotel?.hotelPrice?.amount || "0"}
                </Text>

                <Text style={{ fontFamily: 'outfit-medium', fontSize: 16, marginBottom: 5 }}>
                  ⭐ Rating: {hotel?.hotelRating || "N/A"}
                </Text>

                <Text style={{ fontFamily: 'outfit-medium', fontSize: 16, marginBottom: 10 }}>
                  📍 Location: Lat {hotel?.hotelGeoCoordinates?.latitude || "N/A"}, Lng {hotel?.hotelGeoCoordinates?.longitude || "N/A"}
                </Text>


                {/* Booking Button */}
                {hotel?.hotelBookingUrl && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(hotel?.hotelBookingUrl)}
                    style={{
                      backgroundColor: 'black',
                      borderRadius: 6,
                      paddingVertical: 12,
                      paddingHorizontal: 15,
                      alignSelf: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 17, fontFamily: 'outfit-medium' }}>
                      Book Here
                    </Text>
                  </TouchableOpacity>
                )}

                {hotel?.hotelGeoCoordinates && <TouchableOpacity
                                      onPress={() => handleMapsPress(hotel?.hotelGeoCoordinates)}
                                      style={{ backgroundColor: 'black', borderRadius: 6, margin: 10, padding: 10 }}
                                    >
                                      <Text style={{ color: 'white', textAlign: 'center', fontSize: 17, fontFamily: 'outfit' }}>📍 Open in Google Maps</Text>
                                    </TouchableOpacity> }

              </View>
            ))
          ) : (
            <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 20, fontFamily: 'outfit-medium' }}>
              No Hotel Details Available
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}