import { View, Text, TouchableOpacity, ScrollView, Linking, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { GetPhotoReference } from '../services/GooglePlacesApi';

export default function HotelDetails() {
  const { hotelDetails } = useLocalSearchParams();

  let parsedHotelDetails = [];
  try {
    parsedHotelDetails = typeof hotelDetails === "string" ? JSON.parse(hotelDetails) : hotelDetails;
  } catch (error) {
    console.error("Error parsing hotelDetails:", error);
  }

  const [photoRefs, setPhotoRefs] = useState({});

  useEffect(() => {
    GetGooglePhotoRefs();
  }, []);

  const GetGooglePhotoRefs = async () => {
    const photoReferences = {};
    for (let hotel of parsedHotelDetails) {
      try {
        const res = await GetPhotoReference(hotel.hotelName);
        const photoRef = res?.results?.[0]?.photos?.[0]?.photo_reference || null;
        if (photoRef) {
          photoReferences[hotel.hotelName] = photoRef;
        }
      } catch (error) {
        console.error(`Error fetching photo for ${hotel.hotelName}:`, error);
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

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 30, textAlign: 'center', marginVertical: 10 }}>
          Hotel Details
        </Text>

        <View style={{ marginBottom: 40}}>
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
              {photoRefs[hotel.hotelName] ? (
                <Image
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRefs[hotel.hotelName]}&key=` + process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                  }}
                  style={{ height: 200, width: '100%', borderRadius:  10, resizeMode:'cover', alignSelf: 'center', marginBottom: 20}}
                />
              ) : (
                <Text style={{ textAlign: 'center', fontSize: 16, fontStyle: 'italic' }}>Loading image...</Text>
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