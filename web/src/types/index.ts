export type DealSource = 'AAA' | 'AARP' | 'Military' | 'Costco Travel' | 'Hotels.com' | 'Booking.com' | 'Expedia' | 'Direct' | 'Other'

export type Membership = 'aaa' | 'aarp' | 'military' | 'costco'

export interface HotelDeal {
  id: string
  title: string
  description: string
  discountPercentage?: number
  discountAmount?: number
  promoCode?: string
  source: DealSource
  requiredMembership?: Membership   // if set, only show when user has this membership
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
  deals: HotelDeal[]
  websiteURL?: string
  phoneNumber?: string
  amenities: string[]
  isFavorite: boolean
  checkIn?: string
  checkOut?: string
  adults: number
  children: number
  distanceFromDisneyland: number
}

export type SortOption = 'bestValue' | 'lowestPrice' | 'highestPrice' | 'topRated' | 'closest' | 'mostDeals'

export interface SearchParameters {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  sortBy: SortOption
  minRating: number
  memberships: Membership[]
}

export type TabId = 'search' | 'results' | 'saved'
