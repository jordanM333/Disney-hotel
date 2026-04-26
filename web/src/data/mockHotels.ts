import { Hotel, HotelDeal, Membership } from '../types'
import { distanceFromDisneyland } from '../utils/locationHelper'

function deal(
  title: string,
  description: string,
  source: HotelDeal['source'],
  opts: Partial<HotelDeal> = {}
): HotelDeal {
  return { id: Math.random().toString(36).slice(2), title, description, source, isVerified: true, ...opts }
}

// Membership-gated deals
function memberDeal(
  title: string,
  description: string,
  source: HotelDeal['source'],
  membership: Membership,
  opts: Partial<HotelDeal> = {}
): HotelDeal {
  return deal(title, description, source, { requiredMembership: membership, ...opts })
}

function hotel(base: Omit<Hotel, 'id' | 'distanceFromDisneyland' | 'isFavorite'>): Hotel {
  return {
    ...base,
    id: base.placeID,
    isFavorite: false,
    distanceFromDisneyland: distanceFromDisneyland(base.latitude, base.longitude),
  }
}

export const MOCK_HOTELS: Hotel[] = [
  hotel({
    placeID: 'mock_disneyland_hotel',
    name: 'Disneyland Hotel',
    address: '1150 Magic Way, Anaheim, CA 92802',
    latitude: 33.8090, longitude: -117.9234,
    rating: 4.6, reviewCount: 18450, priceLevel: 4,
    websiteURL: 'https://disneyland.disney.go.com/hotels/disneyland-hotel/',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Room Service', 'Fitness Center', 'Character Dining', 'Early Park Access', 'Monorail Access'],
    adults: 2, children: 0,
    deals: [
      deal('Magic Ticket Package', 'Save up to 25% when bundling park tickets.', 'Direct', { discountPercentage: 25 }),
      memberDeal('AAA Member Rate', 'Show AAA card at check-in for 10% off.', 'AAA', 'aaa', { discountPercentage: 10, promoCode: 'AAA10' }),
    ],
  }),
  hotel({
    placeID: 'mock_grand_californian',
    name: "Disney's Grand Californian Hotel & Spa",
    address: '1600 S Disneyland Dr, Anaheim, CA 92802',
    latitude: 33.8099, longitude: -117.9194,
    rating: 4.8, reviewCount: 12830, priceLevel: 4,
    websiteURL: 'https://disneyland.disney.go.com/hotels/grand-californian-hotel/',
    amenities: ['Spa', '3 Pools', '5 Restaurants', 'Direct Park Access', 'Concierge', 'Early Park Entry', 'Fitness Center', 'Character Dining'],
    adults: 2, children: 0,
    deals: [
      deal('Stay More Save More', 'Book 3+ nights and save 20%.', 'Direct', { discountPercentage: 20 }),
      memberDeal('AAA Member Rate', 'Up to 15% off for AAA members.', 'AAA', 'aaa', { discountPercentage: 15, promoCode: 'AAA15' }),
    ],
  }),
  hotel({
    placeID: 'mock_candy_cane_inn',
    name: 'Candy Cane Inn',
    address: '1747 S Harbor Blvd, Anaheim, CA 92802',
    latitude: 33.8046, longitude: -117.9210,
    rating: 4.5, reviewCount: 6742, priceLevel: 2,
    websiteURL: 'https://www.candycaneinn.net/',
    amenities: ['Pool', 'Free Breakfast', 'Free Parking', 'Shuttle to Disneyland', 'Fitness Center'],
    adults: 2, children: 0,
    deals: [
      deal('Book Direct & Save', 'Best rate guarantee when booking direct.', 'Direct', { discountPercentage: 5 }),
      memberDeal('AAA Rate', '10% off for AAA members.', 'AAA', 'aaa', { discountPercentage: 10 }),
    ],
  }),
  hotel({
    placeID: 'mock_howard_johnson',
    name: 'Howard Johnson by Wyndham Anaheim Hotel & Water Playground',
    address: '1380 S Harbor Blvd, Anaheim, CA 92802',
    latitude: 33.8102, longitude: -117.9212,
    rating: 4.1, reviewCount: 5320, priceLevel: 3,
    websiteURL: 'https://www.hojo.com/anaheim',
    amenities: ['Water Playground', 'Pool', 'Free Parking', 'Game Room', 'Restaurant', 'Shuttle to Disneyland'],
    adults: 2, children: 0,
    deals: [
      deal('Wyndham Rewards', 'Earn points redeemable for free nights.', 'Direct'),
      memberDeal('AAA Savings', '15% discount for AAA members.', 'AAA', 'aaa', { discountPercentage: 15 }),
      memberDeal('Military Rate', 'Active duty & veterans save 10%.', 'Military', 'military', { discountPercentage: 10 }),
    ],
  }),
  hotel({
    placeID: 'mock_tropicana',
    name: 'Tropicana Inn & Suites',
    address: '1540 S Harbor Blvd, Anaheim, CA 92802',
    latitude: 33.8061, longitude: -117.9212,
    rating: 4.0, reviewCount: 4180, priceLevel: 2,
    websiteURL: 'https://www.tropicanainn-anaheim.com/',
    amenities: ['Pool', 'Free Parking', 'Walking Distance to Parks', 'Continental Breakfast'],
    adults: 2, children: 0,
    deals: [
      deal('Early Bird Rate', 'Book 30+ days ahead and save 20%.', 'Direct', { discountPercentage: 20 }),
      memberDeal('AAA Discount', '10% off for AAA members.', 'AAA', 'aaa', { discountPercentage: 10 }),
    ],
  }),
  hotel({
    placeID: 'mock_anabella',
    name: 'Anabella Hotel',
    address: '1030 W Katella Ave, Anaheim, CA 92802',
    latitude: 33.8030, longitude: -117.9198,
    rating: 4.2, reviewCount: 3860, priceLevel: 2,
    websiteURL: 'https://www.anabellahotel.com/',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Free Shuttle', 'Fitness Center', 'Business Center'],
    adults: 2, children: 0,
    deals: [
      deal('Expedia Sale', 'Save 12% on Expedia — no membership required.', 'Expedia', { discountPercentage: 12 }),
      memberDeal('AARP Senior Rate', 'AARP members save 10%.', 'AARP', 'aarp', { discountPercentage: 10 }),
    ],
  }),
  hotel({
    placeID: 'mock_desert_palms',
    name: 'Desert Palms Hotel & Suites',
    address: '631 W Katella Ave, Anaheim, CA 92802',
    latitude: 33.8028, longitude: -117.9263,
    rating: 4.3, reviewCount: 4590, priceLevel: 2,
    websiteURL: 'https://www.desertpalmshotel.com/',
    amenities: ['Pool', 'Suites Available', 'Kitchen Suites', 'Free Breakfast', 'Shuttle', 'BBQ Area'],
    adults: 2, children: 0,
    deals: [
      deal('Family Package', 'Kids eat free + complimentary pool access.', 'Direct'),
      memberDeal('Costco Travel Deal', 'Save 10–15% plus hotel credit via Costco Travel.', 'Costco Travel', 'costco', { discountPercentage: 12 }),
    ],
  }),
  hotel({
    placeID: 'mock_park_vue',
    name: 'Park Vue Inn',
    address: '1570 S Harbor Blvd, Anaheim, CA 92802',
    latitude: 33.8056, longitude: -117.9211,
    rating: 3.9, reviewCount: 2120, priceLevel: 1,
    websiteURL: 'https://www.parkvueinn.com/',
    amenities: ['Pool', 'Free Parking', 'Walking Distance', 'Microwave/Fridge in Rooms'],
    adults: 2, children: 0,
    deals: [
      deal('Booking.com Deal', 'Genius members unlock 10% off.', 'Booking.com', { discountPercentage: 10 }),
      memberDeal('AARP Discount', 'AARP members save 10%.', 'AARP', 'aarp', { discountPercentage: 10 }),
    ],
  }),
  hotel({
    placeID: 'mock_carousel',
    name: 'Carousel Inn & Suites',
    address: '1530 S Harbor Blvd, Anaheim, CA 92802',
    latitude: 33.8063, longitude: -117.9212,
    rating: 4.0, reviewCount: 2870, priceLevel: 2,
    websiteURL: 'https://www.carouselinnanaheim.com/',
    amenities: ['Rooftop Pool', 'Free Parking', 'Sundeck', 'Suites', 'Free Shuttle'],
    adults: 2, children: 0,
    deals: [
      deal('Hotels.com Secret Price', 'Members-only rate — sign in to unlock.', 'Hotels.com', { discountPercentage: 8 }),
      memberDeal('Military Appreciation', '10% off for active/veteran military.', 'Military', 'military', { discountPercentage: 10, promoCode: 'MILITARY10' }),
    ],
  }),
  hotel({
    placeID: 'mock_clarion',
    name: 'Clarion Hotel Anaheim Resort',
    address: '616 Convention Way, Anaheim, CA 92802',
    latitude: 33.8020, longitude: -117.9237,
    rating: 3.8, reviewCount: 3140, priceLevel: 2,
    websiteURL: 'https://www.clarionhotelanaheim.com/',
    amenities: ['Pool', 'Restaurant', 'Fitness Center', 'Business Center', 'Free Parking', 'Convention Access'],
    adults: 2, children: 0,
    deals: [
      deal('Choice Privileges', 'Earn points toward free nights.', 'Direct'),
      memberDeal('AAA/CAA Rate', 'AAA members save 10%.', 'AAA', 'aaa', { discountPercentage: 10 }),
      memberDeal('Government/Military Rate', 'Verified save 15%.', 'Military', 'military', { discountPercentage: 15 }),
    ],
  }),
]
