import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useRouter } from 'expo-router';



const StartNewTripCard = () => {
    const router = useRouter(); 
  return (
      <View style={{
          padding: 30,
          marginTop: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 10
    }}>
          <EvilIcons name="location" size={35} color="black" />
          <Text> No trips planned yet</Text>
          <Text style={{ marginTop: 20, fontFamily: 'outfit-medium', fontSize: 18 }}> Start with a fresh new trip</Text>
          <TouchableOpacity style={{ marginTop: 50 }} onPress={() =>router.push('/create-trip/search-place')}>
              
              <Text style={{ margin: 10, borderWidth: 2, padding: 10, paddingHorizontal: 40,backgroundColor: 'black', borderRadius: 15, fontFamily: 'outfit-bold', color: 'white'}}> START </Text>
          </TouchableOpacity>
    </View>
  )
}

export default StartNewTripCard