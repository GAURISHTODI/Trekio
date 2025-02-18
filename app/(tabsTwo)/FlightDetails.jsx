import { View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function FlightDetails() {
  const { flightDetails } = useLocalSearchParams();  

  // Ensure flightDetails is parsed correctly
  let parsedFlightDetails = [];
  try {
    parsedFlightDetails = typeof flightDetails === "string" ? JSON.parse(flightDetails) : flightDetails;
  } catch (error) {
    console.error("Error parsing flightDetails:", error);
  }

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, }}>
      {/* Scrollable Content */}
      <ScrollView style={{ flex: 1, padding: 20, }}>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 30, textAlign: 'center', marginVertical: 10 , marginTop: 20}}>
          Flight Details
        </Text>

        {parsedFlightDetails && Array.isArray(parsedFlightDetails) && parsedFlightDetails.length > 0 ? (
          parsedFlightDetails.map((item, index) => (
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
              <Text style={{ fontFamily: 'outfit-medium', fontSize: 16, marginBottom: 5 }}>
                ✈️ Airline: <Text style={{ fontFamily: 'outfit' }}>{item?.flightName || "N/A"}</Text>
              </Text>
              <Text style={{ fontFamily: 'outfit-medium', fontSize: 16, marginBottom: 10 }}>
                💰 Price: <Text style={{ fontFamily: 'outfit' }}>{item?.flightPrice?.currency} {item?.flightPrice?.amount || "0"}</Text>
              </Text>

              {item?.flightBookingUrl && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.flightBookingUrl)}
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
            No Flight Details Available
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
