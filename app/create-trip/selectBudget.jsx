import { View, Text, FlatListComponent, FlatList, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { SelectBudgetOptions } from '../../constants/Options';
import OptionCard from '../../components/createTrip/OptionCard';
import { CreateTripContext } from './../../context/CreateTripContext';



export default function selectBudget() {

   
    const [selectoption, setSelectoption] = useState();
    const { tripData, setTripData } = useContext(CreateTripContext);
    const router = useRouter();

    useEffect(() => {
        selectoption && setTripData({
            ...tripData,
            budget: selectoption?.title
        })
    }, [selectoption])
    
    const onClickContinue = () => {
        if (!selectoption) {
            ToastAndroid.show('Select Your budget'.ToastAndroid.LONG)
        return;
        }
        router.push('/create-trip/tripReview')

        
    }

  return (
    <View style={{
            backgroundColor: Colors.WHITE,
            height: '100%',
            padding: 30,
          paddingTop: 90,
          }}>
          <Text style={{ fontFamily: 'outfit-bold', fontSize: 35 }}>Budget</Text>
          <Text style={{ marginTop: 10, fontFamily: 'outfit', fontSize: 17, marginBottom: 20 }}>Chooose the budget for your trip</Text>
          <FlatList 
              data={SelectBudgetOptions}
              renderItem={({ item }) => (
                  <TouchableOpacity onPress={()=>setSelectoption(item)}>
                      <OptionCard option={item} selected={selectoption}/>
                  </TouchableOpacity>
              )}
          />
          <TouchableOpacity
                    style={{ borderWidth: 1, margin: 40, padding: 15, borderRadius: 10, backgroundColor: 'black' }}
                    onPress={onClickContinue}>
                    <Text style={{
                      fontFamily: 'outfit-medium', textAlign: 'center', color:'white', fontSize:19}}> Continue</Text>
                  </TouchableOpacity>
          
    </View>
  )
}