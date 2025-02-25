import React from 'react';
import { Tabs } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../constants/Colors';

 const TabLayout = () => {
   const { flightDetails } = useLocalSearchParams();
   const { hotelDetails } = useLocalSearchParams();
   const { dayPlanner } = useLocalSearchParams();
   const { tripDetails } = useLocalSearchParams();
   
   
   console.log("HERE ARE BETETE:",  dayPlanner);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'purple',
        tabBarLabelStyle: { fontSize: 14 },
        tabBarIconStyle: { marginBottom: -5 }, 
        tabBarStyle: { paddingTop: 6, height: 60 }, 
      }}
    >
      <Tabs.Screen
        name="HotelDetails"
        options={{
          tabBarLabel: 'Hotels',
          tabBarIcon: ({ color }) => <FontAwesome5 name="hotel" size={24} color={color} />,
        }}
        initialParams={{ hotelDetails }} // Pass relevant data to HotelDetails tab
      />
      <Tabs.Screen
        name="FlightDetails"
        options={{
          tabBarLabel: 'Flights',
          tabBarIcon: ({ color }) => <FontAwesome name="plane" size={24} color={color} />,
        }}
        initialParams={{ flightDetails }} // Pass relevant data to FlightDetails tab
      />
    
      <Tabs.Screen
        name="DayPlannerInfo"
        options={{
          tabBarLabel: 'Plan',
          tabBarIcon: ({ color }) => <FontAwesome name="list-alt" size={24} color={color} />,
        }}
        initialParams={{ dayPlanner }} // Pass relevant data to DayPlannerInfo tab
      />
      
    </Tabs>
  );
};

export default TabLayout