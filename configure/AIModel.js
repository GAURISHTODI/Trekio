import Constants from 'expo-constants';
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = Constants.expoConfig.extra.GOOGLE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

   export const chatSession = model.startChat({
      generationConfig,
       history: [
        {
            role: "user",
            parts: [
              {text: "enerate Travel Plan for Location:Dhaka, Bangladesh for 2 days and 1 nights for Just Me with a Moderate budget with Flight Details, Flight Price with Booking URL, Hotel Option list with HotelName, Hotel Address, Hotel Geo coordinates, rating and description and places to visit nearby with PlaceName, Place details, Place Image Url, Geo coordinates, ticket price and detials, Time to travel each of the location for 2 days and 1 nights with each day plan along wiht best time to visit in JSON format\n"},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "Okay, here's a possible 2-day/1-night solo trip to Dhaka, Bangladesh, designed for a moderate budget.  I've included estimated costs, but remember prices can fluctuate. I'll provide JSON format as requested.\n\n```json\n{\n  \"tripDetails\": {\n    \"location\": \"Dhaka, Bangladesh\",\n    \"duration\": \"2 days, 1 night\",\n    \"traveler\": \"Solo\",\n    \"budget\": \"Moderate\",\n    \"bestTimeToVisit\": \"October to March (dry season, pleasant weather)\"\n  },\n  \"flightDetails\": {\n    \"departureAirport\": \"Your Departure Airport Code (e.g., JFK, LHR)\",\n    \"arrivalAirport\": \"DAC\",\n    \"airline\": \"Multiple options, compare prices (e.g., Emirates, Qatar Airways, Biman Bangladesh Airlines)\",\n    \"estimatedPrice\": {\n      \"currency\": \"USD\",\n      \"amount\": 600 // Adjust based on your origin and booking time\n    },\n    \"bookingURL\": \"Skyscanner.com, Google Flights, Kayak.com (Compare Prices)\",\n    \"notes\": \"Book in advance for better deals. Consider flights with layovers to reduce costs.\"\n  },\n  \"hotelOptions\": [\n    {\n      \"hotelName\": \"Hotel 71\",\n      \"hotelAddress\": \"House # 32, Road # 11, Sector # 6, Uttara, Dhaka-1230, Bangladesh\",\n      \"hotelGeoCoordinates\": {\n        \"latitude\": 23.8790,\n        \"longitude\": 90.3946\n      },\n      \"rating\": 4.0,\n      \"description\": \"A modern and comfortable hotel in Uttara, a quieter area of Dhaka. Offers good amenities and reasonable prices.\",\n      \"estimatedPrice\": {\n        \"currency\": \"USD\",\n        \"amount\": 40\n      },\n      \"bookingURL\": \"Booking.com, Agoda.com\",\n      \"nearbyPlaces\": [\n        {\n          \"placeName\": \"Uttara Lake\",\n          \"placeDetails\": \"A scenic lake perfect for a relaxing walk or boat ride.\",\n          \"placeImageURL\": \"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/6b/46/89/uttara-lake.jpg?w=700&h=-1&s=1\",\n          \"placeGeoCoordinates\": {\n            \"latitude\": 23.8774,\n            \"longitude\": 90.3913\n          },\n          \"ticketPrice\": {\n            \"currency\": \"BDT\",\n            \"amount\": 0\n          },\n          \"timeToTravel\": \"5-minute walk\"\n        }\n      ]\n    },\n    {\n      \"hotelName\": \"Grand Prince Hotel\",\n      \"hotelAddress\": \"House # 8, Road # 12, Sector # 1, Uttara, Dhaka-1230, Bangladesh\",\n      \"hotelGeoCoordinates\": {\n        \"latitude\": 23.8818,\n        \"longitude\": 90.3897\n      },\n      \"rating\": 3.5,\n      \"description\": \"A budget-friendly option with basic amenities. Conveniently located in Uttara.\",\n      \"estimatedPrice\": {\n        \"currency\": \"USD\",\n        \"amount\": 30\n      },\n      \"bookingURL\": \"Booking.com, Agoda.com\",\n      \"nearbyPlaces\": [\n        {\n          \"placeName\": \"North Tower Shopping Complex\",\n          \"placeDetails\": \"A shopping destination in Uttara, Dhaka\",\n          \"placeImageURL\": \"https://lh5.googleusercontent.com/p/AF1QipPA_yK40T93FfP2tG77h9g-0F_z03yq7b778N6J=w408-h306-k-no\",\n          \"placeGeoCoordinates\": {\n            \"latitude\": 23.8795,\n            \"longitude\": 90.3918\n          },\n          \"ticketPrice\": {\n            \"currency\": \"BDT\",\n            \"amount\": 0\n          },\n          \"timeToTravel\": \"3-minute walk\"\n        }\n      ]\n    }\n  ],\n  \"dayPlans\": [\n    {\n      \"day\": 1,\n      \"theme\": \"Old Dhaka Exploration\",\n      \"activities\": [\n        {\n          \"activityName\": \"Lalbagh Fort\",\n          \"activityDetails\": \"A 17th-century Mughal fort with intricate architecture and historical significance.\",\n          \"activityImageURL\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Lalbagh_Fort_Dhaka_Bangladesh.jpg/1280px-Lalbagh_Fort_Dhaka_Bangladesh.jpg\",\n          \"activityGeoCoordinates\": {\n            \"latitude\": 23.7167,\n            \"longitude\": 90.3800\n          },\n          \"ticketPrice\": {\n            \"currency\": \"BDT\",\n            \"amount\": 200,\n            \"details\": \"For foreigners\"\n          },\n          \"timeToTravelFromHotel\": \"1 hour (depending on traffic, use Uber/Rickshaw)\",\n          \"duration\": \"2-3 hours\",\n          \"bestTimeToVisit\": \"Morning (to avoid crowds and heat)\"\n        },\n        {\n          \"activityName\": \"Ahsan Manzil (Pink Palace)\",\n          \"activityDetails\": \"The former residence of the Dhaka Nawab family, now a museum showcasing the region's history and culture.\",\n          \"activityImageURL\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Ahsan_Manzil_in_Dhaka.jpg/1280px-Ahsan_Manzil_in_Dhaka.jpg\",\n          \"activityGeoCoordinates\": {\n            \"latitude\": 23.7072,\n            \"longitude\": 90.3953\n          },\n          \"ticketPrice\": {\n            \"currency\": \"BDT\",\n            \"amount\": 100,\n            \"details\": \"For foreigners\"\n          },\n          \"timeToTravelFromLalbagh\": \"15-20 minutes (Rickshaw/Uber)\",\n          \"duration\": \"2-3 hours\",\n          \"bestTimeToVisit\": \"Afternoon\"\n        },\n        {\n          \"activityName\": \"Sadarghat Boat Terminal\",\n          \"activityDetails\": \"Experience the bustling riverfront and witness the chaotic but vibrant scene of boats and ferries.\",\n          \"activityImageURL\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Sadarghat_Launch_Terminal.jpg/1280px-Sadarghat_Launch_Terminal.jpg\",\n          \"activityGeoCoordinates\": {\n            \"latitude\": 23.7042,\n            \"longitude\": 90.3989\n          },\n          \"ticketPrice\": {\n            \"currency\": \"BDT\",\n            \"amount\": 0,\n            \"details\": \"Free to walk around, boat rides available for a fee.\"\n          },\n          \"timeToTravelFromAhsanManzil\": \"5-10 minutes (Rickshaw)\",\n          \"duration\": \"1-2 hours\",\n          \"bestTimeToVisit\": \"Late Afternoon/Early Evening\"\n        },\n        {\n          \"activityName\": \"Dinner at Star Kabab (Old Dhaka)\",\n          \"activityDetails\": \"Enjoy traditional Bangladeshi cuisine in a local restaurant.\",\n          \"activityImageURL\": \"https://i.ytimg.com/vi/vWqL9Qn7D-M/maxresdefault.jpg\",\n          \"activityGeoCoordinates\": {\n            \"latitude\": 23.7129,\n            \"longitude\": 90.4037\n          },\n          \"ticketPrice\": {\n            \"currency\": \"BDT\",\n            \"amount\": 500,\n            \"details\": \"approximate cost for a meal\"\n          },\n          \"timeToTravelFromSadarghat\": \"10-15 minutes (Rickshaw)\",\n          \"duration\": \"1-2 hours\",\n          \"bestTimeToVisit\": \"Evening\"\n        }\n      ]\n    },\n    {\n      \"day\": 2,\n      \"theme\": \"Modern Dhaka and Departure\",\n      \"activities\": [\n        {\n          \"activityName\": \"National Museum\",\n          \"activityDetails\": \"Explore the art, history and culture of Bangladesh.\",\n          \"activityImageURL\": \"https://media-cdn.tripadvisor.com/media/photo-s/06/46/c6/e8/bangladesh-national-museum.jpg\",\n          \"activityGeoCoordinates\": {\n            \"latitude\": 23.7353,\n            \"longitude\": 90.4075\n          },\n          \"ticketPrice\": {\n            \"currency\": \"BDT\",\n            \"amount\": 100,\n            \"details\": \"For Foreigners\"\n          },\n          \"timeToTravelFromHotel\": \"45 minutes (Uber/Taxi)\",\n          \"duration\": \"2-3 hours\",\n          \"bestTimeToVisit\": \"Morning\"\n        },\n        {\n          \"activityName\": \"Hatirjheel Lake\",\n          \"activityDetails\": \"A picturesque lake and recreational area offering scenic views and walking paths.\",\n          \"activityImageURL\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hatirjheel_at_night.jpg/1280px-Hatirjheel_at_night.jpg\",\n          \"activityGeoCoordinates\": {\n            \"latitude\": 23.7498,\n            \"longitude\": 90.4034\n          },\n          \"ticketPrice\": {\n            \"currency\": \"BDT\",\n            \"amount\": 0,\n            \"details\": \"Free to visit\"\n          },\n          \"timeToTravelFromNationalMuseum\": \"15-20 minutes (Uber/Taxi)\",\n          \"duration\": \"1-2 hours\",\n          \"bestTimeToVisit\": \"Afternoon\"\n        },\n        {\n          \"activityName\": \"Shopping at Bashundhara City Shopping Complex\",\n          \"activityDetails\": \"One of the largest shopping malls in South Asia, offering a wide variety of stores and dining options.\",\n          \"activityImageURL\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bashundhara_City_Shopping_Complex.jpg/1280px-Bashundhara_City_Shopping_Complex.jpg\",\n          \"activityGeoCoordinates\": {\n            \"latitude\": 23.7556,\n            \"longitude\": 90.4211\n          },\n          \"ticketPrice\": {\n            \"currency\": \"BDT\",\n            \"amount\": 0,\n            \"details\": \"Free entry, costs depend on your shopping.\"\n          },\n          \"timeToTravelFromHatirjheel\": \"15-20 minutes (Uber/Taxi)\",\n          \"duration\": \"2-3 hours\",\n          \"bestTimeToVisit\": \"Afternoon\"\n        },\n        {\n          \"activityName\": \"Departure from Dhaka (DAC)\",\n          \"activityDetails\": \"Head to Hazrat Shahjalal International Airport for your flight home.\",\n          \"activityImageURL\": \"https://www.airport-technology.com/wp-content/uploads/sites/7/2017/09/3-hazrat-shahjalal-international.jpg\",\n          \"activityGeoCoordinates\": {\n            \"latitude\": 23.8494,\n            \"longitude\": 90.3936\n          },\n          \"ticketPrice\": {\n            \"currency\": \"BDT\",\n            \"amount\": 0,\n            \"details\": \"Airport departure tax may apply.\"\n          },\n          \"timeToTravelFromBashundharaCity\": \"1 hour (depending on traffic, Uber/Taxi)\",\n          \"duration\": \"Allow ample time for check-in and security.\",\n          \"bestTimeToVisit\": \"N/A\"\n        }\n      ]\n    }\n  ],\n  \"importantNotes\": [\n    \"Traffic in Dhaka can be very heavy, especially during peak hours. Plan your travel time accordingly.\",\n    \"Bargaining is common in local markets and with rickshaw drivers.\",\n    \"Be aware of your surroundings and take precautions against petty theft.\",\n    \"Drink bottled water only.\",\n    \"Learn a few basic Bengali phrases.\",\n    \"Respect local customs and traditions.\",\n    \"Carry small denominations of Bangladeshi Taka (BDT) for easy transactions.\",\n    \"Download offline maps and translation apps on your phone.\",\n    \"Register with your embassy or consulate before you travel.\"\n  ],\n   \"budgetEstimates\": {\n        \"accommodation\": {\n            \"currency\": \"USD\",\n            \"amount\": 40 // average per night\n        },\n        \"food\": {\n            \"currency\": \"USD\",\n            \"amount\": 20 // average per day\n        },\n        \"transportation\": {\n            \"currency\": \"USD\",\n            \"amount\": 15 // average per day\n        },\n        \"activities\": {\n            \"currency\": \"USD\",\n            \"amount\": 15 // average per day\n        },\n         \"totalEstimatedCost\": {\n             \"currency\": \"USD\",\n             \"amount\": 90 // excluding flights\n         }\n    }\n}\n```\n\n**Key Points & Explanations:**\n\n*   **JSON Format:** The entire response is structured in valid JSON, making it easily parsable by applications.\n*   **Flexibility:**  This is a *template*.  You *must* customize it with your actual flight details, hotel choice, and interests.\n*   **Budget:**  \"Moderate\" is relative.  I've assumed a budget that allows for decent accommodation, local transportation, and eating at a mix of local and slightly more tourist-oriented restaurants.\n*   **Transportation:**  Dhaka traffic is notorious.  Uber and CNG auto-rickshaws are the most convenient options.  Negotiate rickshaw fares *before* you get in.\n*   **Safety:**  Be aware of your surroundings, especially in crowded areas.  Keep valuables secure.\n*   **Food:** Dhaka has amazing food! Be adventurous, but start with reputable places.\n*   **Customization:** This is crucial.  Replace the placeholder flight details, hotel choices, and tailor the activities to *your* interests.\n\n**How to Use This Plan:**\n\n1.  **Copy and Paste:**  Copy the JSON code into a text editor or an online JSON validator/formatter.\n2.  **Customize:**\n    *   **Flights:**  Research and book your flights using the provided booking URLs.  Update the `flightDetails` section with accurate information.\n    *   **Hotel:** Choose a hotel from the `hotelOptions` (or find your own) and update the `hotelDetails` with the relevant information.  Use Google Maps to explore the hotel's location.\n    *   **Activities:**  Review the `dayPlans` and adjust the activities based on your interests.  Add or remove activities as needed.  Pay close attention to travel times.\n    *   **Budget:**  Adjust the `budgetEstimates` to reflect your actual spending.\n3.  **Save:** Save the file as a `.json` file (e.g., `dhaka_trip.json`).\n\nThis detailed JSON output should give you a solid foundation for planning your solo trip to Dhaka!  Remember to do further research and adapt the plan to your specific needs and preferences.  Enjoy your trip!\n"},
            ],
          },
      ],
    });
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
  
  
  