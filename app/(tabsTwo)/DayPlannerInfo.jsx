import { View, Text, TouchableOpacity, ScrollView, Linking, Image, Alert } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { GetPhotoReference } from '../services/GooglePlacesApi';
import Constants from 'expo-constants';

export default function DayPlanner() {
  const { dayPlanner } = useLocalSearchParams();
  const navigation = useNavigation();
  const [dayRefs, setDayRefs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [failedUrls, setFailedUrls] = useState(new Set());
  const key = Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    navigation.setOptions({ headerShown: true, headerTransparent: true, headerTitle: '' });
  }, [navigation]);

  const parsedDayPlanner = useMemo(() => {
    try {
      return dayPlanner ? JSON.parse(dayPlanner) : [];
    } catch (error) {
      console.error("Error parsing dayPlanner:", error);
      return [];
    }
  }, [dayPlanner]);

  const GetGoogleDayRefs = useCallback(async () => {
    if (!parsedDayPlanner.length || !isLoading) return;
    
    console.log("Starting to fetch photo references...");
    const placeReferences = {};
    const fetchPromises = parsedDayPlanner.flatMap(day => 
      Array.isArray(day.activities) ? 
        day.activities.map(async (activity) => {
          if (!activity?.placeName) return;
          
          try {
            console.log("Fetching photo reference for:", activity.placeName);
            const res = await GetPhotoReference(activity.placeName);
            console.log("Response for", activity.placeName, ":", res);
            const placeRef = res?.results?.[0]?.photos?.[0]?.photo_reference || null;
            if (placeRef) {
              placeReferences[activity.placeName] = placeRef;
              console.log("Got photo reference for", activity.placeName, ":", placeRef);
            } else {
              console.log("No photo reference found for", activity.placeName);
            }
          } catch (error) {
            console.error(`Error fetching photo for ${activity.placeName}:`, error);
          }
        }) 
      : []
    );

    await Promise.all(fetchPromises);
    console.log("Final place references:", placeReferences);
    setDayRefs(placeReferences);
    setIsLoading(false);
  }, [parsedDayPlanner, isLoading]);

  useEffect(() => {
    GetGoogleDayRefs();
  }, [GetGoogleDayRefs]);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const ImageComponent = ({ activity }) => {
    const [localImageLoadError, setLocalImageLoadError] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    const handleImageError = (url) => {
      console.log(`Failed to load image for ${activity.placeName} from URL: ${url}`);
      setFailedUrls(prev => new Set([...prev, url]));
      setLocalImageLoadError(true);
      setLocalLoading(false);
    };

    // Try direct URL first
    if (activity.placeImageUrl && 
        activity.placeImageUrl !== "NA" && 
        !failedUrls.has(activity.placeImageUrl) && 
        !localImageLoadError && 
        isValidUrl(activity.placeImageUrl)) {
      return (
        <View>
          {localLoading && (
            <View style={{ 
              position: 'absolute',
              height: 200,
              width: '100%',
              borderRadius: 10,
              backgroundColor: '#f5f5f5',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1
            }}>
              <Text style={{ color: '#666', fontFamily: 'outfit' }}>Loading...</Text>
            </View>
          )}
          <Image
            source={{ uri: activity.placeImageUrl }}
            style={{ height: 200, width: '100%', borderRadius: 10, alignSelf: 'center', resizeMode: 'cover', marginBottom: 10 }}
            onError={() => handleImageError(activity.placeImageUrl)}
            onLoadStart={() => setLocalLoading(true)}
            onLoadEnd={() => setLocalLoading(false)}
          />
        </View>
      );
    }

    // Try Google Photos as fallback
    if (dayRefs[activity.placeName]) {
      const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${dayRefs[activity.placeName]}&key=${key}`;
      
      if (!failedUrls.has(googlePhotoUrl)) {
        return (
          <View>
            {localLoading && (
              <View style={{ 
                position: 'absolute',
                height: 200,
                width: '100%',
                borderRadius: 10,
                backgroundColor: '#f5f5f5',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1
              }}>
                <Text style={{ color: '#666', fontFamily: 'outfit' }}>Loading...</Text>
              </View>
            )}
            <Image
              source={{ uri: googlePhotoUrl }}
              style={{ height: 200, width: '100%', borderRadius: 10, alignSelf: 'center', resizeMode: 'cover', marginBottom: 10 }}
              onError={() => handleImageError(googlePhotoUrl)}
              onLoadStart={() => setLocalLoading(true)}
              onLoadEnd={() => setLocalLoading(false)}
            />
          </View>
        );
      }
    }

    // Fallback placeholder
    return (
      <View style={{ 
        height: 200, 
        width: '100%', 
        borderRadius: 10, 
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10 
      }}>
        <Text style={{ 
          textAlign: 'center', 
          fontSize: 16, 
          color: '#666',
          fontFamily: 'outfit-medium',
          padding: 10
        }}>
          {activity.placeName}
        </Text>
      </View>
    );
  };

  const handleTicketPress = (ticketUrl) => {
    if (!ticketUrl || ticketUrl === "NA" || !isValidUrl(ticketUrl)) {
      Alert.alert("Not Available", "Ticket booking is not available for this activity.");
      return;
    }
    Linking.openURL(ticketUrl);
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
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 30, textAlign: 'center', marginVertical: 10 }}>
          Day Planner
        </Text>

        {parsedDayPlanner.length > 0 ? (
          parsedDayPlanner.map((day, index) => (
            <View key={index} style={{ borderRadius: 10, padding: 10, borderWidth: 1, marginVertical: 5 }}>
              <Text style={{ fontFamily: 'outfit-bold', fontSize: 25, textAlign: 'center' }}>
                Day {day?.day || "N/A"}
              </Text>

              <Text style={{ fontFamily: 'outfit-medium', fontSize: 24 }}>Theme</Text>
              <Text style={{ fontFamily: 'outfit', fontSize: 20 }}>{day?.theme || "N/A"}</Text>

              <Text style={{ fontFamily: 'outfit-medium', fontSize: 24, marginTop: 10, marginBottom: 10, textAlign: 'center', borderWidth: 1, borderRadius: 10, marginHorizontal: 20 }}>
                Activities
              </Text>

              {Array.isArray(day.activities) && day.activities.length > 0 ? (
                day.activities.map((activity, idx) => (
                  <View key={idx} style={{ marginBottom: 15 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      <Text style={{ fontFamily: 'outfit-medium', fontSize: 20, marginBottom: 10 }}>Name: </Text>
                      <Text style={{ fontFamily: 'outfit', fontSize: 20, flex: 1 }}>{activity?.placeName || "N/A"}</Text>
                    </View>

                    <ImageComponent activity={activity} />

                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ fontFamily: 'outfit-medium', fontSize: 20, marginBottom: 5 }}>Details: </Text>
                      <Text style={{ fontFamily: 'outfit', fontSize: 18, textAlign: 'left' }}>{activity?.placeDetails || "N/A"}</Text>
                    </View>

                    {activity?.notes && (
                      <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontFamily: 'outfit-medium', fontSize: 20, marginBottom: 5 }}>Notes: </Text>
                        <Text style={{ fontFamily: 'outfit', fontSize: 18, textAlign: 'left' }}>{activity.notes}</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      onPress={() => handleTicketPress(activity?.placeticketUrl)}
                      style={{ backgroundColor: 'black', borderRadius: 6, margin: 10, padding: 10, justifyContent: 'center' }}
                    >
                      <Text style={{ color: 'white', textAlign: 'center', fontSize: 17, fontFamily: 'outfit' }}>Book Tickets</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleMapsPress(activity?.placeGeoCoordinates)}
                      style={{ backgroundColor: 'black', borderRadius: 6, margin: 10, padding: 10 }}
                    >
                      <Text style={{ color: 'white', textAlign: 'center', fontSize: 17, fontFamily: 'outfit' }}>📍 Open in Google Maps</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>No activities available</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 20 }}>No Day Planner Available</Text>
        )}
      </ScrollView>
    </View>
  );
}