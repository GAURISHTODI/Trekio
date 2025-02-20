import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import moment from 'moment';
import Constants from "expo-constants";

export default function UserTripCard({ userTrips }) {
  const formatData = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing trip data in UserTripCard:", error);
      return {};
    }
  }

  const tripData = userTrips.tripData ? formatData(userTrips.tripData) : {};
  const mapsKey= Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY
  
  return (
    <View style={styles.container}>
      <View style={styles.cardContent}>
        <Image 
          source={{
            uri: tripData?.locationInfo?.photo
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${tripData.locationInfo.photo}&key=` + mapsKey
              : 'https://via.placeholder.com/100x100?text=No+Image'
          }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.locationText}>
            {userTrips?.tripPlan?.tripDetails?.location || 'Unknown Location'}
          </Text>
          <Text style={styles.dateText}>
            {tripData.startDate ? moment(tripData.startDate).format('DD MMM YYYY') : 'No date'}
          </Text>
          <Text style={styles.travellerText}>
            {tripData.traveller?.title || 'Not specified'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginRight: 15,
    width: 250,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  image: {
    borderRadius: 5,
    height: 100,
    width: 100,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  locationText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
  dateText: {
    fontFamily: 'outfit',
    color: 'grey',
    marginTop: 4,
  },
  travellerText: {
    fontFamily: 'outfit',
    color: 'grey',
    marginTop: 4,
  }
});