import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from './../../constants/Colors'

const TabLayout = () => {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: 'purple',
      tabBarLabelStyle: { fontSize: 14 },
        tabBarIconStyle: { marginBottom: -5 }, 
        tabBarStyle: { paddingTop: 6, height: 60 }, 
    }}
    >  
      <Tabs.Screen name="myTrip"
        options={{
          tabBarLabel: 'MyTrip',
          tabBarIcon:({ color }) => <Ionicons name='locate-sharp' size={24} color={color}/>
        }}
      />
      <Tabs.Screen name="discover"
      options={{
        tabBarLabel:'Discover',
        tabBarIcon:({ color }) => <Ionicons name='globe'  size={24} color={color}/>
      }}/>
      <Tabs.Screen name="profile"
      options={{
        tabBarLabel:'Profile',
        tabBarIcon:({ color }) => <Ionicons name='people'  size={24} color={color}/>
      }}/>
    </Tabs>
  )
}

export default TabLayout