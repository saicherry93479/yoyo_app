export interface MockHotel {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  images: string[];
  amenities: string[];
  description: string;
  latitude: number;
  longitude: number;
  distance?: string;
  offer?: string;
  rooms: MockRoom[];
  reviews: MockReview[];
}

export interface MockRoom {
  id: string;
  type: string;
  price: number;
  originalPrice?: number;
  capacity: number;
  size: string;
  amenities: string[];
  images: string[];
  available: boolean;
  description: string;
}

export interface MockReview {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  timeAgo: string;
  content: string;
  likes: number;
  dislikes: number;
  helpful: boolean;
}

export interface MockBooking {
  id: string;
  hotelId: string;
  hotelName: string;
  location: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'upcoming' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  image: string;
  bookingDate: string;
  nights: number;
  bookingReference: string;
  hotelPhone: string;
  hotelEmail: string;
  address: string;
  amenities: string[];
  cancellationPolicy: string;
  priceBreakdown: {
    roomRate: number;
    nights: number;
    subtotal: number;
    taxes: number;
    serviceFee: number;
    total: number;
  };
}

export const mockHotels: MockHotel[] = [
  {
    id: '1',
    name: 'The Oberoi Mumbai',
    location: 'Nariman Point, Mumbai',
    address: 'Nariman Point, Mumbai, Maharashtra 400021, India',
    rating: 4.8,
    reviewCount: 1247,
    price: 15000,
    originalPrice: 18000,
    images: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Business Center', 'Room Service', 'Concierge'],
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Business Center', 'Room Service', 'Concierge', 'Hourly Booking'],
    description: 'Experience luxury at its finest at The Oberoi Mumbai, located in the heart of the business district with stunning views of the Arabian Sea.',
    latitude: 18.9220,
    longitude: 72.8347,
    distance: '2.1 km from city center',
    offer: '20% OFF Summer Special',
    rooms: [
      {
        id: 'r1',
        type: 'Deluxe Ocean View',
        price: 15000,
        originalPrice: 18000,
        capacity: 2,
        size: '45 sq m',
        amenities: ['Ocean View', 'King Bed', 'Mini Bar', 'WiFi', 'AC'],
        images: [
          'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        available: true,
        description: 'Spacious room with panoramic ocean views and modern amenities.'
      },
      {
        id: 'r2',
        type: 'Executive Suite',
        price: 25000,
        capacity: 4,
        size: '75 sq m',
        amenities: ['Ocean View', 'Separate Living Area', 'King Bed', 'Mini Bar', 'WiFi', 'AC', 'Butler Service'],
        images: [
          'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        available: true,
        description: 'Luxurious suite with separate living area and premium amenities.'
      }
    ],
    reviews: [
      {
        id: 'rev1',
        userName: 'Sophia Carter',
        userImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
        rating: 5,
        timeAgo: '2 months ago',
        content: 'Absolutely stunning hotel with exceptional service. The ocean views are breathtaking and the staff went above and beyond to make our stay memorable.',
        likes: 24,
        dislikes: 1,
        helpful: true
      },
      {
        id: 'rev2',
        userName: 'Rajesh Kumar',
        userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
        rating: 4,
        timeAgo: '1 month ago',
        content: 'Great location and beautiful rooms. The breakfast was excellent and the spa services were top-notch. Highly recommended for business travelers.',
        likes: 18,
        dislikes: 2,
        helpful: true
      }
    ]
  },
  {
    id: '2',
    name: 'Taj Mahal Palace',
    location: 'Colaba, Mumbai',
    address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001, India',
    rating: 4.9,
    reviewCount: 2156,
    price: 25000,
    images: [
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge', 'Heritage Tours', 'Butler Service'],
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge', 'Heritage Tours', 'Butler Service', 'Hourly Booking'],
    description: 'An iconic heritage hotel offering unparalleled luxury and service in the heart of Mumbai, overlooking the Gateway of India.',
    latitude: 18.9217,
    longitude: 72.8331,
    distance: '1.5 km from city center',
    rooms: [
      {
        id: 'r3',
        type: 'Heritage Suite',
        price: 25000,
        capacity: 2,
        size: '55 sq m',
        amenities: ['Heritage Decor', 'King Bed', 'Marble Bathroom', 'WiFi', 'AC', 'Butler Service'],
        images: [
          'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        available: true,
        description: 'Elegantly appointed suite with heritage decor and modern comforts.'
      }
    ],
    reviews: [
      {
        id: 'rev3',
        userName: 'Priya Sharma',
        userImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
        rating: 5,
        timeAgo: '3 weeks ago',
        content: 'A truly magical experience! The heritage and grandeur of this hotel is unmatched. Every detail is perfect.',
        likes: 32,
        dislikes: 0,
        helpful: true
      }
    ]
  },
  {
    id: '3',
    name: 'ITC Grand Central',
    location: 'Parel, Mumbai',
    address: 'Dr. Babasaheb Ambedkar Road, Parel, Mumbai, Maharashtra 400012, India',
    rating: 4.7,
    reviewCount: 892,
    price: 12000,
    images: [
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Free WiFi', 'Pool', 'Business Center', 'Restaurant', 'Gym', 'Spa'],
    amenities: ['Free WiFi', 'Pool', 'Business Center', 'Restaurant', 'Gym', 'Spa', 'Hourly Booking'],
    description: 'A contemporary luxury hotel perfect for business and leisure travelers, featuring world-class amenities.',
    latitude: 19.0144,
    longitude: 72.8397,
    distance: '3.2 km from city center',
    rooms: [
      {
        id: 'r4',
        type: 'Executive Room',
        price: 12000,
        capacity: 2,
        size: '40 sq m',
        amenities: ['City View', 'King Bed', 'Work Desk', 'WiFi', 'AC'],
        images: [
          'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        available: true,
        description: 'Modern room designed for business travelers with all essential amenities.'
      }
    ],
    reviews: [
      {
        id: 'rev4',
        userName: 'Amit Patel',
        userImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
        rating: 4,
        timeAgo: '1 week ago',
        content: 'Excellent business hotel with great facilities. The location is convenient and the service is professional.',
        likes: 15,
        dislikes: 1,
        helpful: true
      }
    ]
  },
  {
    id: '4',
    name: 'The St. Regis Mumbai',
    location: 'Lower Parel, Mumbai',
    address: 'Lower Parel, Mumbai, Maharashtra 400013, India',
    rating: 4.8,
    reviewCount: 1543,
    price: 22000,
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Butler Service', 'Valet Parking'],
    description: 'Sophisticated luxury hotel offering personalized service and elegant accommodations in Mumbai\'s business district.',
    latitude: 19.0176,
    longitude: 72.8301,
    distance: '2.8 km from city center',
    rooms: [
      {
        id: 'r5',
        type: 'Superior Room',
        price: 22000,
        capacity: 2,
        size: '50 sq m',
        amenities: ['City View', 'King Bed', 'Marble Bathroom', 'WiFi', 'AC', 'Butler Service'],
        images: [
          'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        available: true,
        description: 'Luxurious room with sophisticated design and personalized butler service.'
      }
    ],
    reviews: [
      {
        id: 'rev5',
        userName: 'Sarah Johnson',
        userImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
        rating: 5,
        timeAgo: '2 weeks ago',
        content: 'Impeccable service and luxurious accommodations. The butler service is exceptional and attention to detail is remarkable.',
        likes: 28,
        dislikes: 0,
        helpful: true
      }
    ]
  },
  {
    id: '5',
    name: 'Grand Hyatt Goa',
    location: 'Bambolim, Goa',
    address: 'P.O. Bambolim, Goa 403202, India',
    rating: 4.6,
    reviewCount: 987,
    price: 8500,
    images: [
      'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Free WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Kids Club', 'Spa', 'Water Sports'],
    description: 'A tropical paradise offering beachfront luxury with world-class amenities and stunning ocean views.',
    latitude: 15.4909,
    longitude: 73.8278,
    distance: 'Beachfront location',
    offer: 'Limited Time: Free Breakfast',
    rooms: [
      {
        id: 'r6',
        type: 'Ocean View Room',
        price: 8500,
        capacity: 2,
        size: '42 sq m',
        amenities: ['Ocean View', 'King Bed', 'Balcony', 'WiFi', 'AC'],
        images: [
          'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        available: true,
        description: 'Beautiful room with direct ocean views and private balcony.'
      }
    ],
    reviews: [
      {
        id: 'rev6',
        userName: 'Michael Brown',
        userImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200',
        rating: 5,
        timeAgo: '1 month ago',
        content: 'Perfect beach resort with amazing facilities. The kids club was fantastic and the beach access is unbeatable.',
        likes: 22,
        dislikes: 1,
        helpful: true
      }
    ]
  },
  {
    id: '6',
    name: 'The Leela Palace',
    location: 'New Delhi',
    address: 'Diplomatic Enclave, Chanakyapuri, New Delhi 110023, India',
    rating: 4.9,
    reviewCount: 1876,
    price: 18000,
    images: [
      'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Butler Service', 'Valet Parking', 'Business Center'],
    description: 'An epitome of luxury and elegance in the heart of India\'s capital, offering royal hospitality and world-class amenities.',
    latitude: 28.5984,
    longitude: 77.1847,
    distance: 'City center',
    rooms: [
      {
        id: 'r7',
        type: 'Royal Club Room',
        price: 18000,
        capacity: 2,
        size: '48 sq m',
        amenities: ['City View', 'King Bed', 'Club Lounge Access', 'WiFi', 'AC', 'Butler Service'],
        images: [
          'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        available: true,
        description: 'Elegant room with club lounge access and personalized service.'
      }
    ],
    reviews: [
      {
        id: 'rev7',
        userName: 'Anita Singh',
        userImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
        rating: 5,
        timeAgo: '2 weeks ago',
        content: 'Absolutely royal experience! The palace-like architecture and impeccable service make this hotel truly special.',
        likes: 35,
        dislikes: 0,
        helpful: true
      }
    ]
  }
];

export const mockBookings: MockBooking[] = [
  {
    id: '1',
    hotelId: '1',
    hotelName: 'The Oberoi Mumbai',
    location: 'Nariman Point, Mumbai',
    roomType: 'Deluxe Ocean View',
    checkIn: '2024-03-15',
    checkOut: '2024-03-18',
    guests: 2,
    status: 'confirmed',
    totalAmount: 45000,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600',
    bookingDate: '2024-02-10',
    nights: 3,
    bookingReference: 'OB2024001',
    hotelPhone: '+91 22 6632 5757',
    hotelEmail: 'reservations@oberoihotels.com',
    address: 'Nariman Point, Mumbai, Maharashtra 400021',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Business Center'],
    cancellationPolicy: 'Free cancellation until 24 hours before check-in',
    priceBreakdown: {
      roomRate: 15000,
      nights: 3,
      subtotal: 45000,
      taxes: 8100,
      serviceFee: 2250,
      total: 55350
    }
  },
  {
    id: '2',
    hotelId: '2',
    hotelName: 'Taj Mahal Palace',
    location: 'Colaba, Mumbai',
    roomType: 'Heritage Suite',
    checkIn: '2024-04-20',
    checkOut: '2024-04-23',
    guests: 2,
    status: 'upcoming',
    totalAmount: 75000,
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600',
    bookingDate: '2024-02-15',
    nights: 3,
    bookingReference: 'TMP2024002',
    hotelPhone: '+91 22 6665 3366',
    hotelEmail: 'reservations.mumbai@tajhotels.com',
    address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge'],
    cancellationPolicy: 'Free cancellation until 48 hours before check-in',
    priceBreakdown: {
      roomRate: 25000,
      nights: 3,
      subtotal: 75000,
      taxes: 13500,
      serviceFee: 3750,
      total: 92250
    }
  },
  {
    id: '3',
    hotelId: '5',
    hotelName: 'Grand Hyatt Goa',
    location: 'Bambolim, Goa',
    roomType: 'Ocean View Room',
    checkIn: '2024-01-10',
    checkOut: '2024-01-14',
    guests: 4,
    status: 'completed',
    totalAmount: 34000,
    image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=600',
    bookingDate: '2023-12-20',
    nights: 4,
    bookingReference: 'GHG2024003',
    hotelPhone: '+91 832 2717 1234',
    hotelEmail: 'goa.grand@hyatt.com',
    address: 'P.O. Bambolim, Goa 403202',
    amenities: ['Free WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Kids Club'],
    cancellationPolicy: 'Non-refundable booking',
    priceBreakdown: {
      roomRate: 8500,
      nights: 4,
      subtotal: 34000,
      taxes: 6120,
      serviceFee: 1700,
      total: 41820
    }
  }
];

export const mockWishlistItems = [
  {
    id: '1',
    hotelId: '1',
    hotelName: 'The Oberoi Mumbai',
    location: 'Nariman Point, Mumbai',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 15000,
    rating: 4.8,
    addedDate: '2024-02-01'
  },
  {
    id: '2',
    hotelId: '5',
    hotelName: 'Grand Hyatt Goa',
    location: 'Bambolim, Goa',
    image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 8500,
    rating: 4.6,
    addedDate: '2024-01-15'
  },
  {
    id: '3',
    hotelId: '6',
    hotelName: 'The Leela Palace',
    location: 'New Delhi',
    image: 'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 18000,
    rating: 4.9,
    addedDate: '2024-01-20'
  }
];

// Helper functions
export const getHotelById = (id: string): MockHotel | undefined => {
  return mockHotels.find(hotel => hotel.id === id);
};

export const getBookingById = (id: string): MockBooking | undefined => {
  return mockBookings.find(booking => booking.id === id);
};

export const searchHotels = (query: string): MockHotel[] => {
  if (!query.trim()) return mockHotels;
  
  const lowercaseQuery = query.toLowerCase();
  return mockHotels.filter(hotel => 
    hotel.name.toLowerCase().includes(lowercaseQuery) ||
    hotel.location.toLowerCase().includes(lowercaseQuery) ||
    hotel.address.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterHotels = (filters: {
  priceRange?: { min: number; max: number };
  rating?: number;
  amenities?: string[];
  location?: string;
}): MockHotel[] => {
  return mockHotels.filter(hotel => {
    if (filters.priceRange) {
      if (hotel.price < filters.priceRange.min || hotel.price > filters.priceRange.max) {
        return false;
      }
    }
    
    if (filters.rating && hotel.rating < filters.rating) {
      return false;
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        hotel.amenities.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }
    
    if (filters.location) {
      const locationMatch = hotel.location.toLowerCase().includes(filters.location.toLowerCase()) ||
                           hotel.address.toLowerCase().includes(filters.location.toLowerCase());
      if (!locationMatch) return false;
    }
    
    return true;
  });
};