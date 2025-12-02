import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import React, { useContext } from 'react';
import { useRouter } from 'expo-router';
import { CreateTripContext } from '../context/CreateTripContext';

const Details = () => {
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);

  const destination = tripData?.selectedDestination;
  const insights = tripData?.liveInsights;

  if (!destination || !insights) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No insights available</Text>
          <Text style={styles.emptySubtext}>Please fetch live insights from the Discover page first.</Text>
          <TouchableOpacity 
            style={styles.goBackButton}
            onPress={() => router.push('/(tabs)/discover')}
          >
            <Text style={styles.goBackButtonText}>Go to Discover</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleContinuePlanningTrip = async () => {
    try {
      // Set location info in trip data (same as Continue Trip in Discover)
      setTripData({ 
        ...tripData,
        locationInfo: {
          name: destination.name,
          coordinates: destination.geometry.location,
          photo: null,
          url: destination?.url,
        }
      });
      
      // Navigate to select traveller page
      router.push('/create-trip/selectTraveller');
    } catch (error) {
      console.error("Error navigating to trip planning:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/discover')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Destination Info Card */}
        <View style={styles.destinationCard}>
          <Text style={styles.destinationName}>{destination.name}</Text>
          <Text style={styles.destinationDescription}>{destination.description}</Text>
        </View>

        {/* Live Insights Section */}
        <View style={styles.insightsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📰</Text>
            <Text style={styles.sectionTitle}>Live Travel Insights</Text>
          </View>
          <View style={styles.insightsCard}>
            <Text style={styles.insightsText}>{insights}</Text>
          </View>
        </View>

        {/* Additional Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>ℹ️</Text>
            <Text style={styles.sectionTitle}>Location Information</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Country:</Text>
              <Text style={styles.infoValue}>{destination.name}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Coordinates:</Text>
              <Text style={styles.infoValue}>
                {destination.geometry.location.lat.toFixed(4)}, {destination.geometry.location.lng.toFixed(4)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💡</Text>
            <Text style={styles.sectionTitle}>Travel Tips</Text>
          </View>
          <View style={styles.tipsCard}>
            <Text style={styles.tipText}>✓ Check visa requirements before booking</Text>
            <Text style={styles.tipText}>✓ Research local customs and etiquette</Text>
            <Text style={styles.tipText}>✓ Book accommodations in advance</Text>
            <Text style={styles.tipText}>✓ Keep emergency contacts handy</Text>
            <Text style={styles.tipText}>✓ Check weather forecasts for your travel dates</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleContinuePlanningTrip}
          >
            <Text style={styles.primaryButtonText}>Continue Planning Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.secondaryButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  goBackButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Destination Card
  destinationCard: {
    backgroundColor: '#f8f9fa',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  destinationName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  destinationDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },

  // Section Styling
  insightsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  infoSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  tipsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },

  // Insights Card
  insightsCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },

  // Info Card
  infoCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: '#f0f8ff',
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b8daff',
  },
  tipText: {
    fontSize: 14,
    color: '#004085',
    lineHeight: 24,
    marginBottom: 6,
  },

  // Action Buttons
  actionSection: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  secondaryButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default Details;