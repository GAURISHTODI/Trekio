import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native'; 
import React, { useContext } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { CreateTripContext } from '../../context/CreateTripContext';  // Import the context
import { GetPhotoReference } from '../../app/services/GooglePlacesApi';


// Example country, wonder, and top picks data with geometry, photos, and URLs
const countries = [
  { id: '1', name: 'USA', code: 'us', description: 'USA Description', geometry: { location: { lat: 38.0, lng: -97.0 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/usa' },
  { id: '2', name: 'Canada', code: 'ca', description: 'Canada Description', geometry: { location: { lat: 56.0, lng: -106.0 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/canada' },
  { id: '3', name: 'India', code: 'in', description: 'India Description', geometry: { location: { lat: 20.0, lng: 78.0 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/india' },
  { id: '4', name: 'Germany', code: 'de', description: 'Germany Description', geometry: { location: { lat: 51.1657, lng: 10.4515 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/germany' },
  { id: '5', name: 'Australia', code: 'au', description: 'Australia Description', geometry: { location: { lat: -25.2744, lng: 133.7751 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/australia' },
  { id: '6', name: 'Brazil', code: 'br', description: 'Brazil Description', geometry: { location: { lat: -14.2350, lng: -51.9253 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/brazil' },
  { id: '7', name: 'France', code: 'fr', description: 'France Description', geometry: { location: { lat: 46.6034, lng: 1.8883 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/france' },
  { id: '8', name: 'Japan', code: 'jp', description: 'Japan Description', geometry: { location: { lat: 36.2048, lng: 138.2529 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/japan' },
  { id: '9', name: 'Russia', code: 'ru', description: 'Russia Description', geometry: { location: { lat: 55.7558, lng: 37.6173 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/russia' },];

const wonders = [
  { id: '1', name: 'Great Wall of China', description: 'The Great Wall of China is a series of fortifications built across the northern borders of China.', geometry: { location: { lat: 40.4319, lng: 116.5704 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/great-wall-of-china' },
  { id: '2', name: 'Petra', description: 'Petra is a historical and archaeological city in southern Jordan.', geometry: { location: { lat: 30.3285, lng: 35.4444 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/petra' },
  { id: '3', name: 'Christ the Redeemer', description: 'Christ the Redeemer is an iconic statue of Jesus Christ in Rio de Janeiro, Brazil.', geometry: { location: { lat: -22.9519, lng: -43.2105 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/christ-the-redeemer' },
  { id: '4', name: 'Machu Picchu', description: 'Machu Picchu is a 15th-century Inca citadel in the Andes Mountains of Peru.', geometry: { location: { lat: -13.1631, lng: -72.5450 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/machu-picchu' },
  { id: '5', name: 'Chichen Itza', description: 'Chichen Itza is a large pre-Columbian city built by the Maya civilization on the Yucatán Peninsula of Mexico.', geometry: { location: { lat: 20.6829, lng: -88.5686 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/chichen-itza' },
  { id: '6', name: 'Roman Colosseum', description: 'The Roman Colosseum is an ancient amphitheater in Rome, Italy, used for gladiatorial contests and public spectacles.', geometry: { location: { lat: 41.8902, lng: 12.4922 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/roman-colosseum' },
  { id: '7', name: 'Taj Mahal', description: 'The Taj Mahal is an ivory-white marble mausoleum in Agra, India, and is regarded as a symbol of love.', geometry: { location: { lat: 27.1751, lng: 78.0421 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/taj-mahal' }
];

const topPicks = [
  { id: '1', name: 'Eiffel Tower', description: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France.', geometry: { location: { lat: 48.8584, lng: 2.2945 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/eiffel-tower' },
  { id: '2', name: 'Great Barrier Reef', description: 'The Great Barrier Reef is the world’s largest coral reef system located off the coast of Queensland, Australia.', geometry: { location: { lat: -18.2871, lng: 147.6992 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/great-barrier-reef' },
  { id: '3', name: 'Machu Picchu', description: 'Machu Picchu is a 15th-century Inca citadel in the Andes Mountains of Peru.', geometry: { location: { lat: -13.1631, lng: -72.5450 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/machu-picchu' },
  { id: '4', name: 'Sydney Opera House', description: 'The Sydney Opera House is a multi-venue performing arts center in Sydney, Australia.', geometry: { location: { lat: -33.8568, lng: 151.2153 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/sydney-opera-house' },
  { id: '5', name: 'Grand Canyon', description: 'The Grand Canyon is a steep-sided canyon carved by the Colorado River in Arizona, USA.', geometry: { location: { lat: 36.1069, lng: -112.1129 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/grand-canyon' },
  { id: '6', name: 'Santorini', description: 'Santorini is a group of islands in the Aegean Sea, known for its whitewashed buildings and stunning sunsets.', geometry: { location: { lat: 36.3932, lng: 25.4615 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/santorini' },
  { id: '7', name: 'Taj Mahal', description: 'The Taj Mahal is an ivory-white marble mausoleum in Agra, India, and is regarded as a symbol of love.', geometry: { location: { lat: 27.1751, lng: 78.0421 } }, photos: [{ photo_reference: 'photo_reference' }], url: 'http://example.com/taj-mahal' }
];

const Discover = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  const handleLocationSelect = async (item) => {
    try {
      // Try to get a photo reference using the Places API
      const photoResult = await GetPhotoReference(item.name);
      const photoReference = photoResult?.results?.[0]?.photos?.[0]?.photo_reference;

      setTripData({ 
        locationInfo: {
          name: item.name,
          coordinates: item.geometry.location,
          photo: photoReference || item.photos?.[0]?.photo_reference || null,
          url: item?.url,
        }
      });
    } catch (error) {
      console.error("Error getting photo reference:", error);
      // Fallback to static photo reference or null
      setTripData({ 
        locationInfo: {
          name: item.name,
          coordinates: item.geometry.location,
          photo: item.photos?.[0]?.photo_reference || null,
          url: item?.url,
        }
      });
    }
    
    router.push('/create-trip/selectTraveller');
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle='dark-content' />
      
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <TouchableOpacity onPress={() => router.push('/create-trip/search-place')} >
          <Feather name="search" size={35} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Pick Countries</Text>
      <View style={styles.gridContainer}>
        {countries.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemContainer} 
            onPress={() => handleLocationSelect(item)}>
            <Image 
              source={{ uri: `https://flagcdn.com/w40/${item.code}.png` }} 
              style={styles.flag} 
            />
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Seven Wonders</Text>
      <View style={styles.gridContainer}>
        {wonders.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemContainer} 
            onPress={() => handleLocationSelect(item)}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Top Picks</Text>
      <View style={styles.gridContainer}>
        {topPicks.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemContainer} 
            onPress={() => handleLocationSelect(item)}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 35,
    fontFamily: 'outfit-bold',
  },
  sectionTitle: {
    fontFamily: 'outfit-medium',
    fontSize: 25,
    paddingVertical: 10,
    marginTop: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  itemContainer: {
    width: '30%',
    alignItems: 'center',
    padding: 5,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
  },
  itemText: {
    fontSize: 15,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flag: {
    width: 50,
    height: 30,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default Discover;