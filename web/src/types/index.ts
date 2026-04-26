export type DealSource = 'AAA' | 'AARP' | 'Military' | 'Costco Travel' | 'Hotels.com' | 'Booking.com' | 'Expedia' | 'Direct' | 'Other'

export interface HotelDeal {
  id: string
  title: string
  description: string
  discountPercentage?: number
  discountAmount?: number
  promoCode?: string
  source: DealSource
  isVerified: boolean
}

export interface Hotel {
  id: string
  placeID: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number
  reviewCount: number
  priceLevel: number
  photoReference?: string
  pricePerNight?: number
  totalPrice?: number
  deals: HotelDeal[]
  websiteURL?: string
  phoneNumber?: string
  amenities: string[]
  isFavorite: boolean
  checkIn?: string   // ISO date string yyyy-MM-dd
  checkOut?: string
  adults: number
  children: number
  distanceFromDisneyland: number  // miles, pre-computed
}

export type SortOption = 'bestValue' | 'lowestPrice' | 'highestPrice' | 'topRated' | 'closest' | 'mostDeals'

export interface SearchParameters {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  sortBy: SortOption
  maxPricePerNight: number
  minRating: number
}

export type TabId = 'search' | 'results' | 'saved'
