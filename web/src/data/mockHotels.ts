import { Hotel, HotelDeal } from '../types'
import { distanceFromDisneyland } from '../utils/locationHelper'
import { estimatePrice } from '../utils/valueScore'

function deal(
  title: string,
  description: string,
  source: HotelDeal['source'],
  opts: Partial<HotelDeal> = {}
): HotelDeal {
  return {
    id: Math.random().toString(36).slice(2),
    title, description, source,
    isVerified: true,
    ...opts,
  }
}

function hotel(
  base: Omit<Hotel, 'id' | 'distanceFromDisneyland' | 'isFavorite'>
): Hotel {
  return {
    ...base,
    id: base.placeID,
    isFavorite: false,
    distanceFromDisneyland: distanceFromDisneyland(base.latitude, base.longitude),
    pricePerNight: base.pricePerNight ?? estimatePrice(base.priceLevel),
  }
}

export const MOCK_HOTELS: Hotel[] = [
  hotel({
    placeID: 'mock_disneyland_hotel',
    name: 'Disneyland Hotel',
    address: '1150 Magic Way, Anaheim, CA 92802',
    latitude: 33.8090, longitude: -117.9234,
    rating: 4.6, reviewCount: 18450, priceLevel: 4, pricePerNight: 389,
    websiteURL: 'https://disneyland.disney.go.com/hotels/disneyland-hotel/',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Room Service', 'Fitness Center', 'Character Dining', 'Early Park Access', 'Monorail Access'],
    adults: 2, children: 0,
    deals: [
      deal('Magic Ticket Package', 'Save up to 25% when bundling park tickets', 'Direct', { discountPercentage: 25 }),
      deal('AAA Discount', 'AAA members save 10%', 'AAA', { discountPercentage: 10, promoCode: 'AAA10' }),
    ],
  }),
  hotel({
    placeID: 'mock_grand_californian',
    name: "Disney's Grand Californian Hotel & Spa",
    address: '1600 S Disneyland Dr, Anaheim, CA 92802',
    latitude: 33.8099, longitude: -117.9194,
    rating: 4.8, reviewCount: 12830, priceLevel: 4, pricePerNight: 649,
    websiteURL: 'https://disneyland.disney.go.com/hotels/grand-californian-hotel/',
    amenities: ['Spa', '3 Pools', '5 Restaurants', 'Direct Park Access', 'Concierge', 'Early Park Entry', 'Fitness Center', 'Character Dining'],
    adults: 2, children: 0,
    deals: [
      deal('Stay More Save More', 'Book 3+ nights and save 20%', 'Direct', { discountPercentage: 20 }),
      deal('AAA Member Rate', 'Up to 15% off for AAA members', 'AAA', { discountPercentage: 15, promoCode: 'AAA15' }),
    ],
  }),
  hotel({
    placeID: 'mock_candy_cane_inn',
    name: 'Candy Cane Inn',
    address: '1747 S Harbor Blvd, Anaheim, CA 92802',
    latitude: 33.8046, longitude: -117.9210,
    rating: 4.5, reviewCount: 6742, priceLevel: 2, pricePerNight: 149,
    websiteURL: 'https://www.candycaneinn.net/',
    amenities: ['Pool', 'Free Breakfast', 'Free Parking', 'Shuttle to Disneyland', 'Fitness Center'],
    adults: 2, children: 0,
    deals: [
      deal('AAA Rate', '10% off for AAA members', 'AAA', { discountPercentage: 10 }),
      deal('Book Direct Save 5%', 'Save 5% booking on hotel site', 'Direct', { discountPercentage: 5 }),
    ],
  }),
  hotel({
    placeID: 'mock_howard_johnson',
    name: 'Howard Johnson by Wyndham Anaheim Hotel & Water Playground',
    address: '1380 S Harbor Blvd, Anaheim, CA 92802',
    latitude: 33.8102, longitude: -117.9212,
    rating: 4.1, reviewCount: 5320, priceLevel: 2, pricePerNight: 129,
    websiteURL: 'https://www.hojo.com/anaheim',
    amenities: ['Water Playground', 'Pool', 'Free Parking', 'Game Room', 'Restaurant', 'Shuttle to Disneyland'],
    adults: 2, children: 0,
    deals: [
      deal('AAA Savings', '15% discount for AAA members', 'AAA', { discountPercentage: 15 }),
      deal('Military Rate', 'Verified military save 10%', 'Military', { discountPercentage: 10 }),
    ],
  }),
  hotel({
    placeID: 'mock_tropicana',
    name: 'Tropicana Inn & Suites',
    address: '1540 S Harbor Blvd, Anaheim, CA 92802',
    latitude: 33.8061, longitude: -117.9212,
    rating: 4.0, reviewCount: 4180, priceLevel: 2, pricePerNight: 119,
    websiteURL: 'https://www.tropicanainn-anaheim.com/',
    amenities: ['Pool', 'Free Parking', 'Walking Distance to Parks', 'Continental Breakfast'],
    adults: 2, children: 0,
    deals: [
      deal('Early Bird Deal', 'Book 30 days ahead & save 20%', 'Direct', { discountPercentage: 20 }),
      deal('AAA Discount', '10% off for AAA members', 'AAA', { discountPercentage: 10 }),
    ],
  }),
  hotel({
    placeID: 'mock_anabella',
    name: 'Anabella Hotel',
    address: '1030 W Katella Ave, Anaheim, CA 92802',
    latitude: 33.8030, longitude: -117.9198,
    rating: 4.2, reviewCount: 3860, priceLevel: 2, pricePerNight: 139,
    websiteURL: 'https://www.anabellahotel.com/',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Free Shuttle', 'Fitness Center', 'Business Center'],
    adults: 2, children: 0,
    deals: [
      deal('Expedia Deal', 'Save 12% on Expedia', 'Expedia', { discountPercentage: 12 }),
      deal('AARP Senior Rate', 'AARP members save 10%', 'AARP', { discountPercentage: 10 }),
    ],
  }),
  hotel({
    placeID: 'mock_desert_palms',
    name: 'Desert Palms Hotel & Suites',
    address: '631 W Katella Ave, Anaheim, CA 92802',
    latitude: 33.8028, longitude: -117.9263,
    rating: 4.3, reviewCount: 4590, priceLevel: 2, pricePerNight: 155,
    websiteURL: 'https://www.desertpalmshotel.com/',
    amenities: ['Pool', 'Suites Available', 'Kitchen Suites', 'Free Breakfast', 'Shuttle', 'BBQ Area'],
    adults: 2, children: 0,
    deals: [
      deal('Costco Travel Deal', 'Save up to 15% via Costco Travel', 'Costco Travel', { discountPercentage: 15 }),
      deal('Family Package', 'Kids eat free + pool access', 'Direct'),
    ],
  }),
  hotel({
    placeID: 'mock_park_vue',
    name: 'Park Vue Inn',
    address: '1570 S Harbor Blvd, Anaheim, CA 92802',
    latitude: 33.8056, longitude: -117.9211,
    rating: 3.9, reviewCount: 2120, priceLevel: 1, pricePerNight: 99,
    websiteURL: 'https://www.parkvueinn.com/',
    amenities: ['Pool', 'Free Parking', 'Walking Distance', 'Microwave/Fridge in Rooms'],
    adults: 2, children: 0,
    deals: [
      deal('Booking.com Genius', 'Genius members get 10% off', 'Booking.com', { discountPercentage: 10 }),
      deal('AARP Discount', 'AARP members save 10%', 'AARP', { discountPercentage: 10 }),
    ],
  }),
  hotel({
    placeID: 'mock_carousel',
    name: 'Carousel Inn & Suites',
    address: '1530 S Harbor Blvd, Anaheim, CA 92802',
    latitude: 33.8063, longitude: -117.9212,
    rating: 4.0, reviewCount: 2870, priceLevel: 2, pricePerNight: 129,
    websiteURL: 'https://www.carouselinnanaheim.com/',
    amenities: ['Rooftop Pool', 'Free Parking', 'Sundeck', 'Suites', 'Free Shuttle'],
    adults: 2, children: 0,
    deals: [
      deal('Hotels.com Secret Price', 'Members-only rate', 'Hotels.com', { discountPercentage: 8 }),
      deal('Military Appreciation', '10% off for active/veteran military', 'Military', { discountPercentage: 10, promoCode: 'MILITARY10' }),
    ],
  }),
  hotel({
    placeID: 'mock_clarion',
    name: 'Clarion Hotel Anaheim Resort',
    address: '616 Convention Way, Anaheim, CA 92802',
    latitude: 33.8020, longitude: -117.9237,
    rating: 3.8, reviewCount: 3140, priceLevel: 2, pricePerNight: 115,
    websiteURL: 'https://www.clarionhotelanaheim.com/',
    amenities: ['Pool', 'Restaurant', 'Fitness Center', 'Business Center', 'Free Parking', 'Convention Access'],
    adults: 2, children: 0,
    deals: [
      deal('AAA/CAA', 'AAA members save 10%', 'AAA', { discountPercentage: 10 }),
      deal('Government/Military Rate', 'Verified save 15%', 'Military', { discountPercentage: 15 }),
    ],
  }),
]
