import { View, Text } from 'react-native'
import React from 'react'

export default function OptionCard({option, selected}) {
  return (
    <View style={[{
      padding: 5,
      borderRadius: 10,
      borderWidth: 0, padding: 20,
      margin: 5, marginBottom: 10, flex: 1,
      flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F5F5F5'
    },selected?.id==option.id&&{borderWidth:1}]}>
      <View>
      <Text style={{ fontFamily: 'outfit-bold', fontSize:20}}>{option?.title}</Text>
      <Text style={{fontFamily:'outfit', fontSize: 15}}>{option?.desc}</Text>
      </View>
      <Text style={{fontSize: 25}}>{option?.icon}</Text>
    </View>
  )
}