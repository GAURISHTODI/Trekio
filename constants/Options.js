export const SelectTravellersList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'A sole traveles in exploration',
        icon: ' 🌄',
        person: '1 Member'

    },
    {
        id: 2,
        title: 'Couple',
        desc: 'Explore world together',
        icon: '✈️',
        person: '2 Members'

    },
    {
        id: 3,
        title: 'Friends',
        desc: 'Always a memory',
        icon: '🥂',
        person: '3 to 5 Members'

    }, {
        id: 4,
        title: 'Family',
        desc: 'Travelling with family',
        icon: ' 🏖️',
        person: '4 to 6 Members'

    }
]


export const SelectBudgetOptions = [
    {
      id: 1,
      title: 'Low',
      desc: 'Limited budget with essential expenses only.',
      icon: '💸', // Emoji for low budget
    },
    {
      id: 2,
      title: 'Moderate',
      desc: 'Balanced budget',
      icon: '💰', // Emoji for moderate budget
    },
    {
      id: 3,
      title: 'High',
      desc: 'Focus on comfort and luxury.',
      icon: '💎', // Emoji for high budget
    },
  ];
  

  export const AI_PROMPT = 'Generate Travel Plan for Location:{location} for {totalDays} days and {totalNights} nights for {traveller} with a {budget} budget with three main components, for each components share atleast two options: (1)Flight Details; for this, share components: flightName, fightPrice and flightBookingurl . (2) HotelDetails; for this, share components: hotelName, hotelPrice, hotelRating, hotelGeoCoordinates, hotelImageUrl and  hotelBookingUrl. (3) DayPlanner; for this, create different days of Trip on the basis of {totalDays} days and {totalNights} nights shared. For Each Day, make activites, inside that divide best Tourist Places to visit among these created number of days. For each day, share components: placeName , placeDetails, placeImageUrl, placeticketUrl(give NA if not available), placeGeoCoordinates, in JSON format. All the urls that you are sharing must be shared in a format that they will directly redirect to that webiste or page.'