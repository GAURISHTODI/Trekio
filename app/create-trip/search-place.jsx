import { View, Text } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { CreateTripContext } from './../../context/CreateTripContext';
import LottieView from "lottie-react-native";
import Constants from "expo-constants";

const SearchPlace = () => {
  const router = useRouter();
  const key= Constants.expoConfig.extra. GOOGLE_MAPS_API_KEY
  
  const { tripData, setTripData } = useContext(CreateTripContext);


  useEffect(() => {
    console.log("Tripppp", tripData);
  }, [tripData]);

  const GOOGLE_MAPS_API_KEY = key;
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is missing');
  }

  return (
    <View style={{ flex: 1, padding: 20, margin: 10, marginTop: 20 }}>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 35, marginBottom: 30 }}>Search Place</Text>
      <View style={{ zIndex: 1000, position: 'relative' }}>
        <GooglePlacesAutocomplete
          placeholder="Search Place"
          fetchDetails={true}
          enablePoweredByContainer={false}
          styles={{
            container: {
              flex: 0,
            },
            textInputContainer: {
              borderRadius: 5,
            },
            textInput: {
              borderRadius: 5,
              fontSize: 16,
              padding: 10,
              backgroundColor: "#fff",
              height: 50,
            },
            listView: {
              backgroundColor: 'white',
              borderRadius: 5,
              marginTop: 5,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
            row: {
              padding: 13,
              height: 44,
              fontSize: 14,
            },
            description: {
              fontSize: 14,
            },
          }}
          onPress={(data, details = null) => {
            if (!details) return;
            console.log(data.description);
            console.log(details.geometry.location);
            console.log(details?.photos?.[0]?.photo_reference);
            console.log(details?.url);

            setTripData({
              locationInfo: {
                name: data.description,
                coordinates: details.geometry.location,
                photo: details?.photos?.[0]?.photo_reference,
                url: details?.url,
              }
            });

            router.push('/create-trip/selectTraveller');
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
            language: 'en',
          }}
        />
      </View>

      <LottieView
        source={require('../../assets/images/tripgeneration.json')}
        autoPlay
        loop
        style={{ width: '100%', height: 300, zIndex: 1 }}
      />
    </View>
  );
};

export default SearchPlace;