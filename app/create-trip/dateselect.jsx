import { View, Text, TouchableOpacity, ToastAndroid, Platform } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import moment from 'moment';
import { CreateTripContext } from '../../context/CreateTripContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import LottieView from "lottie-react-native";

const SelectDates = () => {
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();



  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(Platform.OS === 'ios');
    if (currentDate) {
      setStartDate(moment(currentDate));
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(Platform.OS === 'ios');
    if (currentDate) {
      setEndDate(moment(currentDate));
    }
  };

  const showStartDatePicker = () => {
    setShowStartPicker(true);
  };

  const showEndDatePicker = () => {
    setShowEndPicker(true);
  };

  const onDateSelection = () => {
    if (!startDate || !endDate) {
      ToastAndroid.show('Please choose the dates properly', ToastAndroid.SHORT);
      return;
    }

    if (endDate.isBefore(startDate)) {
      ToastAndroid.show('End date cannot be before start date', ToastAndroid.SHORT);
      return;
    }

    const totalDays = endDate.diff(startDate, 'days');
    setTripData(prevData => ({
      ...prevData,
      startDate,
      endDate,
      totalDays: totalDays + 1
    }));

    router.push('/create-trip/selectBudget');
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: Colors.WHITE,
      padding: 25,
      paddingTop: 30,
    }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 30,
        marginBottom: 20,
        marginTop: 10
      }}>
        Travel Dates
      </Text>

      <View style={{ marginVertical: 20 }}>
        <TouchableOpacity
          onPress={showStartDatePicker}
          style={{
            borderWidth: 1,
            padding: 15,
            borderRadius: 10,
            marginBottom: 15
          }}
        >
          <Text style={{
            fontFamily: 'outfit-medium',
            fontSize: 16
          }}>
            {startDate ? startDate.format('MMMM D, YYYY') : 'Select Start Date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={showEndDatePicker}
          style={{
            borderWidth: 1,
            padding: 15,
            borderRadius: 10
          }}
        >
          <Text style={{
            fontFamily: 'outfit-medium',
            fontSize: 16
          }}>
            {endDate ? endDate.format('MMMM D, YYYY') : 'Select End Date'}
          </Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          testID="startDatePicker"
          value={startDate ? startDate.toDate() : new Date()}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          testID="endDatePicker"
          value={endDate ? endDate.toDate() : new Date()}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate ? startDate.toDate() : new Date()}
        />
      )}
      <View>
        <LottieView
                source={require('../../assets/images/datesanimation.json')}
                autoPlay
                loop
                style={{ width: '100%', height: 300, marginLeft: 10 }}
              />
          </View>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          marginHorizontal: 20,
          marginVertical: 30,
          padding: 15,
          borderRadius: 10,
          backgroundColor: 'black',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }}
        onPress={onDateSelection}
      >
        <Text style={{
          fontFamily: 'outfit-medium',
          textAlign: 'center',
          color: 'white',
          fontSize: 19
        }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectDates;