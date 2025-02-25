import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native'; 
import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { CreateTripContext } from '../../context/CreateTripContext';  // Import the context
import { GetPhotoReference } from '../../app/services/GooglePlacesApi';
import Constants from 'expo-constants';




// Example country, wonder, and top picks data with geometry, photos, and URLs
const countries = [
  { id: '1', name: 'India', code: 'in', description: 'India is a South Asian country with rich history, diverse cultures, and a rapidly growing economy, known for landmarks like the Taj Mahal.', geometry: { location: { lat: 20.0, lng: 78.0 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/india' },
  { id: '2', name: 'Canada', code: 'ca', description: 'Canada is the second-largest country in the world by land area, known for its stunning landscapes, multicultural cities, and friendly people.', geometry: { location: { lat: 56.0, lng: -106.0 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/canada' },
  { id: '3', name: 'USA', code: 'us', description: 'The United States of America is a federal republic consisting of 50 states, known for its cultural diversity, technological advancements, and strong economy.', geometry: { location: { lat: 38.0, lng: -97.0 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/usa' },
  { id: '4', name: 'Germany', code: 'de', description: 'Germany is a European nation known for its engineering, automotive industry, rich history, and strong economy.', geometry: { location: { lat: 51.1657, lng: 10.4515 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/germany' },
  { id: '5', name: 'Australia', code: 'au', description: 'Australia is a vast country known for its natural wonders, unique wildlife, and major cities like Sydney and Melbourne.', geometry: { location: { lat: -25.2744, lng: 133.7751 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/australia' },
  { id: '6', name: 'Brazil', code: 'br', description: 'Brazil is the largest country in South America, famous for the Amazon Rainforest, football, and the Rio Carnival.', geometry: { location: { lat: -14.2350, lng: -51.9253 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/brazil' },
  { id: '7', name: 'France', code: 'fr', description: 'France is a European country renowned for its art, fashion, cuisine, and landmarks like the Eiffel Tower.', geometry: { location: { lat: 46.6034, lng: 1.8883 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/france' },
  { id: '8', name: 'Japan', code: 'jp', description: 'Japan is an East Asian island nation known for its technology, unique culture, and historic sites like Kyoto temples.', geometry: { location: { lat: 36.2048, lng: 138.2529 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/japan' },
  { id: '9', name: 'Russia', code: 'ru', description: 'Russia is the largest country in the world, spanning two continents, known for its history, cold winters, and vast natural resources.', geometry: { location: { lat: 55.7558, lng: 37.6173 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/russia' },
];


const Discover = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  const [countryPhotos, setCountryPhotos] = useState({});
  const googlemapsApiKey= Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const fetchPhotos = async () => {
      const photos = {};
      for (const country of countries) {
        try {
          const photoResult = await GetPhotoReference(country.name);
          if (photoResult?.results?.[0]?.photos?.[0]?.photo_reference) {
            photos[country.id] = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoResult.results[0].photos[0].photo_reference}&key=${googlemapsApiKey}`;
          }
        } catch (error) {
          console.error(`Error fetching photo for ${country.name}:`, error);
        }
      }
      setCountryPhotos(photos);
    };

    fetchPhotos();
  }, []);

  const handleLocationSelect = async (item) => {
    try {
      const photoResult = await GetPhotoReference(item.name);
      const photoReference = photoResult?.results?.[0]?.photos?.[0]?.photo_reference;
      setTripData({ 
        locationInfo: {
          name: item.name,
          coordinates: item.geometry.location,
          photo: photoReference || null,
          url: item?.url,
        }
      });
      router.push('/create-trip/selectTraveller');
    } catch (error) {
      console.error("Error getting photo reference:", error);
      setTripData({ 
        locationInfo: {
          name: item.name,
          coordinates: item.geometry.location,
          photo: null,
          url: item?.url,
        }
      });
      router.push('/create-trip/selectTraveller');
    }
  };

  return (
    <View style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <View style={styles.header}>
      <Text style={styles.titles}>Discover</Text>
      <TouchableOpacity onPress={() => router.push('/create-trip/search-place')} >
        <Feather name="search" size={35} color="black" />
      </TouchableOpacity>
    </View>
    <ScrollView showsVerticalScrollIndicator={false}>
        {countries.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => handleLocationSelect(item)}>
            <Image 
              source={{ 
                uri: countryPhotos[item.id] || 'https://via.placeholder.com/400x200'
              }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.name}</Text>
                <Image 
                  source={{ 
                    uri: `https://flagcdn.com/w80/${item.code.toLowerCase()}.png`
                  }}
                  style={styles.flag}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
  },
  titles: {
    fontFamily: 'outfit-bold',
    fontSize: 35,
    marginBottom: 10,
    marginTop: 5,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 200,
  },
  textContainer: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  flag: {
    width: 30,
    height: 20,
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default Discover;