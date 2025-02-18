import { View, Text, FlatList,ToastAndroid, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import {  useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { SelectTravellersList } from './../../constants/Options';
import OptionCard from '../../components/createTrip/OptionCard';
import { CreateTripContext } from './../../context/CreateTripContext';

export default function SelectTraveller() {  // Changed to PascalCase and named function
  
  const [selectoption, setSelectoption] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();


  const gotoNext = () => {
    if (!selectoption) {
       ToastAndroid.show('Please choose whom you are travelling with', ToastAndroid.LONG);
            return;
    }
    router.push('/create-trip/dateselect')
  }



  useEffect(() => {
    if (selectoption) {  // Added null check
      setTripData({
        ...tripData,
        traveller: selectoption
      });
    }
  }, [selectoption]);

  return (
    <View style={{
      flex: 1,
      height: '100%',
      padding: 25,
      paddingTop: 10,
      backgroundColor: Colors.WHITE,
    }}>
      <View style={{ margin: 10, paddingTop: 30 }}>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 28 }}>Who's Travelling?</Text>
        <Text style={{ marginTop: 20, fontFamily: 'outfit', fontSize: 18 }}>
          Choose your travellers
        </Text>
        <FlatList
          data={SelectTravellersList}
          style={{ marginTop: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectoption(item)}>
              <OptionCard option={item} selected={selectoption} />
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={{
            borderWidth: 1,
            margin: 40,
            padding: 15,
            borderRadius: 10,
            backgroundColor: 'black'
          }}
          onPress={gotoNext}>
          <Text style={{
            fontFamily: 'outfit-medium',
            textAlign: 'center',
            color: 'white',
            fontSize: 19
          }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}