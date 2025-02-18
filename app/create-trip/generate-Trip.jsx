import { View, Text, Image, Alert } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { CreateTripContext } from '../../context/CreateTripContext';
import { Colors } from '../../constants/Colors';
import { AI_PROMPT } from './../../constants/Options';
import { chatSession } from '../../configure/AIModel';
import { useRouter } from 'expo-router';
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from './../../configure/firebaseConfig';
import LottieView from "lottie-react-native";

export default function GenerateTrip() {
    const { tripData, setTripData } = useContext(CreateTripContext);
    const [loading, setLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const router = useRouter();
    const user = auth.currentUser;
    
    useEffect(() => {
        handleGenerateTrip();
    }, []);
    
    const extractJSONFromText = (text) => {
        // Try to find JSON object in the text
        const jsonRegex = /{[\s\S]*}/;
        const match = text.match(jsonRegex);
        
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (e) {
                console.log("Failed to parse matched JSON:", e);
            }
        }
        
        // If regex approach fails, try the substring approach
        try {
            const jsonStartIndex = text.indexOf('{');
            const jsonEndIndex = text.lastIndexOf('}');
            
            if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
                const jsonPart = text.substring(jsonStartIndex, jsonEndIndex + 1);
                return JSON.parse(jsonPart);
            }
        } catch (e) {
            console.log("Failed to parse substring JSON:", e);
        }
        
        // If all parsing attempts fail
        throw new Error("Could not extract valid JSON from response");
    };
    
    const handleGenerateTrip = async () => {
        if (retryCount >= 3) {
            Alert.alert(
                "Trip Generation Failed",
                "We're having trouble generating your trip. Please try again later or modify your trip parameters.",
                [{ text: "OK", onPress: () => router.back() }]
            );
            return;
        }
        
        setLoading(true);
        
        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', tripData?.locationInfo?.name || "unknown location")
            .replace('{totalDays}', tripData?.totalDays || 1)
            .replace('{totalNights}', (tripData?.totalDays ? tripData.totalDays - 1 : 0))
            .replace('{traveller}', tripData?.traveller?.title || "traveller")
            .replace('{budget}', tripData?.budget || "budget")
            + "\n\nIMPORTANT: Your response MUST be in valid JSON format only, with no additional text before or after the JSON.";
        
        console.log("Generated Prompt:", FINAL_PROMPT);
        
        try {
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const responseText = await result.response.text();
            
            console.log("Raw AI Response:", responseText);
            
            let tripResp;
            try {
                tripResp = extractJSONFromText(responseText);
            } catch (jsonError) {
                console.error("Please wait, trying again....", jsonError);
                setRetryCount(prev => prev + 1);
                setLoading(false);
                handleGenerateTrip();
                return;
            }
            
            setLoading(false);
            
            const docId = `${user?.email || "anonymous"}_${Date.now()}`;
            await setDoc(doc(db, "UserTrips", docId), {
                userEmail: user?.email || "anonymous",
                tripPlan: tripResp,
                tripData: JSON.stringify(tripData),
                createdAt: new Date(),
                docId: docId
            });
            
            setTripData(prev => ({ ...prev, tripPlan: tripResp }));
            
            router.push('(tabs)/myTrip');
        } catch (error) {
            console.error("Error generating trip:", error);
            setRetryCount(prev => prev + 1);
            setLoading(false);
            handleGenerateTrip();
        }
    };
    
    return (
        <View style={{ backgroundColor: Colors.WHITE, height: '100%', padding: 25, paddingTop: 40 }}>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 35, marginTop: 20 }}>Generating Trip...</Text>
            <Text style={{ fontFamily: 'outfit', fontSize: 18, marginTop: 20 }}>
                Please wait while we are generating your trip{retryCount > 0 ? ` (Attempt ${retryCount + 1})` : ''}...
            </Text>
            <LottieView
                    source={require('../../assets/images/generatetrip.json')}
                    autoPlay
                    loop
                    style={{ width: '100%', height: 300, zIndex: 1 }}
                  />

    

            <Text style={{ fontFamily: 'outfit', fontSize: 18, marginTop: 40, textAlign: 'center', color: 'grey' }}>
                Please don't go back
            </Text>
        </View>
    );
}