import { View, Text , TouchableOpacity} from 'react-native'
import React,{useEffect , useContext} from 'react'
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import Entypo from '@expo/vector-icons/Entypo';
import {CreateTripContext} from './../../context/CreateTripContext'
import moment from 'moment';

export default function tripReview() {

    const { tripData, setTripData } = useContext(CreateTripContext);
    const router  = useRouter()
  return (
      <View
      style={{
              backgroundColor: Colors.WHITE,
              height: '100%',
              padding: 25,
              paddingTop: 40,
            }}>
         <View style={{ margin: 20 }}>
          <Text style={{ fontFamily: 'outfit-bold', fontSize: 35 , marginTop: 30}}>Trip Review</Text>
              <Text style={{ marginTop: 20, fontFamily: 'outfit', fontSize: 18 }}>Here is your final trip review</Text>

              
              <View style={{ marginTop: 30, display: 'flex', flexDirection: 'row', }}>
                  <Text style={{fontSize:30}}>📍</Text>
                  {/* <Entypo name="location-pin" size={34} color="black" style={{paddingTop:10}} /> */}
                  <View style={{paddingLeft:30}}>
                  <Text style={{color:'grey', fontFamily:'outfit'}}> Destination</Text>
                  <Text style={{fontSize:20, fontFamily:'outfit-medium'}}>{tripData?.locationInfo.name}</Text>
                  </View>
              </View> 

              <View style={{ marginTop: 30, display: 'flex', flexDirection: 'row', }}>
                  <Text style={{fontSize:30}}>👬</Text>
                  {/* <Entypo name="location-pin" size={34} color="black" style={{paddingTop:10}} /> */}
                  <View style={{paddingLeft:30}}>
                  <Text style={{color:'grey', fontFamily:'outfit'}}> Traveller type</Text>
                  <Text style={{fontSize:20, fontFamily:'outfit-medium'}}>{tripData?.traveller?.title}</Text>
                  </View>
              </View> 

              <View style={{ marginTop: 30, display: 'flex', flexDirection: 'row', }}>
                  <Text style={{fontSize:30}}>📅</Text>
                  {/* <Entypo name="location-pin" size={34} color="black" style={{paddingTop:10}} /> */}
                  <View style={{paddingLeft:30}}>
                  <Text style={{color:'grey', fontFamily:'outfit'}}> Destination</Text>
                      <Text style={{ fontSize: 20, fontFamily: 'outfit-medium' }}>{moment(tripData?.startDate).format('DD MMM')
                          + " To " + moment(tripData?.endDate).format('DD MMM') + " "} ({ tripData?.totalDays + " days"})</Text>
                  </View>
              </View> 

              <View style={{ marginTop: 30, display: 'flex', flexDirection: 'row', }}>
                  <Text style={{fontSize:30}}>💰</Text>
                  {/* <Entypo name="location-pin" size={34} color="black" style={{paddingTop:10}} /> */}
                  <View style={{paddingLeft:30}}>
                  <Text style={{color:'grey', fontFamily:'outfit'}}> Destination</Text>
                  <Text style={{fontSize:20, fontFamily:'outfit-medium'}}>{tripData?.budget}</Text>
                  </View>
              </View> 



              <TouchableOpacity
                        style={{ borderWidth: 1, margin: 40, marginTop:60, padding: 15, borderRadius: 10, backgroundColor: 'black' }}
                        onPress={() => router.push('/create-trip/generate-Trip')}>
                        <Text style={{
                          fontFamily: 'outfit-medium', textAlign: 'center', color:'white', fontSize:19}}> Build Trip</Text>
                      </TouchableOpacity>


              

              

              
          </View>
    </View>
  )
}