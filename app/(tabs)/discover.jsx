import { 
  View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, 
  ScrollView, Modal, Pressable, ActivityIndicator, Button, Alert 
} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { CreateTripContext } from '../../context/CreateTripContext';
import { GetPhotoReference } from '../../app/services/GooglePlacesApi';
import Constants from 'expo-constants';

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

// IMPORTANT: Update this with your correct IP address
// For Android Emulator: http://10.0.2.2:3001
// For iOS Simulator: http://localhost:3001
// For Physical Device: http://YOUR_COMPUTER_IP:3001 (e.g., http://192.168.1.100:3001)
const BACKEND_URL = 'http://10.246.23.92:3001/api/v1/discover-insights';

const Discover = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  const [countryPhotos, setCountryPhotos] = useState({});
  const googlemapsApiKey = Constants.expoConfig.extra.GOOGLE_MAPS_API_KEY;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsData, setInsightsData] = useState('');

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

  const handleLocationSelect = (item) => {
    setSelectedItem(item);
    setInsightsData('');
    setIsLoadingInsights(false);
    setModalVisible(true);
  };

  const handleFetchInsights = async () => {
    if (!selectedItem) return;

    setIsLoadingInsights(true);
    setInsightsData('');
    
    console.log('🔍 Fetching insights for:', selectedItem.name);
    console.log('📡 Backend URL:', BACKEND_URL);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ topic: selectedItem.name }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Data received');

      if (data.insights) {
        setInsightsData(data.insights);
      } else {
        setInsightsData('Could not find any live insights. Please try again.');
      }
    } catch (error) {
      console.error("❌ Error fetching insights:", error);
      
      let errorMessage = '';
      
      if (error.name === 'AbortError') {
        errorMessage = '⏱️ Request timed out. The server is taking too long to respond.\n\nThis usually means:\n• Backend server is not running\n• Network connectivity issues\n• Server is processing but slow';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = '🔌 Cannot connect to backend server.\n\nTroubleshooting:\n\n1. Is backend running?\n   Run: node server.js\n\n2. Check backend URL:\n   Current: ' + BACKEND_URL + '\n\n3. For Android Emulator use:\n   http://10.0.2.2:3001\n\n4. For Physical Device:\n   • Find your computer\'s IP\n   • Use: http://YOUR_IP:3001\n   • Both devices must be on same WiFi';
      } else if (error.message.includes('429')) {
        errorMessage = '⚠️ Rate limit exceeded. Please wait a minute and try again.';
      } else {
        errorMessage = '❌ Error: ' + error.message;
      }
      
      setInsightsData(errorMessage);
      
      Alert.alert(
        'Connection Error',
        'Could not connect to backend server. Check console for details.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleNavigateToDetails = () => {
    if (!insightsData || insightsData.includes('❌') || insightsData.includes('🔌')) {
      Alert.alert(
        'No Insights Available',
        'Please fetch live insights first before viewing details.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Store insights in trip data
    setTripData({
      ...tripData,
      selectedDestination: selectedItem,
      liveInsights: insightsData,
    });

    setModalVisible(false);
    router.push('/details');
  };

  const handleContinueToTrip = async () => {
    if (!selectedItem) return;

    try {
      const photoResult = await GetPhotoReference(selectedItem.name);
      const photoReference = photoResult?.results?.[0]?.photos?.[0]?.photo_reference;
      setTripData({ 
        locationInfo: {
          name: selectedItem.name,
          coordinates: selectedItem.geometry.location,
          photo: photoReference || null,
          url: selectedItem?.url,
        }
      });
      setModalVisible(false);
      router.push('/create-trip/selectTraveller');
    } catch (error) {
      console.error("Error getting photo reference:", error);
      setTripData({ 
        locationInfo: {
          name: selectedItem.name,
          coordinates: selectedItem.geometry.location,
          photo: null,
          url: selectedItem?.url,
        }
      });
      setModalVisible(false);
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

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalCenteredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <Text style={styles.modalDescription}>{selectedItem.description}</Text>

              <View style={styles.separator} />

              <View style={styles.insightsContainer}>
                <Text style={styles.insightsTitle}>Live Travel Insights</Text>
                {isLoadingInsights ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                    <Text style={styles.loadingText}>
                      Searching web and analyzing content...{'\n'}
                      This may take 30-60 seconds
                    </Text>
                  </View>
                ) : insightsData ? (
                  <ScrollView style={styles.insightsScrollView}>
                    <Text style={styles.insightsText}>{insightsData}</Text>
                  </ScrollView>
                ) : (
                  <Text style={styles.insightsPlaceholder}>
                    Press "Get Live Insights" to fetch recent travel news, tips, and recommendations for {selectedItem.name}.
                  </Text>
                )}
                <TouchableOpacity 
                  style={[styles.insightButton, isLoadingInsights && styles.insightButtonDisabled]}
                  onPress={handleFetchInsights}
                  disabled={isLoadingInsights}
                >
                  <Text style={styles.insightButtonText}>
                    {insightsData ? "Refresh Insights" : "Get Live Insights"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.separator} />

              {/* Details Button - Only enabled if insights are loaded */}
              <TouchableOpacity 
                style={[
                  styles.detailsButton,
                  (!insightsData || insightsData.includes('❌') || insightsData.includes('🔌')) && styles.detailsButtonDisabled
                ]}
                onPress={handleNavigateToDetails}
                disabled={!insightsData || insightsData.includes('❌') || insightsData.includes('🔌')}
              >
                <Text style={styles.detailsButtonIcon}>📋</Text>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>

              <View style={styles.separator} />

              <View style={styles.modalButtonRow}>
                <Pressable
                  style={[styles.modalButton, styles.buttonClose]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.buttonContinue]}
                  onPress={handleContinueToTrip}
                >
                  <Text style={styles.modalButtonText}>Continue Trip</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10 },
  titles: { fontFamily: 'outfit-bold', fontSize: 35, marginBottom: 10, marginTop: 5 },
  card: { backgroundColor: '#f8f8f8', borderRadius: 10, overflow: 'hidden', marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  image: { width: '100%', height: 200 },
  textContainer: { padding: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
  flag: { width: 30, height: 20, marginLeft: 10 },
  description: { fontSize: 14, color: '#666', marginTop: 4 },

  modalCenteredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '90%', maxHeight: '85%' },
  modalTitle: { fontSize: 24, fontFamily: 'outfit-bold', fontWeight: 'bold', marginBottom: 10 },
  modalDescription: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 15 },
  separator: { height: 1, width: '100%', backgroundColor: '#eee', marginVertical: 15 },
  insightsContainer: { width: '100%', alignItems: 'center' },
  insightsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  insightsScrollView: { maxHeight: 150, width: '100%', marginBottom: 10, paddingHorizontal: 5 },
  insightsText: { fontSize: 14, color: '#555', textAlign: 'left', width: '100%', lineHeight: 20 },
  insightsPlaceholder: { fontSize: 14, color: '#888', textAlign: 'center', width: '100%', marginBottom: 10, fontStyle: 'italic', paddingHorizontal: 10 },
  loadingContainer: { alignItems: 'center', paddingVertical: 20 },
  loadingText: { marginTop: 10, fontSize: 12, color: '#666', textAlign: 'center' },
  
  insightButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  insightButtonDisabled: {
    backgroundColor: '#ccc',
  },
  insightButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },

  detailsButton: {
    width: '100%',
    backgroundColor: '#28a745',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailsButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  detailsButtonIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { borderRadius: 10, padding: 10, elevation: 2, flex: 1, marginHorizontal: 5 },
  buttonClose: { backgroundColor: '#888' },
  buttonContinue: { backgroundColor: '#007BFF' },
  modalButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

export default Discover;