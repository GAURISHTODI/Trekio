import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'; 
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import { Colors } from './../../constants/Colors';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from './../../configure/firebaseConfig'
import UserTripList from '../../components/MyTrips/UserTripList';
import { useRouter } from 'expo-router';

const myTrip = () => {
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    user && GetMyTrips();
  }, [user]);

  const GetMyTrips = async () => {
    setLoading(true);
    setUserTrips([]); // Clear existing trips before fetching new ones
  
    try {
      // Simplified query without orderBy
      const q = query(
        collection(db, 'UserTrips'), 
        where('userEmail', '==', user?.email)
      );
      const querySnapshot = await getDocs(q);
  
      const trips = [];
      querySnapshot.forEach((doc) => {
        console.log("Document ID:", doc.id, " => Data:", doc.data());
        trips.push({ ...doc.data(), docId: doc.id });
      });
  
      // Sort the trips in JavaScript after fetching
      // This assumes you have a createdAt field that can be compared
      trips.sort((a, b) => {
        // If createdAt doesn't exist, try to use other date fields
        const aTimestamp = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const bTimestamp = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return bTimestamp - aTimestamp; // Descending order (newest first)
      });
  
      setUserTrips(trips);
      setSelectedTripIndex(0); // Always select the newest trip
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  
    setLoading(false);
  };

  const handleTripSelect = (index) => {
    setSelectedTripIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.header}>
        <Text style={styles.top}>My Trips</Text>
        <TouchableOpacity onPress={() => router.push('/create-trip/search-place')} >
          <AntDesign name="pluscircle" size={35} color="black" style={styles.plusIcon} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size={'large'} color='black' />
        ) : userTrips?.length === 0 ? (
          <StartNewTripCard />
        ) : (
          <UserTripList 
            userTrips={userTrips}
            selectedTripIndex={selectedTripIndex}
            onTripSelect={handleTripSelect}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10,
  },
  top: {
    fontSize: 35,
    fontFamily: 'outfit-bold',
  },
  plusIcon: {
    marginRight: 15,
    marginTop: 5
  },
  content: {
    flex: 1,
  }
});

export default myTrip;